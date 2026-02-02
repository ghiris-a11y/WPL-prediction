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
  impactScore?: number; // Overall impact in recent matches
  strikeRate?: number;
  economy?: number;
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
  homeAdvantage?: number;
  clutchFactor?: number; // Performance in pressure situations
}
export interface LiveMetrics {
  runsNeeded: number;
  ballsLeft: number;
  wicketsLost: number;
  currentRR: number;
  requiredRR: number;
  target: number;
  isNightMatch: boolean;
  humidityLevel: number;
  dewLikelihood: number;
  scoreString?: string;
  partnership?: number;
  lastFiveOvers?: string;
}
export interface PredictedPOTM {
  player: PlayerStats;
  team: TeamName;
  probability: number;
  reasoning: string;
}
export interface MatchPrediction {
  team1WinProb: number;
  team2WinProb: number;
  confidence: 'High' | 'Medium' | 'Lean' | 'Toss-up';
  factors: string[];
  xiStrengthIndex?: { t1: number; t2: number };
  dewImpact?: number;
  ensembleMetrics?: {
    momentum_score: number;
    pressure_index: number;
    gradient_boost_score: number;
  };
  predictedPOTM?: PredictedPOTM;
  modelAccuracy?: number;
}
export interface Match {
  id: string;
  matchNumber?: number;
  stage: 'League' | 'Eliminator' | 'Qualifier' | 'Final';
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
  date?: string;
  time?: string;
  playingXI?: {
    team1: PlayerStats[];
    team2: PlayerStats[];
  };
  prediction?: MatchPrediction;
}
export interface TournamentState {
  standings: TeamStats[];
  matches: Match[];
  lastUpdated: string;
  predictedChampion: TeamName | null;
  confidenceScore: number;
  volatilityIndex: number;
  overallAccuracy: number;
  searchSources?: { title?: string; uri?: string }[];
}
export interface AccuracyMetrics {
  totalPredictions: number;
  correctPredictions: number;
  matchWinnerAccuracy: number;
  playoffAccuracy: number;
  potmAccuracy: number;
  modelVersion: string;
}
