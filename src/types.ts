
export enum TeamName {
  DC = 'Delhi Capitals',
  UPW = 'UP Warriorz',
  GG = 'Gujarat Giants',
  RCB = 'Royal Challengers Bangalore',
  MI = 'Mumbai Indians'
}

export interface PlayerStats {
  name: string;
  role: 'Batter' | 'Bowler' | 'All-rounder' | 'WK';
  recentFormIndex: number; // 0-1
}

export interface TeamStats {
  name: TeamName;
  played: number;
  won: number;
  lost: number;
  nrr: number;
  points: number;
  elo: number;
  recentForm: ('W' | 'L')[];
  powerplay_performance: number;
  death_bowling_strength: number;
}

export interface LiveMetrics {
  runsNeeded: number;
  ballsLeft: number;
  wicketsLost: number;
  currentRR: number;
  requiredRR: number;
  target: number;
  isNightMatch: boolean;
  humidityLevel: number; // 0-100
  dewLikelihood: number; // 0-1
  // Added scoreString to fix property access errors in LiveMatchTracker.tsx
  scoreString?: string;
}

export interface Match {
  id: string;
  stage: 'League' | 'Eliminator' | 'Final';
  team1: TeamName;
  team2: TeamName;
  status: 'Upcoming' | 'Live' | 'Completed';
  winner?: TeamName;
  score1?: string;
  score2?: string;
  summary?: string;
  playerOfTheMatch?: string;
  liveMetrics?: LiveMetrics;
  historicalH2H?: string; 
  venue?: string;
  playingXI?: {
    team1: PlayerStats[];
    team2: PlayerStats[];
  };
  prediction?: {
    team1WinProb: number;
    team2WinProb: number;
    confidence: 'High' | 'Medium' | 'Lean' | 'Toss-up';
    factors: string[];
    xiStrengthIndex?: { t1: number, t2: number };
    dewImpact?: number;
    ensembleMetrics?: {
      momentum_score: number;
      pressure_index: number;
    predictedPOTM?: string;
    };
  };
}

export interface TournamentState {
  standings: TeamStats[];
  matches: Match[];
  lastUpdated: string;
  predictedChampion: TeamName | null;
  confidenceScore: number;
  volatilityIndex: number; 
  // Added to store URLs from Google Search grounding
  searchSources?: { title?: string, uri?: string }[];
}
