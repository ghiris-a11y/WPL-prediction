import React from 'react';
import { Match, TeamName } from '@/types';
import { TEAM_LOGOS, TEAM_COLORS } from '@/constants';
import { cn } from '@/lib/utils';
import { Calendar, MapPin, Clock, Trophy, Star, ArrowRight } from 'lucide-react';
interface ScheduleListProps {
  matches: Match[];
}
const ScheduleList: React.FC<ScheduleListProps> = ({ matches }) => {
  const sortedMatches = [...matches].sort((a, b) => {
    // Live matches first
    if (a.status === 'Live' && b.status !== 'Live') return -1;
    if (b.status === 'Live' && a.status !== 'Live') return 1;
    
    // Then by date
    if (a.date && b.date) {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    }
    
    // Then by stage importance
    const stageOrder = { 'League': 0, 'Eliminator': 1, 'Qualifier': 2, 'Final': 3 };
    return stageOrder[a.stage] - stageOrder[b.stage];
  });
  const getStatusStyles = (status: Match['status']) => {
    switch (status) {
      case 'Live':
        return 'bg-red-500 text-white animate-pulse';
      case 'Completed':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };
  const getStageBadge = (stage: Match['stage']) => {
    const styles: Record<string, string> = {
      'League': 'bg-blue-100 text-blue-700',
      'Eliminator': 'bg-amber-100 text-amber-700',
      'Qualifier': 'bg-purple-100 text-purple-700',
      'Final': 'bg-gradient-to-r from-amber-400 to-orange-500 text-white'
    };
    return styles[stage] || 'bg-muted text-muted-foreground';
  };
  return (
    <div className="glass-card rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="wpl-gradient p-6">
        <div className="flex items-center gap-3">
          <Calendar className="w-6 h-6 text-white" />
          <div>
            <h2 className="text-xl font-bold text-white">Match Schedule</h2>
            <p className="text-white/80 text-sm mt-0.5">WPL Season 4 - 2026</p>
          </div>
        </div>
      </div>
      {/* Match List */}
      <div className="divide-y divide-border">
        {sortedMatches.map((match) => {
          const prediction = match.prediction;
          const team1Prob = prediction ? Math.round(prediction.team1WinProb * 100) : 50;
          
          return (
            <div 
              key={match.id}
              className={cn(
                "p-4 sm:p-5 transition-colors hover:bg-muted/30",
                match.status === 'Live' && "bg-red-50/50"
              )}
            >
              <div className="flex items-start gap-4">
                {/* Date Column */}
                <div className="hidden sm:flex flex-col items-center justify-center w-16 text-center">
                  {match.date ? (
                    <>
                      <span className="text-2xl font-bold text-foreground stat-number">
                        {new Date(match.date).getDate()}
                      </span>
                      <span className="text-xs text-muted-foreground uppercase">
                        {new Date(match.date).toLocaleDateString('en-US', { month: 'short' })}
                      </span>
                    </>
                  ) : (
                    <span className="text-sm text-muted-foreground">TBD</span>
                  )}
                </div>
                {/* Main Content */}
                <div className="flex-1 min-w-0">
                  {/* Status Badges */}
                  <div className="flex items-center gap-2 mb-3">
                    <span className={cn(
                      "px-2.5 py-1 rounded-full text-xs font-bold",
                      getStageBadge(match.stage)
                    )}>
                      {match.stage}
                    </span>
                    <span className={cn(
                      "px-2.5 py-1 rounded-full text-xs font-semibold",
                      getStatusStyles(match.status)
                    )}>
                      {match.status === 'Live' && '🔴 '}{match.status}
                    </span>
                    {match.matchNumber && (
                      <span className="text-xs text-muted-foreground">
                        Match #{match.matchNumber}
                      </span>
                    )}
                  </div>
                  {/* Teams Row */}
                  <div className="flex items-center gap-3">
                    {/* Team 1 */}
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <img 
                        src={TEAM_LOGOS[match.team1]} 
                        alt={match.team1}
                        className="w-10 h-10 rounded-full object-cover border-2 shadow-sm flex-shrink-0"
                        style={{ borderColor: TEAM_COLORS[match.team1].primary }}
                      />
                      <div className="min-w-0">
                        <p className={cn(
                          "font-bold truncate",
                          match.winner === match.team1 && "text-green-600"
                        )}>
                          {match.team1.split(' ').slice(-2).join(' ')}
                        </p>
                        {match.score1 && (
                          <p className="text-xs text-muted-foreground font-mono">{match.score1}</p>
                        )}
                      </div>
                      {match.winner === match.team1 && (
                        <Trophy className="w-4 h-4 text-green-500 flex-shrink-0" />
                      )}
                    </div>
                    {/* VS / Prediction */}
                    <div className="flex flex-col items-center px-4">
                      {prediction && match.status !== 'Completed' ? (
                        <div className="text-center">
                          <span className="text-lg font-bold wpl-gradient-text stat-number">
                            {team1Prob}%
                          </span>
                          <p className="text-[10px] text-muted-foreground">vs {100 - team1Prob}%</p>
                        </div>
                      ) : (
                        <span className="text-sm font-bold text-muted-foreground">VS</span>
                      )}
                    </div>
                    {/* Team 2 */}
                    <div className="flex items-center gap-2 flex-1 min-w-0 justify-end text-right">
                      {match.winner === match.team2 && (
                        <Trophy className="w-4 h-4 text-green-500 flex-shrink-0" />
                      )}
                      <div className="min-w-0">
                        <p className={cn(
                          "font-bold truncate",
                          match.winner === match.team2 && "text-green-600"
                        )}>
                          {match.team2.split(' ').slice(-2).join(' ')}
                        </p>
                        {match.score2 && (
                          <p className="text-xs text-muted-foreground font-mono">{match.score2}</p>
                        )}
                      </div>
                      <img 
                        src={TEAM_LOGOS[match.team2]} 
                        alt={match.team2}
                        className="w-10 h-10 rounded-full object-cover border-2 shadow-sm flex-shrink-0"
                        style={{ borderColor: TEAM_COLORS[match.team2].primary }}
                      />
                    </div>
                  </div>
                  {/* POTM and Summary */}
                  {match.playerOfTheMatch && (
                    <div className="mt-3 flex items-center gap-2 text-sm">
                      <Star className="w-4 h-4 text-amber-500" />
                      <span className="text-muted-foreground">POTM:</span>
                      <span className="font-semibold text-foreground">{match.playerOfTheMatch}</span>
                    </div>
                  )}
                  {prediction?.predictedPOTM && match.status !== 'Completed' && (
                    <div className="mt-3 flex items-center gap-2 text-sm">
                      <Star className="w-4 h-4 text-amber-400" />
                      <span className="text-muted-foreground">Predicted POTM:</span>
                      <span className="font-semibold text-amber-600">
                        {prediction.predictedPOTM.player.name}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        ({(prediction.predictedPOTM.probability * 100).toFixed(0)}%)
                      </span>
                    </div>
                  )}
                  {match.summary && (
                    <p className="mt-2 text-sm text-muted-foreground">{match.summary}</p>
                  )}
                  {/* Meta Info */}
                  <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                    {match.venue && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {match.venue}
                      </span>
                    )}
                    {match.time && (
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {match.time}
                      </span>
                    )}
                    {match.historicalH2H && (
                      <span className="flex items-center gap-1">
                        <ArrowRight className="w-3 h-3" />
                        H2H: {match.historicalH2H}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default ScheduleList;
