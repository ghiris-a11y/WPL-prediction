
import React from 'react';
import { TournamentState, TeamName } from '../types';
import { TEAM_LOGOS } from '../constants';

const PredictionPanel: React.FC<{ state: TournamentState }> = ({ state }) => {
  const topMatch = state.matches[0];
  const prediction = topMatch?.prediction;
  const ensemble = prediction?.ensembleMetrics;

  const confidenceColor: Record<string, string> = {
    'High': 'text-emerald-500',
    'Medium': 'text-indigo-500',
    'Lean': 'text-amber-500',
    'Toss-up': 'text-rose-500'
  };

  return (
    <div className="ai-card rounded-[3rem] overflow-hidden border border-white p-1 shadow-xl">
      <div className="bg-white/40 rounded-[2.8rem] p-8">
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-200">
              <i className="fas fa-microchip text-sm"></i>
            </div>
            <div>
              <h2 className="text-xs font-black uppercase tracking-widest text-slate-800">Ensemble v2.7</h2>
              <span className="text-[9px] mono-tech text-indigo-500 font-bold uppercase">Multivariate Calibration</span>
            </div>
          </div>
          <div className="text-right">
             <span className={`text-2xl font-black mono-tech ${confidenceColor[prediction?.confidence || 'Medium']}`}>
               {prediction?.confidence || 'Calculating...'}
             </span>
             <p className="text-[8px] font-black text-slate-400 uppercase">Certainty Level</p>
          </div>
        </div>

        <div className="flex flex-col items-center text-center mb-10">
          <div className="relative mb-6">
             <div className="absolute inset-0 bg-indigo-500/10 blur-3xl rounded-full scale-150"></div>
             <div className="relative z-10 p-6 rounded-[2.5rem] bg-white border border-slate-100 shadow-sm">
               <img 
                 src={TEAM_LOGOS[state.predictedChampion || TeamName.RCB]} 
                 alt="Champion" 
                 className="w-28 h-28 object-contain drop-shadow-md" 
               />
             </div>
             <div className="absolute -bottom-2 -right-2 bg-amber-400 w-11 h-11 rounded-2xl flex items-center justify-center border-4 border-white shadow-lg rotate-12">
               <i className="fas fa-crown text-white text-lg"></i>
             </div>
          </div>
          <h3 className="text-3xl font-black text-slate-800 tracking-tighter uppercase mb-2">{state.predictedChampion}</h3>
          <div className="px-5 py-2 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-100">
            <p className="text-[10px] font-black tracking-widest uppercase">Phase 2 Ensemble Oracle</p>
          </div>
        </div>

        <div className="space-y-4 pt-4 border-t border-slate-200">
          <div className="grid grid-cols-2 gap-3">
             <div className="p-4 rounded-2xl bg-white border border-slate-100 flex flex-col justify-between">
               <p className="text-[8px] text-slate-400 uppercase font-black mb-1">Momentum Score</p>
               <div className="flex items-end gap-1">
                 <span className="text-sm font-bold text-slate-700">{(ensemble?.momentum_score || 0.85).toFixed(2)}</span>
                 <i className="fas fa-arrow-trend-up text-[8px] text-emerald-500 mb-1"></i>
               </div>
             </div>
             <div className="p-4 rounded-2xl bg-white border border-slate-100 flex flex-col justify-between">
               <p className="text-[8px] text-slate-400 uppercase font-black mb-1">Vol Index</p>
               <span className="text-sm font-bold text-slate-700">{(state.volatilityIndex).toFixed(0)}% σ</span>
             </div>
          </div>

          <div className="space-y-3 px-1">
            {prediction?.factors?.slice(0, 3).map((driver, i) => (
              <div key={i} className="flex gap-3 items-center group">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 group-hover:scale-125 transition-transform"></div>
                <p className="text-[11px] text-slate-500 leading-tight font-medium group-hover:text-slate-800 transition-colors">{driver}</p>
              </div>
            )) || [
              "LogReg (60%): Live State calibrated",
              "Elo (25%): Historical strength parity",
              "H2H (15%): Cricsheet bias integration"
            ].map((driver, i) => (
              <div key={i} className="flex gap-3 items-center group">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 group-hover:scale-125 transition-transform"></div>
                <p className="text-[11px] text-slate-500 leading-tight font-medium group-hover:text-slate-800 transition-colors">{driver}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="p-5 flex items-center justify-center gap-4 bg-slate-50 border-t border-white/40">
         <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Enhanced Confidence</span>
         <div className="flex gap-1">
           {[1,2,3].map(i => (
             <span key={i} className="w-1.5 h-1.5 rounded-full bg-indigo-300 animate-pulse" style={{ animationDelay: `${i * 0.2}s` }}></span>
           ))}
         </div>
      </div>
    </div>
  );
};

export default PredictionPanel;
