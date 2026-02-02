import React, { useState, useEffect, useCallback, useRef } from 'react';
import { TeamName, TeamStats, Match, TournamentState } from './types';
import { INITIAL_TEAMS, INITIAL_MATCHES } from './constants';
import { fetchLiveWPLData } from './services/cricketService';
import { simulateTournament, calculateVolatility } from './predictionEngine';
import Bracket from './ components/Bracket';
import StandingsTable from './ components/StandingsTable';
import LiveMatchTracker from './ components/LiveMatchTracker';
import PredictionPanel from './ components/PredictionPanel';
import ScheduleList from './ components/ScheduleList';
import AccuracyTracker from './ components/AccuracyTracker';

const CACHE_KEY = 'wpl_oracle_data_v3';
const SYNC_INTERVAL = 30000; // 30 seconds for faster updates
const COOLDOWN_PERIOD = 5000;

        <Routes>
          <Route path="/" element={<Index />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>

const App: React.FC = () => {
  const [state, setState] = useState<TournamentState>(() => {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        // Validate cache age (max 2 minutes)
        const cacheAge = Date.now() - new Date(parsed.timestamp || 0).getTime();
        if (cacheAge < 120000) {
          return parsed;
        }
      } catch (e) {
        console.error("Cache invalid");
      }
    }
    return {
      standings: INITIAL_TEAMS,
      matches: INITIAL_MATCHES,
      lastUpdated: new Date().toLocaleTimeString(),
      predictedChampion: TeamName.RCB,
      confidenceScore: 82,
      volatilityIndex: calculateVolatility(INITIAL_TEAMS),
      searchSources: [],
      timestamp: new Date().toISOString()
    };
  });

  const [isSyncing, setIsSyncing] = useState(false);
  const [apiStatus, setApiStatus] = useState<'healthy' | 'throttled' | 'error'>('healthy');
  const [nextAllowedSync, setNextAllowedSync] = useState(0);
  const [activeTab, setActiveTab] = useState<'bracket' | 'standings' | 'simulator' | 'schedule'>('bracket');
  const [isMobile, setIsMobile] = useState(false);
  const syncTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Detect mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const syncData = useCallback(async (isManual = false) => {
    const now = Date.now();
    if (isSyncing || now < nextAllowedSync) return;

    setIsSyncing(true);
    setApiStatus('healthy');

    try {
      const result = await fetchLiveWPLData();
      
      setState(prev => {
        let updatedStandings = [...prev.standings];
        let updatedMatches = [...prev.matches];

        if (result && result.teams) {
          updatedStandings = prev.standings.map(team => {
            const apiTeam = result.teams.find((t: any) => 
              t.name.toLowerCase().includes(team.name.toLowerCase()) || 
              team.name.toLowerCase().includes(t.name.toLowerCase())
            );
            return apiTeam ? { 
              ...team, 
              points: apiTeam.points, 
              nrr: apiTeam.nrr,
              played: apiTeam.played || team.played,
              won: apiTeam.won || team.won,
              lost: apiTeam.lost || team.lost
            } : team;
          });
        }

        if (result.liveMatch?.isLive) {
          const liveData = result.liveMatch;
          updatedMatches = prev.matches.map(match => {
            const isThisMatch = 
              liveData.team1.toLowerCase().includes(match.team1.toLowerCase()) ||
              liveData.team2.toLowerCase().includes(match.team1.toLowerCase());

            if (isThisMatch || match.status === 'Live') {
              return {
                ...match,
                status: 'Live' as const,
                score1: liveData.score,
                summary: liveData.summary,
                liveMetrics: {
                  target: liveData.target,
                  scoreString: liveData.score,
                  isNightMatch: liveData.isNight,
                  humidityLevel: liveData.humidity,
                  runsNeeded: 0, // Calculate from score
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

        const finalMatches = simulateTournament(updatedStandings, updatedMatches);
        const finalMatch = finalMatches.find(m => m.id === 'm3');
        const predictedChamp = finalMatch?.prediction 
          ? (finalMatch.prediction.team1WinProb > 0.5 ? finalMatch.team1 : finalMatch.team2) 
          : TeamName.RCB;

        const newState = {
          standings: updatedStandings,
          matches: finalMatches,
          lastUpdated: new Date().toLocaleTimeString(),
          volatilityIndex: calculateVolatility(updatedStandings),
          predictedChampion: predictedChamp,
          confidenceScore: Math.round((finalMatch?.prediction?.team1WinProb || 0.82) * 100),
          searchSources: [],
          timestamp: new Date().toISOString()
        };

        localStorage.setItem(CACHE_KEY, JSON.stringify(newState));
        return newState;
      });

      setNextAllowedSync(Date.now() + (isManual ? COOLDOWN_PERIOD : 5000));

    } catch (err: any) {
      console.error('Sync error:', err);
      setApiStatus('error');
      setNextAllowedSync(Date.now() + 30000);
    } finally {
      setIsSyncing(false);
    }
  }, [isSyncing, nextAllowedSync]);

  useEffect(() => {
    syncData();
    syncTimerRef.current = setInterval(() => syncData(), SYNC_INTERVAL);
    return () => {
      if (syncTimerRef.current) clearInterval(syncTimerRef.current);
    };
  }, [syncData]);

  const handleManualWinner = (matchId: string, winner: TeamName) => {
    setState(prev => {
      const newMatches = prev.matches.map(m => 
        m.id === matchId ? { ...m, status: 'Completed' as const, winner } : m
      );
      const finalMatches = simulateTournament(prev.standings, newMatches);
      const newState = { ...prev, matches: finalMatches };
      localStorage.setItem(CACHE_KEY, JSON.stringify(newState));
      return newState;
    });
  };

  return (
    <div className="min-h-screen pb-10 bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Mobile-optimized header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md px-3 sm:px-6 py-3 sm:py-4 flex justify-between items-center border-b border-slate-200 shadow-lg">
        <div className="flex items-center gap-2 sm:gap-4">
          <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center shadow-lg ${
            apiStatus === 'error' ? 'bg-red-500' : 'bg-gradient-to-br from-purple-600 to-indigo-600'
          }`}>
            <span className="text-white text-lg sm:text-2xl">🏏</span>
          </div>
          <div>
            <h1 className="text-base sm:text-xl font-bold text-slate-900">
              WPL Oracle <span className="text-purple-600">S4</span>
            </h1>
            <p className="text-[10px] sm:text-xs text-slate-500">
              {apiStatus === 'healthy' ? '🟢 Live' : '🔴 Offline'} • {state.lastUpdated}
            </p>
          </div>
        </div>

        <button 
          onClick={() => syncData(true)}
          disabled={isSyncing || Date.now() < nextAllowedSync}
          className={`px-3 sm:px-5 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
            isSyncing || Date.now() < nextAllowedSync 
              ? 'bg-slate-300 text-slate-500 cursor-not-allowed' 
              : 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:shadow-lg active:scale-95'
          }`}
        >
          {isSyncing ? '⟳' : '↻'} {!isMobile && 'Sync'}
        </button>
      </header>

      <main className="max-w-7xl mx-auto px-3 sm:px-6 mt-4 sm:mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-8">
          {/* Main content - full width on mobile */}
          <div className="lg:col-span-8 space-y-4 sm:space-y-6">
            {/* Mobile-friendly tab navigation */}
            <div className="flex gap-2 p-1.5 bg-white rounded-xl shadow-md overflow-x-auto">
              {['bracket', 'schedule', 'standings', 'simulator'].map(tab => (
                <button 
                  key={tab}
                  onClick={() => setActiveTab(tab as any)}
                  className={`flex-1 min-w-[80px] px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                    activeTab === tab 
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md' 
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            {/* Content panels */}
            <div className="transition-all">
              {activeTab === 'bracket' && <Bracket matches={state.matches} onSelectWinner={handleManualWinner} />}
              {activeTab === 'schedule' && <ScheduleList matches={state.matches} />}
              {activeTab === 'standings' && <StandingsTable teams={state.standings} />}
              {activeTab === 'simulator' && (
                <div className="p-6 sm:p-8 bg-white rounded-2xl shadow-lg">
                  <h3 className="text-lg font-bold text-slate-800 mb-4">Simulation Lab</h3>
                  <p className="text-sm text-slate-600">Advanced prediction engine active</p>
                </div>
              )}
            </div>

            {/* Live match tracker */}
            <LiveMatchTracker 
              currentMatch={state.matches.find(m => m.status === 'Live') || state.matches[0]} 
            />
          </div>

          {/* Sidebar - stack below on mobile */}
          <div className="lg:col-span-4 space-y-4 sm:space-y-6">
            <PredictionPanel state={state} />
            <AccuracyTracker />
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
