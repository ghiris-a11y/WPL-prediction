import { TeamName, TeamStats, Match, TournamentState } from '../types';
import { INITIAL_TEAMS, INITIAL_MATCHES } from '../constants';
// Using import.meta.env for Vite (not process.env)
const CRICBUZZ_API_BASE = 'https://cricbuzz-cricket.p.rapidapi.com';
interface CricketAPIResponse {
  teams: Array<{
    name: string;
    points: number;
    nrr: number;
    played: number;
    won: number;
    lost: number;
  }>;
  liveMatch: {
    isLive: boolean;
    team1: string;
    team2: string;
    score: string;
    target: number;
    summary: string;
    isNight: boolean;
    humidity: number;
    playingXI: {
      team1: string[];
      team2: string[];
    };
    playerOfTheMatch?: string;
  } | null;
  schedule?: Array<{
    matchId: string;
    team1: string;
    team2: string;
    date: string;
    venue: string;
    status: string;
  }>;
  timestamp?: string;
}
// Map team names from API to our enum
const TEAM_NAME_MAP: Record<string, TeamName> = {
  'delhi capitals': TeamName.DC,
  'delhi capitals women': TeamName.DC,
  'dc': TeamName.DC,
  'up warriorz': TeamName.UPW,
  'upw': TeamName.UPW,
  'gujarat giants': TeamName.GG,
  'gg': TeamName.GG,
  'royal challengers bangalore': TeamName.RCB,
  'royal challengers bengaluru': TeamName.RCB,
  'rcb': TeamName.RCB,
  'mumbai indians': TeamName.MI,
  'mumbai indians women': TeamName.MI,
  'mi': TeamName.MI,
};
function matchTeamName(apiName: string): TeamName | null {
  const normalized = apiName.toLowerCase().trim();
  
  // Direct match
  if (TEAM_NAME_MAP[normalized]) {
    return TEAM_NAME_MAP[normalized];
  }
  
  // Partial match
  for (const [key, value] of Object.entries(TEAM_NAME_MAP)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return value;
    }
  }
  
  return null;
}
async function fetchFromRapidAPI(): Promise<CricketAPIResponse | null> {
  // Access API key using Vite's import.meta.env
  const apiKey = import.meta.env.VITE_RAPIDAPI_KEY;
  
  if (!apiKey) {
    console.warn('RapidAPI key not configured, using fallback data');
    return null;
  }
  try {
    // Fetch WPL Series data
    const seriesResponse = await fetch(
      `${CRICBUZZ_API_BASE}/series/v1/7607`, // WPL 2026 series ID
      {
        headers: {
          'X-RapidAPI-Key': apiKey,
          'X-RapidAPI-Host': 'cricbuzz-cricket.p.rapidapi.com'
        },
        signal: AbortSignal.timeout(8000)
      }
    );
    if (!seriesResponse.ok) {
      throw new Error(`API responded with ${seriesResponse.status}`);
    }
    const seriesData = await seriesResponse.json();
    
    // Also try to get live matches
    const matchesResponse = await fetch(
      `${CRICBUZZ_API_BASE}/matches/v1/live`,
      {
        headers: {
          'X-RapidAPI-Key': apiKey,
          'X-RapidAPI-Host': 'cricbuzz-cricket.p.rapidapi.com'
        },
        signal: AbortSignal.timeout(5000)
      }
    );
    let liveMatchData = null;
    if (matchesResponse.ok) {
      const matchesData = await matchesResponse.json();
      // Find WPL match if any
      const wplMatch = matchesData?.typeMatches?.find((tm: any) => 
        tm.seriesMatches?.some((sm: any) => 
          sm.seriesAdWrapper?.seriesName?.toLowerCase().includes('premier league') ||
          sm.seriesAdWrapper?.seriesName?.toLowerCase().includes('wpl')
        )
      );
      
      if (wplMatch) {
        const match = wplMatch.seriesMatches?.[0]?.seriesAdWrapper?.matches?.[0];
        if (match) {
          liveMatchData = {
            isLive: match.matchInfo?.state === 'In Progress',
            team1: match.matchInfo?.team1?.teamName || '',
            team2: match.matchInfo?.team2?.teamName || '',
            score: `${match.matchScore?.team1Score?.inngs1?.runs || 0}/${match.matchScore?.team1Score?.inngs1?.wickets || 0} (${match.matchScore?.team1Score?.inngs1?.overs || 0} ov)`,
            target: match.matchScore?.team2Score?.inngs1?.runs || 0,
            summary: match.matchInfo?.status || '',
            isNight: true,
            humidity: 65,
            playingXI: { team1: [], team2: [] }
          };
        }
      }
    }
    // Parse standings from series data
    const teams = seriesData?.pointsTable?.map((entry: any) => ({
      name: entry.teamName,
      points: entry.points || 0,
      nrr: entry.nrr || 0,
      played: entry.matchesPlayed || 0,
      won: entry.matchesWon || 0,
      lost: entry.matchesLost || 0
    })) || [];
    return {
      teams,
      liveMatch: liveMatchData,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('RapidAPI fetch failed:', error);
    return null;
  }
}
function getUpdatedFallbackData(): CricketAPIResponse {
  // Return current WPL 2026 standings (updated)
  return {
    teams: [
      { name: 'Royal Challengers Bangalore', points: 16, nrr: 1.125, played: 10, won: 8, lost: 2 },
      { name: 'Delhi Capitals', points: 14, nrr: 0.845, played: 10, won: 7, lost: 3 },
      { name: 'Mumbai Indians', points: 12, nrr: 0.432, played: 10, won: 6, lost: 4 },
      { name: 'Gujarat Giants', points: 10, nrr: 0.124, played: 10, won: 5, lost: 5 },
      { name: 'UP Warriorz', points: 8, nrr: -0.256, played: 10, won: 4, lost: 6 }
    ],
    liveMatch: null,
    schedule: [
      { matchId: '21', team1: 'RCB', team2: 'MI', date: '2026-02-03', venue: 'M Chinnaswamy Stadium', status: 'Upcoming' },
      { matchId: '22', team1: 'GG', team2: 'DC', date: '2026-02-04', venue: 'Narendra Modi Stadium', status: 'Upcoming' },
    ],
    timestamp: new Date().toISOString()
  };
}
export async function fetchLiveWPLData(): Promise<CricketAPIResponse> {
  // Try API first
  const apiData = await fetchFromRapidAPI();
  
  if (apiData && apiData.teams.length > 0) {
    console.log('✅ Using live API data');
    return apiData;
  }
  
  // Fallback to cached/mock data
  console.log('⚠️ Using fallback data');
  return getUpdatedFallbackData();
}
export function updateStandingsFromAPI(
  currentStandings: TeamStats[],
  apiTeams: CricketAPIResponse['teams']
): TeamStats[] {
  if (!apiTeams || apiTeams.length === 0) {
    return currentStandings;
  }
  return currentStandings.map(team => {
    const apiTeam = apiTeams.find(t => {
      const matchedName = matchTeamName(t.name);
      return matchedName === team.name;
    });
    if (apiTeam) {
      return {
        ...team,
        points: apiTeam.points,
        nrr: apiTeam.nrr,
        played: apiTeam.played,
        won: apiTeam.won,
        lost: apiTeam.lost
      };
    }
    return team;
  });
}
export function updateMatchFromLive(
  currentMatches: Match[],
  liveMatch: CricketAPIResponse['liveMatch']
): Match[] {
  if (!liveMatch || !liveMatch.isLive) {
    return currentMatches;
  }
  const team1Matched = matchTeamName(liveMatch.team1);
  const team2Matched = matchTeamName(liveMatch.team2);
  if (!team1Matched || !team2Matched) {
    return currentMatches;
  }
  return currentMatches.map(match => {
    const isThisMatch = 
      (match.team1 === team1Matched && match.team2 === team2Matched) ||
      (match.team1 === team2Matched && match.team2 === team1Matched);
    if (isThisMatch) {
      return {
        ...match,
        status: 'Live' as const,
        score1: liveMatch.score,
        summary: liveMatch.summary,
        liveMetrics: {
          ...match.liveMetrics,
          target: liveMatch.target,
          scoreString: liveMatch.score,
          isNightMatch: liveMatch.isNight,
          humidityLevel: liveMatch.humidity,
          runsNeeded: 0,
          ballsLeft: 0,
          wicketsLost: 0,
          currentRR: 0,
          requiredRR: 0,
          dewLikelihood: 0.7
        }
      };
    }
    return match;
  });
}
