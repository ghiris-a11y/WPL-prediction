import React from 'react';
import { TeamStats } from '@/types';
import { TEAM_LOGOS, TEAM_COLORS } from '@/constants';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown, Minus, Trophy } from 'lucide-react';
interface StandingsTableProps {
  teams: TeamStats[];
}
const StandingsTable: React.FC<StandingsTableProps> = ({ teams }) => {
  const sortedTeams = [...teams].sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    return b.nrr - a.nrr;
  });
  const getFormIcon = (result: 'W' | 'L') => {
    if (result === 'W') {
      return (
        <span className="w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center text-xs font-bold">
          W
        </span>
      );
    }
    return (
      <span className="w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center text-xs font-bold">
        L
      </span>
    );
  };
  const getPositionBadge = (position: number) => {
    if (position <= 2) {
      return (
        <div className={cn(
          "w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm",
          position === 1 ? "bg-gradient-to-br from-amber-400 to-amber-600 text-white" :
          "bg-gradient-to-br from-slate-300 to-slate-500 text-white"
        )}>
          {position}
        </div>
      );
    }
    if (position <= 4) {
      return (
        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm">
          {position}
        </div>
      );
    }
    return (
      <div className="w-8 h-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center font-bold text-sm">
        {position}
      </div>
    );
  };
  return (
    <div className="glass-card rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="wpl-gradient p-6">
        <div className="flex items-center gap-3">
          <Trophy className="w-6 h-6 text-white" />
          <h2 className="text-xl font-bold text-white">WPL 2026 Standings</h2>
        </div>
        <p className="text-white/80 text-sm mt-1">Live points table with playoff qualification</p>
      </div>
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="text-left py-4 px-4 font-semibold text-muted-foreground text-sm">#</th>
              <th className="text-left py-4 px-4 font-semibold text-muted-foreground text-sm">Team</th>
              <th className="text-center py-4 px-2 font-semibold text-muted-foreground text-sm">P</th>
              <th className="text-center py-4 px-2 font-semibold text-muted-foreground text-sm">W</th>
              <th className="text-center py-4 px-2 font-semibold text-muted-foreground text-sm">L</th>
              <th className="text-center py-4 px-2 font-semibold text-muted-foreground text-sm">NRR</th>
              <th className="text-center py-4 px-4 font-semibold text-muted-foreground text-sm">Pts</th>
              <th className="text-left py-4 px-4 font-semibold text-muted-foreground text-sm hidden sm:table-cell">Form</th>
            </tr>
          </thead>
          <tbody>
            {sortedTeams.map((team, index) => (
              <tr 
                key={team.name}
                className={cn(
                  "border-b border-border/50 transition-colors hover:bg-muted/30",
                  index < 2 && "bg-green-50/50",
                  index >= 2 && index < 4 && "bg-blue-50/30"
                )}
              >
                <td className="py-4 px-4">
                  {getPositionBadge(index + 1)}
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center gap-3">
                    <img 
                      src={TEAM_LOGOS[team.name]} 
                      alt={team.name}
                      className="w-10 h-10 rounded-full object-cover border-2 shadow-sm"
                      style={{ borderColor: TEAM_COLORS[team.name].primary }}
                    />
                    <div>
                      <p className="font-bold text-foreground">{team.name}</p>
                      <p className="text-xs text-muted-foreground">
                        ELO: {team.elo}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="text-center py-4 px-2 font-semibold text-foreground stat-number">
                  {team.played}
                </td>
                <td className="text-center py-4 px-2 font-semibold text-green-600 stat-number">
                  {team.won}
                </td>
                <td className="text-center py-4 px-2 font-semibold text-red-500 stat-number">
                  {team.lost}
                </td>
                <td className="text-center py-4 px-2">
                  <div className="flex items-center justify-center gap-1">
                    {team.nrr > 0 ? (
                      <TrendingUp className="w-4 h-4 text-green-500" />
                    ) : team.nrr < 0 ? (
                      <TrendingDown className="w-4 h-4 text-red-500" />
                    ) : (
                      <Minus className="w-4 h-4 text-muted-foreground" />
                    )}
                    <span className={cn(
                      "font-mono text-sm font-semibold",
                      team.nrr > 0 ? "text-green-600" : team.nrr < 0 ? "text-red-500" : "text-muted-foreground"
                    )}>
                      {team.nrr > 0 ? '+' : ''}{team.nrr.toFixed(3)}
                    </span>
                  </div>
                </td>
                <td className="text-center py-4 px-4">
                  <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10 text-primary font-bold text-lg stat-number">
                    {team.points}
                  </span>
                </td>
                <td className="py-4 px-4 hidden sm:table-cell">
                  <div className="flex items-center gap-1">
                    {team.recentForm.slice(-5).map((result, i) => (
                      <React.Fragment key={i}>
                        {getFormIcon(result)}
                      </React.Fragment>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Legend */}
      <div className="p-4 bg-muted/30 flex flex-wrap gap-4 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          <span className="text-muted-foreground">Qualified for Qualifier</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-500"></div>
          <span className="text-muted-foreground">Playoff Race</span>
        </div>
      </div>
    </div>
  );
};
export default StandingsTable;
