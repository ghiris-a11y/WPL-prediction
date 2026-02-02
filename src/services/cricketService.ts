// Robust Cricket Service - API first with hardcoded WPL 2026 schedule fallback
import { TeamName, TeamStats, Match, LiveMetrics } from '../types';

const RAPIDAPI_KEY = import.meta.env.VITE_RAPIDAPI_KEY || '';
const RAPIDAPI_HOST = 'cricbuzz-cricket.p.rapidapi.com';

// ===== HARDCODED WPL 2026 SCHEDULE (FALLBACK DATA) =====
const WPL_2026_SCHEDULE = {
  teams: [
    { name: 'Royal Challengers Bangalore', points: 16, nrr: 1.125, played: 10, won: 8, lost: 2 },
    { name: 'Delhi Capitals', points: 14, nrr: 0.845, played: 10, won: 7, lost: 3 },
    { name: 'Mumbai Indians', points: 12, nrr: 0.432, played: 10, won: 6, lost: 4 },
    { name: 'Gujarat Giants', points: 10, nrr: -0.223, played: 10, won: 5, lost: 5 },
    { name: 'UP Warriorz', points: 8, nrr: -0.567, played: 10, won: 4, lost: 6 }
  ],
  matches: [
    {
      id: 'q1',
      stage: 'Qualifier 1',
      team1: 'Royal Challengers Bangalore',
      team2: 'Delhi Capitals',
      date: '2026-03-18',
      time: '19:30 IST',
      venue: 'M. Chinnaswamy Stadium, Bangalore',
      status: 'upcoming'
    },
    {
      id: 'elim',
      stage: 'Eliminator',
      team1: 'Mumbai Indians',
      team2: 'Gujarat Giants',
      date: '2026-03-19',
      time: '19:30 IST',
      venue: 'Wankhede Stadium, Mumbai',
      status: 'upcoming'
    },
    {
      id: 'q2',
      stage: 'Qualifier 2',
      team1: 'TBD (Loser Q1)',
      team2: 'TBD (Winner Elim)',
      date: '2026-03-21',
      time: '19:30 IST',
      venue: 'Arun Jaitley Stadium, Delhi',
      status: 'upcoming'
    },
    {
      id: 'final',
      stage: 'Final',
      team1: 'TBD (Winner Q1)',
      team2: 'TBD (Winner Q2)',
      date: '2026-03-23',
      time: '19:30 IST',
      venue: 'DY Patil Stadium, Mumbai',
      status: 'upcoming'
    }
  ],
  leagueMatches: [
    { team1: 'Royal Challengers Bangalore', team2: 'Delhi Capitals', date: '2026-02-15', result: 'RCB won by 23 runs' },
    { team1: 'Mumbai Indians', team2: 'Gujarat Giants', date: '2026-02-16', result: 'MI won by 7 wickets' },
    { team1: 'UP Warriorz', team2: 'Royal Challengers Bangalore', date: '2026-02-18', result: 'RCB won by 45 runs' },
    { team1: 'Delhi Capitals', team2: 'Mumbai Indians', date: '2026-02-20', result: 'DC won by 5 wickets' },
    { team1: 'Gujarat Giants', team2: 'UP Warriorz', date: '2026-02-22', result: 'GG won by 12 runs' },
    // ... more matches
  ],
  lastUpdated: new Date().toISOString()
};

export interface CricketDataResponse {
  teams: any[];
  liveMatch?: {
    isLive: boolean;
    team1: string;
    team2: string;
    score: string;
    summary: string;
    target?: number;
    isNight: boolean;
    humidity: number;
  };
  matches?: any[];
  source: 'api' | 'fallback';
}

class RobustCricketService {
  private baseUrl = `https://${RAPIDAPI_HOST}`;
  private apiAttempts = 0;
  private maxApiAttempts = 3;
  private lastApiSuccess: Date | null = null;
  private apiCooldown = 60000; // 1 minute cooldown after failures

  /**
   * Try API first, automatically fallback to hardcoded schedule if API fails
   */
  async fetchLiveWPLData(): Promise<CricketDataResponse> {
    // Check if we should try API or go straight to fallback
    if (this.shouldUseAPI()) {
      try {
        console.log('🔄 Attempting to fetch from API...');
        const apiData = await this.tryFetchFromAPI();
        
        if (apiData) {
          this.apiAttempts = 0; // Reset attempts on success
          this.lastApiSuccess = new Date();
          console.log('✅ API fetch successful');
          return {
            ...apiData,
            source: 'api'
          };
        }
      } catch (error) {
        console.warn('⚠️ API fetch failed:', error);
        this.apiAttempts++;
      }
    }

    // Fallback to hardcoded WPL 2026 schedule
    console.log('📊 Using hardcoded WPL 2026 schedule (fallback)');
    return this.getFallbackData();
  }

  /**
   * Determine if we should attempt API call
   */
  private shouldUseAPI(): boolean {
    // If no API key, always use fallback
    if (!RAPIDAPI_KEY) {
      console.log('ℹ️ No API key configured, using fallback data');
      return false;
    }

    // If we've failed too many times recently, use fallback
    if (this.apiAttempts >= this.maxApiAttempts) {
      const timeSinceLastAttempt = this.lastApiSuccess 
        ? Date.now() - this.lastApiSuccess.getTime()
        : this.apiCooldown + 1;

      if (timeSinceLastAttempt < this.apiCooldown) {
        console.log('ℹ️ API cooldown active, using fallback data');
        return false;
      }
      
      // Reset after cooldown
      this.apiAttempts = 0;
    }

    return true;
  }

  /**
   * Try to fetch from Cricbuzz API
   */
  private async tryFetchFromAPI(): Promise<any | null> {
    try {
      // Try to fetch standings
      const standingsResponse = await Promise.race([
        fetch(`${this.baseUrl}/stats/v1/standings/wpl`, {
          method: 'GET',
          headers: {
            'X-RapidAPI-Key': RAPIDAPI_KEY,
            'X-RapidAPI-Host': RAPIDAPI_HOST,
          },
          signal: AbortSignal.timeout(5000) // 5 second timeout
        }),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('API timeout')), 5000)
        )
      ]) as Response;

      if (!standingsResponse.ok) {
        throw new Error(`API returned ${standingsResponse.status}`);
      }

      const standingsData = await standingsResponse.json();

      // Try to fetch live matches
      let liveMatch = null;
      try {
        const liveResponse = await Promise.race([
          fetch(`${this.baseUrl}/matches/v1/live`, {
            method: 'GET',
            headers: {
              'X-RapidAPI-Key': RAPIDAPI_KEY,
              'X-RapidAPI-Host': RAPIDAPI_HOST,
            },
            signal: AbortSignal.timeout(5000)
          }),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Live API timeout')), 5000)
          )
        ]) as Response;

        if (liveResponse.ok) {
          const liveData = await liveResponse.json();
          liveMatch = this.parseLiveMatch(liveData);
        }
      } catch (liveError) {
        console.warn('Could not fetch live match data:', liveError);
      }

      return {
        teams: this.parseStandings(standingsData),
        liveMatch,
        matches: WPL_2026_SCHEDULE.matches // Use fallback matches even with API
      };

    } catch (error) {
      console.error('API fetch error:', error);
      return null;
    }
  }

  /**
   * Parse API standings response
   */
  private parseStandings(data: any): any[] {
    try {
      // Adapt this based on actual Cricbuzz API response structure
      if (data && data.standings && Array.isArray(data.standings)) {
        return data.standings.map((team: any) => ({
          name: team.teamName || team.name,
          points: team.points || 0,
          nrr: team.nrr || 0,
          played: team.played || 0,
          won: team.won || 0,
          lost: team.lost || 0
        }));
      }
      return [];
    } catch (error) {
      console.error('Error parsing standings:', error);
      return [];
    }
  }

  /**
   * Parse live match data
   */
  private parseLiveMatch(data: any): any | null {
    try {
      // Adapt this based on actual Cricbuzz API response structure
      if (data && data.matches && data.matches.length > 0) {
        const liveMatch = data.matches.find((m: any) => m.status === 'live');
        
        if (liveMatch) {
          return {
            isLive: true,
            team1: liveMatch.team1?.name || 'Team 1',
            team2: liveMatch.team2?.name || 'Team 2',
            score: liveMatch.score || '',
            summary: liveMatch.summary || '',
            target: liveMatch.target,
            isNight: this.isNightMatch(liveMatch.startTime),
            humidity: 65 // Default value
          };
        }
      }
      return null;
    } catch (error) {
      console.error('Error parsing live match:', error);
      return null;
    }
  }

  /**
   * Check if match is at night
   */
  private isNightMatch(time: string): boolean {
    if (!time) return true; // Default to night match
    const hour = parseInt(time.split(':')[0]);
    return hour >= 18 || hour <= 6;
  }

  /**
   * Return hardcoded WPL 2026 schedule as fallback
   */
  private getFallbackData(): CricketDataResponse {
    return {
      teams: WPL_2026_SCHEDULE.teams.map(t => ({
        name: this.mapToTeamEnum(t.name),
        points: t.points,
        nrr: t.nrr,
        played: t.played,
        won: t.won,
        lost: t.lost
      })),
      liveMatch: {
        isLive: false,
        team1: '',
        team2: '',
        score: '',
        summary: 'No live matches. Using WPL 2026 schedule.',
        isNight: false,
        humidity: 60
      },
      matches: WPL_2026_SCHEDULE.matches,
      source: 'fallback'
    };
  }

  /**
   * Map team names to TeamName enum
   */
  private mapToTeamEnum(name: string): string {
    const mapping: Record<string, TeamName> = {
      'Royal Challengers Bangalore': TeamName.RCB,
      'Royal Challengers': TeamName.RCB,
      'RCB': TeamName.RCB,
      'Delhi Capitals': TeamName.DC,
      'DC': TeamName.DC,
      'Mumbai Indians': TeamName.MI,
      'MI': TeamName.MI,
      'Gujarat Giants': TeamName.GG,
      'GG': TeamName.GG,
      'UP Warriorz': TeamName.UPW,
      'UPW': TeamName.UPW
    };

    // Try exact match first
    if (mapping[name]) return mapping[name];

    // Try partial match
    for (const [key, value] of Object.entries(mapping)) {
      if (name.toLowerCase().includes(key.toLowerCase()) || 
          key.toLowerCase().includes(name.toLowerCase())) {
        return value;
      }
    }

    return name; // Return original if no match
  }

  /**
   * Get upcoming matches (always returns WPL 2026 schedule)
   */
  async getUpcomingMatches(): Promise<any[]> {
    return WPL_2026_SCHEDULE.matches;
  }

  /**
   * Get league matches history
   */
  async getLeagueMatches(): Promise<any[]> {
    return WPL_2026_SCHEDULE.leagueMatches;
  }

  /**
   * Reset API attempts (call this from UI if needed)
   */
  resetAPIAttempts(): void {
    this.apiAttempts = 0;
    this.lastApiSuccess = null;
    console.log('🔄 API attempts reset');
  }

  /**
   * Get service status
   */
  getStatus(): { source: 'api' | 'fallback'; apiAttempts: number; lastSuccess: Date | null } {
    return {
      source: this.shouldUseAPI() ? 'api' : 'fallback',
      apiAttempts: this.apiAttempts,
      lastSuccess: this.lastApiSuccess
    };
  }
}

// Export singleton instance
export const cricketService = new RobustCricketService();
export default cricketService;

// Export named function for compatibility
export async function fetchLiveWPLData(): Promise<CricketDataResponse> {
  return cricketService.fetchLiveWPLData();
}

export function updateStandingsFromAPI(current: TeamStats[], apiTeams?: any[]): TeamStats[] {
  if (!apiTeams || apiTeams.length === 0) return current;

  return current.map(team => {
    const apiTeam = apiTeams.find((t: any) =>
      t.name?.toLowerCase?.().includes(team.name.toLowerCase()) ||
      team.name.toLowerCase().includes(String(t.name || '').toLowerCase())
    );

    if (!apiTeam) return team;

    return {
      ...team,
      points: apiTeam.points ?? team.points,
      nrr: apiTeam.nrr ?? team.nrr,
      played: apiTeam.played ?? team.played,
      won: apiTeam.won ?? team.won,
      lost: apiTeam.lost ?? team.lost
    };
  });
}

export function updateMatchFromLive(matches: Match[], liveMatch?: CricketDataResponse['liveMatch']): Match[] {
  if (!liveMatch?.isLive) return matches;

  return matches.map(match => {
    const isThisMatch =
      liveMatch.team1.toLowerCase().includes(match.team1.toLowerCase()) ||
      liveMatch.team2.toLowerCase().includes(match.team1.toLowerCase()) ||
      match.status === 'Live';

    if (!isThisMatch) return match;

    const liveMetrics: LiveMetrics = {
      target: liveMatch.target ?? 0,
      scoreString: liveMatch.score,
      isNightMatch: liveMatch.isNight,
      humidityLevel: liveMatch.humidity,
      runsNeeded: 0,
      ballsLeft: 0,
      wicketsLost: 0,
      currentRR: 0,
      requiredRR: 0,
      dewLikelihood: 0.7
    };

    return {
      ...match,
      status: 'Live',
      score1: liveMatch.score,
      summary: liveMatch.summary,
      liveMetrics
    };
  });
}
