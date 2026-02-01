
import React from 'react';
import { Match } from '../types';
import { TEAM_LOGOS } from '../constants';

const ScheduleList: React.FC<{ matches: Match[] }> = ({ matches }) => {
  return (
    <div className="ai-card rounded-3xl p-5 md:p-8 border-l-4 border-l-indigo-500 shadow-xl">
      <div className="mb-6 md:mb-8 flex flex-col sm:flex-row justify-between items-start gap-4">
        <div>
          <h2 className="text-xl font-black mb-1 text-slate-800">Match Schedule</h2>
          <p className="text-slate-500 text-xs font-medium uppercase tracking-widest">Real-time status</p>
        </div>
        <div className="px-3 py-1 bg-indigo-50 rounded-xl border border-indigo-100 hidden sm:block">
          <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">WPL 2026</span>
        </div>
      </div>

      <div className="space-y-3">
        {matches.map((match) => (
          <div 
            key={match.id} 
            className={`flex flex-col md:flex-row items-center justify-between p-4 md:p-6 bg-white/40 rounded-2xl border gap-4 transition-all ${
              match.status === 'Live' ? 'border-rose-200 bg-rose-50/20' : 'border-white/60 hover:border-indigo-200'
            }`}
          >
            <div className="flex items-center gap-4 md:gap-8 w-full md:w-auto">
              <div className="flex flex-col items-center w-16 md:w-20 flex-shrink-0">
                <span className="text-[8px] font-black text-indigo-500 uppercase mb-1">{match.stage}</span>
                <div className={`px-2 py-0.5 rounded-md text-[7px] md:text-[8px] font-black uppercase ${
                  match.status === 'Live' ? 'bg-rose-500 text-white animate-pulse shadow-sm shadow-rose-200' : 
                  match.status === 'Completed' ? 'bg-slate-200 text-slate-500' : 'bg-indigo-50 text-indigo-400 border border-indigo-100'
                }`}>
                  {match.status}
                </div>
              </div>

              <div className="flex items-center gap-2 md:gap-4 flex-1 justify-center">
                <div className="flex flex-col items-center flex-1">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-white flex items-center justify-center border border-slate-100 shadow-sm">
                    <img src={TEAM_LOGOS[match.team1]} alt={match.team1} className="w-7 h-7 md:w-8 md:h-8 object-contain" />
                  </div>
                  <span className="text-[10px] md:text-xs font-bold text-slate-700 mt-1 truncate max-w-[80px] text-center">{match.team1}</span>
                </div>
                
                <span className="text-[10px] font-black text-slate-300 italic">VS</span>
                
                <div className="flex flex-col items-center flex-1">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-white flex items-center justify-center border border-slate-100 shadow-sm">
                    <img src={TEAM_LOGOS[match.team2]} alt={match.team2} className="w-7 h-7 md:w-8 md:h-8 object-contain" />
                  </div>
                  <span className="text-[10px] md:text-xs font-bold text-slate-700 mt-1 truncate max-w-[80px] text-center">{match.team2}</span>
                </div>
              </div>
            </div>

            <div className="flex md:flex-col items-center md:items-end justify-between w-full md:w-32 border-t md:border-t-0 pt-3 md:pt-0">
              {match.prediction && match.status !== 'Completed' ? (
                <>
                  <span className="text-[8px] md:text-[9px] font-black text-slate-400 uppercase md:mb-1">Oracle Edge</span>
                  <span className="text-xs md:text-sm font-black text-indigo-600 mono-tech">{Math.round(match.prediction.team1WinProb * 100)}% Edge</span>
                </>
              ) : match.status === 'Completed' && match.winner ? (
                <>
                  <span className="text-[8px] md:text-[9px] font-black text-emerald-500 uppercase md:mb-1">Result</span>
                  <span className="text-[9px] md:text-[10px] font-black text-slate-700 uppercase">{match.winner} WON</span>
                </>
              ) : (
                <span className="text-[9px] font-black text-slate-400 uppercase">Awaiting Data</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScheduleList;
