
import React from 'react';
import { Match } from '../types';

const LiveMatchTracker: React.FC<{ currentMatch: Match }> = ({ currentMatch }) => {
  const metrics = currentMatch.liveMetrics;
  const prediction = currentMatch.prediction;
  const xi = prediction?.xiStrengthIndex;
  const isNight = metrics?.isNightMatch || true;

  // Extract wickets from score string if possible (e.g. "142/3")
  const wicketsFromScore = metrics?.scoreString?.match(/\/(\d+)/)?.[1];
  const displayWickets = wicketsFromScore || metrics?.wicketsLost || '--';

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="ai-card rounded-3xl p-5 md:p-8 border-l-4 border-l-indigo-500 relative overflow-hidden shadow-xl">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6 md:mb-10">
          <div className="w-full sm:w-auto">
            <h2 className="text-lg md:text-xl font-black flex items-center gap-2 uppercase tracking-tighter text-slate-800">
              <i className="fas fa-satellite-dish text-indigo-600 animate-pulse"></i> Match Telemetry
            </h2>
            <div className="mt-1 flex items-center gap-2 flex-wrap">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{currentMatch.stage}</span>
              <span className="w-1 h-1 rounded-full bg-slate-200"></span>
              <span className="text-[10px] md:text-sm font-bold text-slate-600 italic">
                {currentMatch.team1} v {currentMatch.team2}
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <div className="flex-1 sm:flex-none text-center sm:text-right p-3 md:p-4 bg-white/60 rounded-2xl border border-white shadow-sm min-w-[120px]">
              <span className="text-[8px] md:text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Win Probability</span>
              <span className="text-2xl md:text-3xl font-black text-indigo-600 mono-tech">
                {prediction ? (prediction.team1WinProb * 100).toFixed(1) : '50.0'}%
              </span>
            </div>
          </div>
        </div>

        {/* Primary Live Scoreboard */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-6 mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <i className="fas fa-baseball-bat-ball text-6xl text-white"></i>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 relative z-10">
            <div className="text-center md:text-left">
              <span className="text-indigo-400 text-[10px] font-black uppercase tracking-[0.3em] mb-2 block">Current Score</span>
              <div className="flex items-baseline gap-3">
                <h3 className="text-4xl md:text-5xl font-black text-white tracking-tighter mono-tech">
                  {metrics?.scoreString || currentMatch.score1 || '0/0 (0.0 ov)'}
                </h3>
                {currentMatch.status === 'Live' && (
                  <div className="flex items-center gap-1.5 bg-rose-500/20 px-2 py-1 rounded-lg border border-rose-500/30">
                    <span className="w-2 h-2 bg-rose-500 rounded-full animate-pulse"></span>
                    <span className="text-[10px] font-bold text-rose-400 uppercase">Live</span>
                  </div>
                )}
              </div>
            </div>
            {metrics?.target ? (
              <div className="text-center md:text-right">
                <span className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1 block">Chasing Target</span>
                <span className="text-2xl font-black text-white mono-tech">{metrics.target}</span>
              </div>
            ) : null}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mb-6 md:mb-8">
          <div className="bg-indigo-50/50 rounded-xl md:rounded-2xl p-4 md:p-6 border border-indigo-100 flex flex-col justify-between shadow-sm">
             <span className="text-[8px] md:text-[10px] font-black text-indigo-400 uppercase mb-2">Inference Edge</span>
             <span className="text-xl md:text-3xl font-black text-slate-800">
               {prediction ? (prediction.team1WinProb > 0.5 ? 'T1' : 'T2') : '--'}
             </span>
          </div>
          <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 border border-slate-100 flex flex-col justify-between shadow-sm">
             <span className="text-[8px] md:text-[10px] font-black text-slate-400 uppercase mb-2">Balls Left</span>
             <span className="text-xl md:text-3xl font-black text-indigo-600">{metrics?.ballsLeft || '--'}</span>
          </div>
          <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 border border-slate-100 flex flex-col justify-between shadow-sm">
             <span className="text-[8px] md:text-[10px] font-black text-slate-400 uppercase mb-2">Req. RR</span>
             <span className="text-xl md:text-3xl font-black text-emerald-600">{metrics?.requiredRR?.toFixed(2) || '--'}</span>
          </div>
          <div className="bg-rose-50/50 rounded-xl md:rounded-2xl p-4 md:p-6 border border-rose-100 flex flex-col justify-between shadow-sm">
             <span className="text-[8px] md:text-[10px] font-black text-rose-400 uppercase mb-2">Wickets</span>
             <span className="text-xl md:text-3xl font-black text-rose-600">{displayWickets}/10</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          <div className="bg-slate-50/50 rounded-2xl p-4 md:p-6 border border-slate-200">
             <div className="flex items-center gap-3 mb-3 md:mb-4">
               <i className={`fas ${isNight ? 'fa-moon text-indigo-600' : 'fa-sun text-amber-500'} text-xs`}></i>
               <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Environment</span>
             </div>
             <p className="text-[10px] md:text-xs text-slate-500 font-medium leading-relaxed">
               {isNight ? 'Night calibration active' : 'Daylight telemetry used'}. Humidity: <span className="text-indigo-600 font-bold">{metrics?.humidityLevel || 65}%</span>. 
               Dew impact calculated at <span className="text-rose-500 font-bold">-{prediction?.dewImpact || 15}%</span> for bowlers.
             </p>
          </div>

          <div className="bg-white/40 rounded-2xl p-4 md:p-6 border border-indigo-50">
            <span className="text-[9px] font-black text-slate-400 uppercase block mb-3 md:mb-4">Live Strength Index</span>
            <div className="space-y-3 md:space-y-4">
               <div>
                  <div className="flex justify-between text-[9px] font-bold mb-1">
                     <span className="text-slate-600 truncate max-w-[100px]">{currentMatch.team1}</span>
                     <span className="text-indigo-600">{((xi?.t1 || 0.75) * 100).toFixed(0)}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                     <div className="h-full bg-indigo-500 transition-all duration-700" style={{ width: `${(xi?.t1 || 0.75) * 100}%` }}></div>
                  </div>
               </div>
               <div>
                  <div className="flex justify-between text-[9px] font-bold mb-1">
                     <span className="text-slate-600 truncate max-w-[100px]">{currentMatch.team2}</span>
                     <span className="text-indigo-600">{((xi?.t2 || 0.75) * 100).toFixed(0)}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                     <div className="h-full bg-slate-300 transition-all duration-700" style={{ width: `${(xi?.t2 || 0.75) * 100}%` }}></div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveMatchTracker;
