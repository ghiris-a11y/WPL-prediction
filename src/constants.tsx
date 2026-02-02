import { TeamName, TeamStats, Match } from './types';
// WPL Season 4 (2026) - Updated team data
export const INITIAL_TEAMS: TeamStats[] = [
  {
    name: TeamName.RCB,
    played: 10,
    won: 8,
    lost: 2,
    nrr: 1.125,
    points: 16,
    elo: 1720,
    recentForm: ['W', 'W', 'W', 'L', 'W'],
    powerplay_performance: 0.86,
    death_bowling_strength: 0.84,
    homeAdvantage: 0.15,
    clutchFactor: 0.88
  },
  {
    name: TeamName.DC,
    played: 10,
    won: 7,
    lost: 3,
    nrr: 0.845,
    points: 14,
    elo: 1685,
    recentForm: ['W', 'W', 'L', 'W', 'W'],
    powerplay_performance: 0.82,
    death_bowling_strength: 0.79,
    homeAdvantage: 0.12,
    clutchFactor: 0.82
  },
  {
    name: TeamName.MI,
    played: 10,
    won: 6,
    lost: 4,
    nrr: 0.432,
    points: 12,
    elo: 1640,
    recentForm: ['L', 'W', 'W', 'W', 'L'],
    powerplay_performance: 0.78,
    death_bowling_strength: 0.88,
    homeAdvantage: 0.18,
    clutchFactor: 0.75
  },
  {
    name: TeamName.GG,
    played: 10,
    won: 5,
    lost: 5,
    nrr: 0.124,
    points: 10,
    elo: 1580,
    recentForm: ['W', 'L', 'W', 'L', 'W'],
    powerplay_performance: 0.74,
    death_bowling_strength: 0.72,
    homeAdvantage: 0.08,
    clutchFactor: 0.70
  },
  {
    name: TeamName.UPW,
    played: 10,
    won: 4,
    lost: 6,
    nrr: -0.256,
    points: 8,
    elo: 1545,
    recentForm: ['L', 'L', 'W', 'L', 'W'],
    powerplay_performance: 0.68,
    death_bowling_strength: 0.76,
    homeAdvantage: 0.10,
    clutchFactor: 0.65
  },
];
export const VENUE_DATA: Record<string, { dew_factor: number; avg_first_innings: number; spin_advantage: number }> = {
  'DY Patil': { dew_factor: 0.7, avg_first_innings: 165, spin_advantage: 0.3 },
  'Arun Jaitley': { dew_factor: 0.5, avg_first_innings: 158, spin_advantage: 0.4 },
  'M Chinnaswamy': { dew_factor: 0.4, avg_first_innings: 178, spin_advantage: 0.2 },
  'Brabourne': { dew_factor: 0.6, avg_first_innings: 155, spin_advantage: 0.5 },
  'Wankhede': { dew_factor: 0.65, avg_first_innings: 162, spin_advantage: 0.25 },
  'Narendra Modi': { dew_factor: 0.55, avg_first_innings: 168, spin_advantage: 0.35 }
};
// WPL 2026 Schedule with realistic playoff structure
export const INITIAL_MATCHES: Match[] = [
  {
    id: 'm1',
    matchNumber: 20,
    stage: 'League',
    team1: TeamName.DC,
    team2: TeamName.UPW,
    status: 'Completed',
    winner: TeamName.DC,
    venue: 'Arun Jaitley',
    date: '2026-02-02',
    time: '19:30 IST',
    score1: '191/5 (20.0 ov)',
    score2: '147/9 (20.0 ov)',
    summary: 'Delhi Capitals won by 44 runs',
    playerOfTheMatch: 'Meg Lanning',
    historicalH2H: 'DC leads 5-3',
    playingXI: {
      team1: [
        { name: 'Meg Lanning', role: 'Batter', recentFormIndex: 0.92, impactScore: 95, strikeRate: 148.5 },
        { name: 'Shafali Verma', role: 'Batter', recentFormIndex: 0.85, impactScore: 88, strikeRate: 156.2 },
        { name: 'Alice Capsey', role: 'All-rounder', recentFormIndex: 0.81, impactScore: 82 },
        { name: 'Jemimah Rodrigues', role: 'Batter', recentFormIndex: 0.79, impactScore: 78 },
        { name: 'Marizanne Kapp', role: 'All-rounder', recentFormIndex: 0.88, impactScore: 91, economy: 6.8 },
        { name: 'Jess Jonassen', role: 'Bowler', recentFormIndex: 0.84, economy: 7.2 },
        { name: 'Taniya Bhatia', role: 'WK', recentFormIndex: 0.72 },
        { name: 'Radha Yadav', role: 'Bowler', recentFormIndex: 0.78, economy: 7.5 },
        { name: 'Shikha Pandey', role: 'Bowler', recentFormIndex: 0.76, economy: 8.1 },
        { name: 'Titas Sadhu', role: 'Bowler', recentFormIndex: 0.82, economy: 7.8 },
        { name: 'Arundhati Reddy', role: 'Bowler', recentFormIndex: 0.75, economy: 8.4 }
      ],
      team2: [
        { name: 'Alyssa Healy', role: 'WK', recentFormIndex: 0.80, impactScore: 82, strikeRate: 142.3 },
        { name: 'Kiran Navgire', role: 'Batter', recentFormIndex: 0.68, impactScore: 65 },
        { name: 'Chamari Athapaththu', role: 'All-rounder', recentFormIndex: 0.86, impactScore: 89 },
        { name: 'Grace Harris', role: 'All-rounder', recentFormIndex: 0.84, impactScore: 85 },
        { name: 'Shweta Sehrawat', role: 'Batter', recentFormIndex: 0.65 },
        { name: 'Sophie Ecclestone', role: 'Bowler', recentFormIndex: 0.91, economy: 6.2 },
        { name: 'Deepti Sharma', role: 'All-rounder', recentFormIndex: 0.87, economy: 6.9 },
        { name: 'Poonam Khemnar', role: 'All-rounder', recentFormIndex: 0.70 },
        { name: 'Rajeshwari Gayakwad', role: 'Bowler', recentFormIndex: 0.74, economy: 7.6 },
        { name: 'Saima Thakor', role: 'Bowler', recentFormIndex: 0.68, economy: 8.2 },
        { name: 'Anjali Sarvani', role: 'Bowler', recentFormIndex: 0.71, economy: 8.0 }
      ]
    }
  },
  {
    id: 'm2',
    matchNumber: 21,
    stage: 'League',
    team1: TeamName.RCB,
    team2: TeamName.MI,
    status: 'Upcoming',
    venue: 'M Chinnaswamy',
    date: '2026-02-03',
    time: '19:30 IST',
    historicalH2H: 'RCB leads 4-3',
  },
  {
    id: 'm3',
    matchNumber: 22,
    stage: 'League',
    team1: TeamName.GG,
    team2: TeamName.DC,
    status: 'Upcoming',
    venue: 'Narendra Modi',
    date: '2026-02-04',
    time: '15:30 IST',
    historicalH2H: 'DC leads 3-2',
  },
  {
    id: 'm4',
    stage: 'Eliminator',
    team1: TeamName.MI,
    team2: TeamName.GG,
    status: 'Upcoming',
    venue: 'DY Patil',
    date: '2026-02-08',
    time: '19:30 IST',
    historicalH2H: 'MI leads 5-2',
  },
  {
    id: 'm5',
    stage: 'Qualifier',
    team1: TeamName.RCB,
    team2: TeamName.DC,
    status: 'Upcoming',
    venue: 'M Chinnaswamy',
    date: '2026-02-09',
    time: '19:30 IST',
    historicalH2H: 'RCB leads 4-2',
  },
  {
    id: 'm6',
    stage: 'Final',
    team1: TeamName.RCB,
    team2: TeamName.DC,
    status: 'Upcoming',
    venue: 'Arun Jaitley',
    date: '2026-02-12',
    time: '19:30 IST',
  }
];
export const TEAM_COLORS: Record<TeamName, { primary: string; secondary: string; gradient: string }> = {
  [TeamName.DC]: { 
    primary: '#0066B3', 
    secondary: '#EF3E42',
    gradient: 'from-blue-600 to-red-500'
  },
  [TeamName.MI]: { 
    primary: '#004BA0', 
    secondary: '#FFCC00',
    gradient: 'from-blue-700 to-yellow-400'
  },
  [TeamName.RCB]: { 
    primary: '#EC1C24', 
    secondary: '#000000',
    gradient: 'from-red-600 to-black'
  },
  [TeamName.GG]: { 
    primary: '#F26522', 
    secondary: '#2B3990',
    gradient: 'from-orange-500 to-indigo-700'
  },
  [TeamName.UPW]: { 
    primary: '#7B2D8E', 
    secondary: '#F7931E',
    gradient: 'from-purple-700 to-orange-400'
  },
};
export const TEAM_LOGOS: Record<TeamName, string> = {
  [TeamName.DC]: 'https://static.cricbuzz.com/a/img/v1/72x72/i1/c352064/delhi-capitals-women.jpg',
  [TeamName.MI]: 'https://static.cricbuzz.com/a/img/v1/72x72/i1/c352061/mumbai-indians-women.jpg',
  [TeamName.RCB]: 'https://static.cricbuzz.com/a/img/v1/72x72/i1/c352062/royal-challengers-bangalore-women.jpg',
  [TeamName.GG]: 'https://static.cricbuzz.com/a/img/v1/72x72/i1/c352063/gujarat-giants.jpg',
  [TeamName.UPW]: 'https://static.cricbuzz.com/a/img/v1/72x72/i1/c352065/up-warriorz.jpg',
};
export const DATA_SOURCE = "WPL Season 4 (2026) Official Stats";
export const MODEL_VERSION = "v3.2.1 - Gradient Boost Ensemble";
