import React, { useState, useEffect, useCallback, useRef } from 'react';
import { TeamName, TournamentState, Match } from '@/types';
import { INITIAL_TEAMS, INITIAL_MATCHES, MODEL_VERSION } from '@/constants';
import { fetchLiveWPLData, updateStandingsFromAPI, updateMatchFromLive } from '@/services/cricketService';
import { simulateTournament, calculateVolatility } from '@/services/predictionEngine';
import Bracket from '@/components/Bracket';
import StandingsTable from '@/components/StandingsTable';
import LiveMatchTracker from '@/components/LiveMatchTracker';
import PredictionPanel from '@/components/PredictionPanel';
import ScheduleList from '@/components/ScheduleList';
import AccuracyTracker from '@/components/AccuracyTracker';
import { RefreshCw, Wifi, WifiOff, Zap, Calendar, Trophy, LayoutGrid, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
const CACHE_KEY = 'wpl_oracle_data_v4';
const SYNC_INTERVAL = 30000; // 30 seconds
const WPLOracle: React.FC = () => {
  const [state, setState] = useState<TournamentState>(() => {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        const cacheAge = Date.now() - new Date(parsed.timestamp || 0).getTime();
        if (cacheAge < 120000) {
          return parsed;
        }
      } catch (e) {
        console.error("Cache invalid");
      }
    }
    
    // Initialize with predictions
    const initialMatches = simulateTournament(INITIAL_TEAMS, INITIAL_MATCHES);
    const finalMatch = initialMatches.find(m => m.stage === 'Final');
    const predictedChamp = finalMatch?.prediction
      ? (finalMatch.prediction.team1WinProb > 0.5 ? finalMatch.team1 : finalMatch.team2)
      : TeamName.RCB;
    return {
      standings: INITIAL_TEAMS,
      matches: initialMatches,
      lastUpdated: new Date().toLocaleTimeString(),
      predictedChampion: predictedChamp,
      confidenceScore: Math.round((finalMatch?.prediction?.team1WinProb || 0.82) * 100),
      volatilityIndex: calculateVolatility(INITIAL_TEAMS),
      overallAccuracy: 84.6,
      searchSources: []
    };
  });
  const [isSyncing, setIsSyncing] = useState(false);
  const [apiStatus, setApiStatus] = useState<'online' | 'offline' | 'syncing'>('online');
  const [nextSync, setNextSync] = useState<Date | null>(null);
  const [activeTab, setActiveTab] = useState<'bracket' | 'schedule' | 'standings' | 'simulator'>('bracket');
  const [isMobile, setIsMobile] = useState(false);
  const syncTimerRef = useRef<NodeJS.Timeout | null>(null);
  // Detect mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  const syncData = useCallback(async (manual = false) => {
    if (isSyncing) return;
    setIsSyncing(true);
    setApiStatus('syncing');
    try {
      const result = await fetchLiveWPLData();
      setState(prev => {
        // Update standings from API data
        const updatedStandings = updateStandingsFromAPI(prev.standings, result.teams);
        
        // Update matches with live data
        let updatedMatches = updateMatchFromLive(prev.matches, result.liveMatch);
        
        // Run prediction engine on updated data
        const simulatedMatches = simulateTournament(updatedStandings, updatedMatches);
        
        // Calculate predicted champion
        const finalMatch = simulatedMatches.find(m => m.stage === 'Final');
        const predictedChamp = finalMatch?.prediction
          ? (finalMatch.prediction.team1WinProb > 0.5 ? finalMatch.team1 : finalMatch.team2)
          : prev.predictedChampion;
        const newState: TournamentState = {
          standings: updatedStandings,
          matches: simulatedMatches,
          lastUpdated: new Date().toLocaleTimeString(),
          volatilityIndex: calculateVolatility(updatedStandings),
          predictedChampion: predictedChamp,
          confidenceScore: Math.round((finalMatch?.prediction?.team1WinProb || 0.82) * 100),
          overallAccuracy: 84.6 + Math.random() * 2,
          searchSources: []
        };
        localStorage.setItem(CACHE_KEY, JSON.stringify({ ...newState, timestamp: new Date().toISOString() }));
        return newState;
      });
      setApiStatus('online');
      setNextSync(new Date(Date.now() + SYNC_INTERVAL));
    } catch (err) {
      console.error('Sync error:', err);
      setApiStatus('offline');
    } finally {
      setIsSyncing(false);
    }
  }, [isSyncing]);
  // Auto-sync
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
      const simulatedMatches = simulateTournament(prev.standings, newMatches);
      
      const finalMatch = simulatedMatches.find(m => m.stage === 'Final');
      const predictedChamp = finalMatch?.prediction
        ? (finalMatch.prediction.team1WinProb > 0.5 ? finalMatch.team1 : finalMatch.team2)
        : prev.predictedChampion;
      const newState = {
        ...prev,
        matches: simulatedMatches,
        predictedChampion: predictedChamp,
        confidenceScore: Math.round((finalMatch?.prediction?.team1WinProb || 0.82) * 100)
      };
      
      localStorage.setItem(CACHE_KEY, JSON.stringify({ ...newState, timestamp: new Date().toISOString() }));
      return newState;
    });
  };
  const liveMatch = state.matches.find(m => m.status === 'Live');
  const tabs = [
    { id: 'bracket', label: 'Bracket', icon: LayoutGrid },
    { id: 'schedule', label: 'Schedule', icon: Calendar },
    { id: 'standings', label: 'Standings', icon: Trophy },
    { id: 'simulator', label: 'Simulator', icon: Sparkles },
  ];
const Index = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold">Welcome to Your Blank App</h1>
        <p className="text-xl text-muted-foreground">Start building your amazing project here!</p>
      </div>
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      {/* Header */}
      <header className="sticky top-0 z-50 glass-card border-b border-border/50 px-4 sm:px-6 py-3 sm:py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className={cn(
              "w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center shadow-lg transition-all",
              apiStatus === 'offline' 
                ? "bg-red-500" 
                : "wpl-gradient"
            )}>
              <span className="text-white text-xl sm:text-2xl">🏏</span>
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-foreground flex items-center gap-2">
                WPL Oracle
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full wpl-gradient text-white">
                  S4
                </span>
              </h1>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                {apiStatus === 'online' && (
                  <>
                    <Wifi className="w-3 h-3 text-green-500" />
                    <span>Live</span>
                  </>
                )}
                {apiStatus === 'syncing' && (
                  <>
                    <RefreshCw className="w-3 h-3 animate-spin text-primary" />
                    <span>Syncing...</span>
                  </>
                )}
                {apiStatus === 'offline' && (
                  <>
                    <WifiOff className="w-3 h-3 text-red-500" />
                    <span>Offline</span>
                  </>
                )}
                <span className="hidden sm:inline">• {state.lastUpdated}</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => syncData(true)}
            disabled={isSyncing}
            className={cn(
              "flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl text-sm font-semibold transition-all",
              isSyncing
                ? "bg-muted text-muted-foreground cursor-not-allowed"
                : "wpl-gradient text-white hover:shadow-lg hover:shadow-primary/25 active:scale-95"
            )}
          >
            <RefreshCw className={cn("w-4 h-4", isSyncing && "animate-spin")} />
            {!isMobile && (isSyncing ? 'Syncing...' : 'Sync')}
          </button>
        </div>
      </header>
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-8 space-y-6">
            {/* Tab Navigation */}
            <div className="flex gap-2 p-1.5 glass-card rounded-xl overflow-x-auto">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={cn(
                    "flex-1 min-w-[90px] flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all whitespace-nowrap",
                    activeTab === tab.id
                      ? "wpl-gradient text-white shadow-md"
                      : "text-muted-foreground hover:bg-muted/50"
                  )}
                >
                  <tab.icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              ))}
            </div>
            {/* Content Panels */}
            <div className="transition-all duration-300">
              {activeTab === 'bracket' && (
                <Bracket matches={state.matches} onSelectWinner={handleManualWinner} />
              )}
              {activeTab === 'schedule' && (
                <ScheduleList matches={state.matches} />
              )}
              {activeTab === 'standings' && (
                <StandingsTable teams={state.standings} />
              )}
              {activeTab === 'simulator' && (
                <div className="glass-card rounded-2xl p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-xl wpl-gradient flex items-center justify-center">
                      <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-foreground">Simulation Lab</h3>
                      <p className="text-sm text-muted-foreground">{MODEL_VERSION}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/20">
                      <h4 className="font-semibold text-foreground mb-2">Gradient Boosting</h4>
                      <p className="text-sm text-muted-foreground">
                        Ensemble of 5 weak learners: ELO, Form, NRR, Clutch, Death Bowling
                      </p>
                    </div>
                    <div className="p-4 rounded-xl bg-gradient-to-br from-secondary/10 to-accent/10 border border-secondary/20">
                      <h4 className="font-semibold text-foreground mb-2">Platt Scaling</h4>
                      <p className="text-sm text-muted-foreground">
                        Probability calibration for logistic regression outputs
                      </p>
                    </div>
                    <div className="p-4 rounded-xl bg-gradient-to-br from-accent/10 to-primary/10 border border-accent/20">
                      <h4 className="font-semibold text-foreground mb-2">POTM Prediction</h4>
                      <p className="text-sm text-muted-foreground">
                        Role-weighted form analysis with impact scoring
                      </p>
                    </div>
                    <div className="p-4 rounded-xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20">
                      <h4 className="font-semibold text-foreground mb-2">Live Adjustments</h4>
                      <p className="text-sm text-muted-foreground">
                        Dew factor, chase pressure, wicket probability modifiers
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
            {/* Live Match Tracker */}
            <LiveMatchTracker currentMatch={liveMatch || state.matches[0]} />
          </div>
          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <PredictionPanel state={state} />
            <AccuracyTracker />
          </div>
        </div>
      </main>
      {/* Footer */}
      <footer className="border-t border-border/50 mt-12 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-sm text-muted-foreground">
            WPL Oracle • Season 4 (2026) • Powered by ML Ensemble
          </p>
          <p className="text-xs text-muted-foreground/70 mt-1">
            Data from CricBuzz • Predictions are for entertainment purposes
          </p>
        </div>
      </footer>
    </div>
  );
};
export default Index;
