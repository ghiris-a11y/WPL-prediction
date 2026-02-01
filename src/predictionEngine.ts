
import { TeamName, TeamStats, Match, LiveMetrics, PlayerStats } from './types';
import { VENUE_DATA } from './constants';

const DEW_PENALTY_LOGIT = 0.45;

function calculateXIStrength(players: PlayerStats[] | undefined, teamStats?: TeamStats): number {
  let baseStrength = 0.75;
  
  if (teamStats) {
    const eloFactor = (teamStats.elo - 1500) / 1000; 
    const formFactor = (teamStats.recentForm.filter(f => f === 'W').length / teamStats.recentForm.length) * 0.15;
    baseStrength = 0.60 + eloFactor + formFactor;
  }

  if (!players || players.length === 0) return Math.min(0.92, baseStrength);
  
  // Weighted average of player form to ensure team variance
  const avgForm = players.reduce((acc, p) => acc + (p.recentFormIndex || 0.7), 0) / players.length;
  const balanceBonus = players.length >= 11 ? 0.08 : 0;
  
  // Combine base team stats with actual roster performance
  const finalValue = (avgForm * 0.6) + (baseStrength * 0.4) + balanceBonus;
  return Math.max(0.4, Math.min(0.98, finalValue));
}

function plattScaling(logit: number): number {
  const A = -1.15; 
  const B = 0.03; 
  const val = 1 / (1 + Math.exp(A * logit + B));
  return isNaN(val) ? 0.5 : val;
}

function getLogRegLogit(
  t1: TeamStats, 
  t2: TeamStats, 
  stage: string, 
  venue?: string,
  live?: LiveMetrics,
  xiStrengthT1: number = 0.75,
  xiStrengthT2: number = 0.75
): number {
  const momentum_t1 = t1.recentForm.filter(r => r === 'W').length / t1.recentForm.length;
  const momentum_t2 = t2.recentForm.filter(r => r === 'W').length / t2.recentForm.length;
  
  const pressure_map: Record<string, number> = { 'Final': 1.0, 'Eliminator': 0.8, 'League': 0.4 };
  const pressure_index = pressure_map[stage] || 0.4;

  const f_xi = (xiStrengthT1 - xiStrengthT2) * 4.2;
  const f_momentum = (momentum_t1 - momentum_t2) * 2.5;
  const f_pressure = pressure_index * (t1.death_bowling_strength - t2.death_bowling_strength) * 3.0;

  let logit = f_xi + f_momentum + f_pressure;

  if (live?.isNightMatch) {
    const dewLikelihood = live?.dewLikelihood || 0.7;
    logit -= (DEW_PENALTY_LOGIT * dewLikelihood);
  }

  if (live && live.ballsLeft > 0) {
    const rrr = live.requiredRR;
    const crr = live.currentRR;
    const chase_pressure = (rrr - crr) * (1 / (live.ballsLeft / 120)) * 0.6;
    logit -= (chase_pressure + (live.wicketsLost * 0.45));
  }

  return isNaN(logit) ? 0 : logit;
}

export function calculateEnsembleProb(t1: TeamStats, t2: TeamStats, match: Match): number {
  const s1 = calculateXIStrength(match.playingXI?.team1, t1);
  const s2 = calculateXIStrength(match.playingXI?.team2, t2);

  const logRegLogit = getLogRegLogit(t1, t2, match.stage, match.venue, match.liveMetrics, s1, s2);
  const p_logreg = plattScaling(logRegLogit);
  
  const eloDiff = t2.elo - t1.elo;
  const p_elo = 1 / (1 + Math.pow(10, eloDiff / 400));
  
  let finalProb = (p_logreg * 0.75) + (p_elo * 0.25);
  return Math.max(0.01, Math.min(0.99, finalProb));
}

export function calculateVolatility(teams: TeamStats[]): number {
  const raceTeams = teams.filter(t => t.name !== TeamName.RCB);
  let totalDiff = 0;
  for (let i = 0; i < raceTeams.length - 1; i++) {
    totalDiff += Math.abs(raceTeams[i].points - raceTeams[i+1].points);
    totalDiff += Math.abs(raceTeams[i].nrr - raceTeams[i+1].nrr) * 10;
  }
  return Math.max(10, Math.min(100, 100 - (totalDiff * 15)));
}

export function simulateTournament(teams: TeamStats[], matches: Match[]): Match[] {
  const projectedTeams = teams.map(t => ({ ...t }));
  
  return matches.map(m => {
    const nextMatch = { ...m };
    const t1Stats = teams.find(t => t.name === nextMatch.team1);
    const t2Stats = teams.find(t => t.name === nextMatch.team2);

    if (t1Stats && t2Stats && nextMatch.status !== 'Completed') {
      const p = calculateEnsembleProb(t1Stats, t2Stats, nextMatch);
      const s1 = calculateXIStrength(nextMatch.playingXI?.team1, t1Stats);
      const s2 = calculateXIStrength(nextMatch.playingXI?.team2, t2Stats);

      nextMatch.prediction = {
        team1WinProb: p,
        team2WinProb: 1 - p,
        confidence: p > 0.75 || p < 0.25 ? 'High' : 'Medium',
        xiStrengthIndex: { t1: s1, t2: s2 },
        dewImpact: (nextMatch.liveMetrics?.isNightMatch || true) ? -15 : 0,
        factors: [
          `XI Power: ${(s1 * 100).toFixed(0)} vs ${(s2 * 100).toFixed(0)}`,
          `Pressure Calibration: ${nextMatch.stage}`,
          `Ensemble Momentum: ${(t1Stats.elo/1000).toFixed(1)}x Factor`
        ],
        ensembleMetrics: {
          momentum_score: t1Stats.recentForm.filter(r => r === 'W').length / t1Stats.recentForm.length,
          pressure_index: nextMatch.stage === 'Final' ? 1.0 : 0.8
        }
      };
    }
    return nextMatch;
  });
}
