
import { TeamName, TeamStats, Match } from './types';

export const INITIAL_TEAMS: TeamStats[] = [
  { 
    name: TeamName.RCB, 
    played: 12, 
    won: 10, 
    lost: 2, 
    nrr: 1.247, 
    points: 20, 
    elo: 1745,
    recentForm: ['W', 'W', 'W', 'W', 'L'],
    powerplay_performance: 0.88,
    death_bowling_strength: 0.82
  },
  { 
    name: TeamName.GG, 
    played: 12, 
    won: 8, 
    lost: 4, 
    nrr: 0.612, 
    points: 16, 
    elo: 1640,
    recentForm: ['W', 'L', 'W', 'W', 'W'],
    powerplay_performance: 0.72,
    death_bowling_strength: 0.65
  },
  { 
    name: TeamName.MI, 
    played: 12, 
    won: 7, 
    lost: 5, 
    nrr: 0.245, 
    points: 14, 
    elo: 1595,
    recentForm: ['L', 'W', 'L', 'W', 'W'],
    powerplay_performance: 0.81,
    death_bowling_strength: 0.89
  },
  { 
    name: TeamName.DC, 
    played: 11, 
    won: 5, 
    lost: 6, 
    nrr: 0.142, 
    points: 10, 
    elo: 1533,
    recentForm: ['L', 'W', 'L', 'W', 'L'],
    powerplay_performance: 0.79,
    death_bowling_strength: 0.71
  },
  { 
    name: TeamName.UPW, 
    played: 11, 
    won: 5, 
    lost: 6, 
    nrr: -0.089, 
    points: 10, 
    elo: 1522,
    recentForm: ['L', 'L', 'W', 'L', 'W'],
    powerplay_performance: 0.65,
    death_bowling_strength: 0.78
  },
];

export const VENUE_DATA: Record<string, any> = {
  'DY Patil': { dew_factor: 0.7 },
  'Arun Jaitley': { dew_factor: 0.5 },
  'M Chinnaswamy': { dew_factor: 0.4 },
  'Brabourne': { dew_factor: 0.6 },
  'Wankhede': { dew_factor: 0.65 }
};

export const INITIAL_MATCHES: Match[] = [
  {
    id: 'm1',
    stage: 'League',
    team1: TeamName.DC,
    team2: TeamName.UPW,
    status: 'Live',
    venue: 'Arun Jaitley',
    score1: '191/5 (20.0 ov)',
    score2: '122/8 (16.2 ov)',
    summary: 'UP Warriorz chasing 192. Required RR spiking as wickets tumble.',
    historicalH2H: 'DC 4 - 2 UPW.',
    playingXI: {
      team1: [
        { name: 'Meg Lanning', role: 'Batter', recentFormIndex: 0.85 },
        { name: 'Shafali Verma', role: 'Batter', recentFormIndex: 0.72 },
        { name: 'Alice Capsey', role: 'All-rounder', recentFormIndex: 0.78 },
        { name: 'Jemimah Rodrigues', role: 'Batter', recentFormIndex: 0.81 },
        { name: 'Marizanne Kapp', role: 'All-rounder', recentFormIndex: 0.92 },
        { name: 'Jess Jonassen', role: 'Bowler', recentFormIndex: 0.84 },
        { name: 'Taniya Bhatia', role: 'WK', recentFormIndex: 0.65 },
        { name: 'Radha Yadav', role: 'Bowler', recentFormIndex: 0.75 },
        { name: 'Shikha Pandey', role: 'Bowler', recentFormIndex: 0.78 },
        { name: 'Titas Sadhu', role: 'Bowler', recentFormIndex: 0.70 },
        { name: 'A Reddy', role: 'Bowler', recentFormIndex: 0.72 }
      ],
      team2: [
        { name: 'Alyssa Healy', role: 'WK', recentFormIndex: 0.78 },
        { name: 'Kiran Navgire', role: 'Batter', recentFormIndex: 0.65 },
        { name: 'Chamari Athapaththu', role: 'All-rounder', recentFormIndex: 0.85 },
        { name: 'Grace Harris', role: 'All-rounder', recentFormIndex: 0.88 },
        { name: 'Shweta Sehrawat', role: 'Batter', recentFormIndex: 0.62 },
        { name: 'Sophie Ecclestone', role: 'Bowler', recentFormIndex: 0.94 },
        { name: 'Deepti Sharma', role: 'All-rounder', recentFormIndex: 0.89 },
        { name: 'Poonam Khemnar', role: 'All-rounder', recentFormIndex: 0.68 },
        { name: 'Rajeshwari Gayakwad', role: 'Bowler', recentFormIndex: 0.76 },
        { name: 'Saima Thakor', role: 'Bowler', recentFormIndex: 0.70 },
        { name: 'Anjali Sarvani', role: 'Bowler', recentFormIndex: 0.72 }
      ]
    },
    liveMetrics: {
      runsNeeded: 70,
      ballsLeft: 22,
      wicketsLost: 8,
      currentRR: 7.46,
      requiredRR: 19.09,
      target: 192,
      scoreString: '122/8 (16.2 ov)',
      isNightMatch: true,
      humidityLevel: 68,
      dewLikelihood: 0.7
    }
  },
  {
    id: 'm2',
    stage: 'Eliminator',
    team1: TeamName.GG,
    team2: TeamName.MI,
    venue: 'M Chinnaswamy',
    status: 'Upcoming',
    historicalH2H: 'GG 2 - 5 MI.',
  },
  {
    id: 'm3',
    stage: 'Final',
    team1: TeamName.RCB,
    team2: TeamName.GG,
    venue: 'Arun Jaitley',
    status: 'Upcoming',
  }
];

export const TEAM_COLORS: Record<TeamName, string> = {
  [TeamName.DC]: '#004C93',
  [TeamName.MI]: '#004BA0',
  [TeamName.RCB]: '#2B2A29',
  [TeamName.GG]: '#F26522',
  [TeamName.UPW]: '#FFCC00',
};

// Use high-availability mirrored images from sports CDNs
export const TEAM_LOGOS: Record<TeamName, string> = {
  [TeamName.DC]: 'https://static.cricbuzz.com/a/img/v1/72x72/i1/c352064/delhi-capitals-women.jpg',
  [TeamName.MI]: 'https://static.cricbuzz.com/a/img/v1/72x72/i1/c352061/mumbai-indians-women.jpg',
  [TeamName.RCB]: 'https://static.cricbuzz.com/a/img/v1/72x72/i1/c352062/royal-challengers-bangalore-women.jpg',
  [TeamName.GG]: 'https://static.cricbuzz.com/a/img/v1/72x72/i1/c352063/gujarat-giants.jpg',
  [TeamName.UPW]: 'https://static.cricbuzz.com/a/img/v1/72x72/i1/c352065/up-warriorz.jpg',
};

export const DATA_SOURCE = "WPL Season 4 Official + Historical Analysis";
export const LAST_UPDATED = new Date().toISOString();
export const MODEL_VERSION = "v2.5-mobile-optimized";
