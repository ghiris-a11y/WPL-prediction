
import React from 'react';
import { TeamStats } from '../types';
import { TEAM_LOGOS } from '../constants';

const StandingsTable: React.FC<{ teams: TeamStats[] }> = ({ teams }) => {
  const sortedTeams = [...teams].sort((a, b) => b.points - a.points || b.nrr - a.nrr);

  return (
    <div className="ai-card rounded-3xl overflow-hidden border border-white/60 shadow-xl">
      <div className="p-5 md:p-6 border-b border-slate-100 bg-white/30 flex justify-between items-center">
        <h3 className="text-sm font-black uppercase tracking-widest text-slate-800 flex items-center gap-3">
          <i className="fas fa-trophy text-indigo-600"></i> Season 4 Standings
        </h3>
        <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-emerald-50 rounded-full border border-emerald-100">
           <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
           <span className="text-[9px] font-black text-emerald-600 uppercase">Live</span>
        </div>
      </div>
      <div className="overflow-x-auto scrollbar-hide">
        <table className="w-full text-left min-w-[500px]">
          <thead className="bg-slate-50/50">
            <tr>
              <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase">Pos</th>
              <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase">Team</th>
              <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase text-center">P</th>
              <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase text-center">NRR</th>
              <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase text-center">Pts</th>
              <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase text-center">Form</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {sortedTeams.map((team, idx) => (
              <tr key={team.name} className="hover:bg-indigo-50/30 transition-all group">
                <td className="px-6 py-5 whitespace-nowrap">
                   <span className="text-sm font-black mono-tech text-slate-300 group-hover:text-indigo-400 transition-colors">#{idx + 1}</span>
                </td>
                <td className="px-6 py-5 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center border border-slate-100 shadow-sm">
                      <img src={TEAM_LOGOS[team.name]} alt={team.name} className="w-7 h-7 object-contain" />
                    </div>
                    <div>
                      <span className="text-xs font-black text-slate-700 block tracking-tight">{team.name}</span>
                      <span className="text-[8px] mono-tech text-slate-400">ELO: {team.elo}</span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5 whitespace-nowrap text-center text-xs font-bold text-slate-500">{team.played}</td>
                <td className="px-6 py-5 whitespace-nowrap text-center text-[10px] font-black mono-tech">
                   <span className={team.nrr >= 0 ? 'text-emerald-500' : 'text-rose-500'}>
                     {team.nrr > 0 ? '+' : ''}{team.nrr.toFixed(3)}
                   </span>
                </td>
                <td className="px-6 py-5 whitespace-nowrap text-center">
                   <span className="text-base font-black text-indigo-600 mono-tech">{team.points}</span>
                </td>
                <td className="px-6 py-5 whitespace-nowrap">
                  <div className="flex justify-center gap-1">
                    {team.recentForm.slice(-3).map((res, i) => (
                      <div 
                        key={i} 
                        className={`w-4 h-4 rounded flex items-center justify-center text-[7px] font-bold ${
                          res === 'W' ? 'bg-emerald-50 text-emerald-500' : 'bg-rose-50 text-rose-500'
                        }`}
                      >
                        {res}
                      </div>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StandingsTable;
