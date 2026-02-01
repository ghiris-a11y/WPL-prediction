
import React from 'react';
import { Match, TeamName } from '../types';
import { TEAM_LOGOS } from '../constants';

interface BracketProps {
  matches: Match[];
  onSelectWinner: (id: string, winner: TeamName) => void;
}

const MatchNode: React.FC<{ match: Match }> = ({ match }) => {
  return (
    <div className={`relative w-[260px] md:w-[280px] p-5 md:p-6 rounded-3xl ai-card border transition-all duration-300 ${
      match.status === 'Live' ? 'border-indigo-400 ring-4 ring-indigo-500/5 shadow-indigo-100' : 'border-white/60'
    }`}>
      <div className="flex justify-between items-center mb-4 md:mb-6">
        <span className="text-[8px] md:text-[9px] font-black text-slate-400 uppercase tracking-widest">{match.stage}</span>
        {match.status === 'Live' ? (
          <div className="flex items-center gap-1.5 bg-rose-50 px-2 py-1 rounded-full border border-rose-100 shadow-sm shadow-rose-100/50">
            <span className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-ping"></span>
            <span className="text-[8px] font-black text-rose-600 uppercase">Live</span>
          </div>
        ) : match.status === 'Upcoming' ? (
          <div className="flex items-center gap-1 bg-slate-100 px-2 py-1 rounded-full border border-slate-200">
            <i className="fas fa-clock text-[7px] text-slate-400"></i>
            <span className="text-[8px] font-black text-slate-500 uppercase">Pending</span>
          </div>
        ) : (
          <div className="flex items-center gap-1 bg-emerald-50 px-2 py-1 rounded-full border border-emerald-100">
            <i className="fas fa-check-circle text-[7px] text-emerald-500"></i>
            <span className="text-[8px] font-black text-emerald-600 uppercase">Final</span>
          </div>
        )}
      </div>
      
      <div className="space-y-3 md:space-y-4">
        {[match.team1, match.team2].map((team, idx) => {
          const isWinner = match.winner === team;
          const isT1 = idx === 0;
          const scoreValue = isT1 ? match.score1 : match.score2;
          
          return (
            <div key={team} className={`flex items-center justify-between transition-all ${
              match.winner && !isWinner ? 'opacity-30 grayscale' : 'opacity-100'
            }`}>
              <div className="flex items-center gap-2 md:gap-3 overflow-hidden">
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-white flex items-center justify-center border border-slate-100 shadow-sm flex-shrink-0">
                  <img src={TEAM_LOGOS[team]} alt={team} className="w-6 h-6 md:w-7 md:h-7 object-contain" />
                </div>
                <span className={`text-[11px] md:text-sm font-bold truncate ${isWinner ? 'text-indigo-600' : 'text-slate-700'}`}>{team}</span>
              </div>
              <span className={`text-[9px] md:text-xs mono-tech font-bold ml-2 ${
                scoreValue === 'YET TO BAT' ? 'text-slate-300 italic' : 'text-slate-500'
              }`}>
                {scoreValue || '--'}
              </span>
            </div>
          );
        })}
      </div>

      {match.prediction && match.status !== 'Completed' && (
        <div className="mt-4 md:mt-6 pt-4 md:pt-5 border-t border-slate-100">
          <div className="flex justify-between text-[8px] md:text-[9px] mb-2 px-1">
            <span className="text-slate-400 font-bold uppercase tracking-tighter">Oracle Prob.</span>
            <span className="text-indigo-500 font-bold">{(match.prediction.team1WinProb * 100).toFixed(0)}% Edge</span>
          </div>
          <div className="w-full bg-slate-100 h-1 md:h-1.5 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-1000" 
              style={{ width: `${match.prediction.team1WinProb * 100}%` }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
};

const PhaseHeader: React.FC<{ label: string, match?: Match }> = ({ label, match }) => {
  const isLive = match?.status === 'Live';
  const isCompleted = match?.status === 'Completed';

  return (
    <div className="text-center mb-2">
      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border transition-all ${
        isLive ? 'bg-rose-50 border-rose-100 text-rose-600 animate-pulse' : 
        isCompleted ? 'bg-emerald-50 border-emerald-100 text-emerald-600' :
        'bg-indigo-50/30 border-indigo-100/50 text-indigo-400'
      }`}>
        <p className="text-[9px] font-black uppercase tracking-widest leading-none">
          {label} {isLive ? '• LIVE' : isCompleted ? '• FINAL' : ''}
        </p>
      </div>
    </div>
  );
};

const Bracket: React.FC<BracketProps> = ({ matches }) => {
  const m1 = matches.find(m => m.id === 'm1');
  const m2 = matches.find(m => m.id === 'm2');
  const m3 = matches.find(m => m.id === 'm3');

  return (
    <div className="overflow-x-auto pb-6 -mx-4 px-4 scrollbar-hide snap-x">
      <div className="flex items-center gap-6 md:gap-12 min-w-max p-2 py-8">
        {/* Phase 1 */}
        <div className="flex flex-col gap-4 md:gap-6 snap-center">
          <PhaseHeader label="Phase 1" match={m1} />
          {m1 && <MatchNode match={m1} />}
        </div>

        {/* Separator */}
        <div className="w-8 md:w-12 h-0.5 bg-slate-200/50 relative flex-shrink-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-slate-300"></div>
        </div>

        {/* Phase 2 */}
        <div className="flex flex-col gap-4 md:gap-6 snap-center">
          <PhaseHeader label="Phase 2" match={m2} />
          {m2 && <MatchNode match={m2} />}
        </div>

        {/* Separator */}
        <div className="w-8 md:w-12 h-0.5 bg-slate-200/50 relative flex-shrink-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-slate-300"></div>
        </div>

        {/* Phase 3 */}
        <div className="flex flex-col gap-4 md:gap-6 snap-center">
          <PhaseHeader label="Phase 3" match={m3} />
          {m3 && (
            <div className="relative">
              <MatchNode match={m3} />
              <div className="absolute -top-10 left-1/2 -translate-x-1/2">
                 <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center border-4 border-amber-200 shadow-xl icon-pulse">
                    <i className="fas fa-trophy text-xl text-amber-500"></i>
                 </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Bracket;
