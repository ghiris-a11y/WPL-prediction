import React from 'react';
import { TeamStats } from '../types';

interface StandingsTableProps {
  teams: TeamStats[];
}

const StandingsTable: React.FC<StandingsTableProps> = ({ teams }) => {
  // Sort teams by points (descending), then by NRR
  const sortedTeams = [...teams].sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    return b.nrr - a.nrr;
  });

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      <div className="px-6 py-4 bg-gradient-to-r from-purple-600 to-indigo-600">
        <h2 className="text-xl font-bold text-white">Points Table</h2>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Pos</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Team</th>
              <th className="px-4 py-3 text-center text-xs font-bold text-slate-600 uppercase tracking-wider">P</th>
              <th className="px-4 py-3 text-center text-xs font-bold text-slate-600 uppercase tracking-wider">W</th>
              <th className="px-4 py-3 text-center text-xs font-bold text-slate-600 uppercase tracking-wider">L</th>
              <th className="px-4 py-3 text-center text-xs font-bold text-slate-600 uppercase tracking-wider">NRR</th>
              <th className="px-4 py-3 text-center text-xs font-bold text-slate-600 uppercase tracking-wider">Pts</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-100">
            {sortedTeams.map((team, index) => {
              const isQualified = index < 4; // Top 4 teams qualify
              
              return (
                <tr 
                  key={team.name} 
                  className={`hover:bg-purple-50 transition ${
                    isQualified ? 'bg-green-50/50' : ''
                  }`}
                >
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        isQualified ? 'bg-green-500 text-white' : 'bg-slate-200 text-slate-700'
                      }`}>
                        {index + 1}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="text-sm font-semibold text-slate-900">{team.name}</div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-center text-sm text-slate-700">
                    {team.played}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-center text-sm font-semibold text-green-600">
                    {team.won}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-center text-sm font-semibold text-red-600">
                    {team.lost}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-center text-sm font-mono">
                    <span className={team.nrr >= 0 ? 'text-green-600' : 'text-red-600'}>
                      {team.nrr >= 0 ? '+' : ''}{team.nrr.toFixed(3)}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-center">
                    <span className="text-sm font-bold text-purple-600">{team.points}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
      <div className="bg-slate-50 px-4 py-3 text-xs text-slate-600 border-t border-slate-200">
        <div className="flex items-center gap-2">
          <span className="inline-block w-3 h-3 bg-green-50 border-2 border-green-500 rounded"></span>
          <span>Qualified for playoffs (Top 4)</span>
        </div>
      </div>
    </div>
  );
};

export default StandingsTable;
