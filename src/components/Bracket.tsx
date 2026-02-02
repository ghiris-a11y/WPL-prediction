import React from 'react';
import { Match, TeamName } from '@/types';
import { TEAM_LOGOS, TEAM_COLORS } from '@/constants';
import { cn } from '@/lib/utils';
import { Trophy, TrendingUp, Zap, Star } from 'lucide-react';
interface BracketProps {
  matches: Match[];
  onSelectWinner?: (matchId: string, winner: TeamName) => void;
}
const Bracket: React.FC<BracketProps> = ({ matches, onSelectWinner }) => {
  const leagueMatches = matches.filter(m => m.stage === 'League');
  const eliminatorMatches = matches.filter(m => m.stage === 'Eliminator' || m.stage === 'Qualifier');
  const finalMatch = matches.find(m => m.stage === 'Final');
  const getStatusBadge = (status: Match['status']) => {
    switch (status) {
      case 'Live':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-red-500 text-white animate-pulse">
            <span className="w-2 h-2 rounded-full bg-white live-pulse"></span>
            LIVE
          </span>
        );
      case 'Completed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
            <Trophy className="w-3 h-3" />
            COMPLETED
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-muted text-muted-foreground">
            PENDING
          </span>
        );
    }
  };
  const MatchCard: React.FC<{ match: Match; highlight?: boolean }> = ({ match, highlight }) => {
    const prediction = match.prediction;
    const team1Prob = prediction ? Math.round(prediction.team1WinProb * 100) : 50;
    const team2Prob = 100 - team1Prob;
    return (
      <div
        className={cn(
          "match-card glass-card rounded-2xl p-5 transition-all duration-300",
          highlight && "gradient-border",
          match.status === 'Live' && "ring-2 ring-red-500 ring-offset-2"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            {match.stage} {match.matchNumber && `• Match ${match.matchNumber}`}
          </span>
          {getStatusBadge(match.status)}
        </div>
        {/* Teams */}
        <div className="space-y-3">
          {/* Team 1 */}
          <div 
            className={cn(
              "flex items-center gap-3 p-3 rounded-xl transition-all cursor-pointer hover:bg-muted/50",
              match.winner === match.team1 && "bg-green-50 border border-green-200"
            )}
            onClick={() => match.status !== 'Completed' && onSelectWinner?.(match.id, match.team1)}
          >
            <img 
              src={TEAM_LOGOS[match.team1]} 
              alt={match.team1}
              className="w-12 h-12 rounded-full object-cover border-2 shadow-md"
              style={{ borderColor: TEAM_COLORS[match.team1].primary }}
            />
            <div className="flex-1 min-w-0">
              <p className="font-bold text-foreground truncate">{match.team1}</p>
              {match.score1 && (
                <p className="text-sm text-muted-foreground font-mono">{match.score1}</p>
              )}
            </div>
            {match.winner === match.team1 && (
              <Trophy className="w-5 h-5 text-green-500" />
            )}
            {prediction && match.status !== 'Completed' && (
              <span className={cn(
                "text-sm font-bold px-2 py-1 rounded-md",
                team1Prob > 50 ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
              )}>
                {team1Prob}%
              </span>
            )}
          </div>
          {/* VS Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-border"></div>
            <span className="text-xs font-bold text-muted-foreground">VS</span>
            <div className="flex-1 h-px bg-border"></div>
          </div>
          {/* Team 2 */}
          <div 
            className={cn(
              "flex items-center gap-3 p-3 rounded-xl transition-all cursor-pointer hover:bg-muted/50",
              match.winner === match.team2 && "bg-green-50 border border-green-200"
            )}
            onClick={() => match.status !== 'Completed' && onSelectWinner?.(match.id, match.team2)}
          >
            <img 
              src={TEAM_LOGOS[match.team2]} 
              alt={match.team2}
              className="w-12 h-12 rounded-full object-cover border-2 shadow-md"
              style={{ borderColor: TEAM_COLORS[match.team2].primary }}
            />
            <div className="flex-1 min-w-0">
              <p className="font-bold text-foreground truncate">{match.team2}</p>
              {match.score2 && (
                <p className="text-sm text-muted-foreground font-mono">{match.score2}</p>
              )}
            </div>
            {match.winner === match.team2 && (
              <Trophy className="w-5 h-5 text-green-500" />
            )}
            {prediction && match.status !== 'Completed' && (
              <span className={cn(
                "text-sm font-bold px-2 py-1 rounded-md",
                team2Prob > 50 ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
              )}>
                {team2Prob}%
              </span>
            )}
          </div>
        </div>
        {/* Prediction Bar */}
        {prediction && match.status !== 'Completed' && (
          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between text-xs font-medium">
              <span className="text-muted-foreground">Oracle Prediction</span>
              <span className={cn(
                "font-bold",
                prediction.confidence === 'High' ? "text-green-600" :
                prediction.confidence === 'Medium' ? "text-amber-600" : "text-muted-foreground"
              )}>
                {prediction.confidence} Confidence
              </span>
            </div>
            <div className="relative h-3 rounded-full overflow-hidden bg-muted">
              <div 
                className="absolute left-0 top-0 h-full rounded-full wpl-gradient transition-all duration-500"
                style={{ width: `${team1Prob}%` }}
              ></div>
            </div>
          </div>
        )}
        {/* Player of the Match Prediction */}
        {prediction?.predictedPOTM && match.status !== 'Completed' && (
          <div className="mt-4 p-3 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200">
            <div className="flex items-center gap-2 mb-1">
              <Star className="w-4 h-4 text-amber-500" />
              <span className="text-xs font-semibold text-amber-700">Predicted POTM</span>
            </div>
            <p className="text-sm font-bold text-amber-900">
              {prediction.predictedPOTM.player.name}
            </p>
            <p className="text-xs text-amber-600 mt-0.5">
              {prediction.predictedPOTM.reasoning}
            </p>
          </div>
        )}
        {/* Match Details */}
        {(match.venue || match.date) && (
          <div className="mt-4 pt-4 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
            {match.venue && <span>📍 {match.venue}</span>}
            {match.time && <span>🕐 {match.time}</span>}
          </div>
        )}
      </div>
    );
  };
  return (
    <div className="space-y-6">
      {/* Phase Headers */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* League Phase */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-primary" />
            <h3 className="font-bold text-lg">League Stage</h3>
            {leagueMatches.some(m => m.status === 'Live') && (
              <span className="text-xs font-bold text-red-500 animate-pulse">• LIVE</span>
            )}
          </div>
          {leagueMatches.slice(0, 3).map(match => (
            <MatchCard key={match.id} match={match} />
          ))}
        </div>
        {/* Playoffs */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-secondary" />
            <h3 className="font-bold text-lg">Playoffs</h3>
          </div>
          {eliminatorMatches.map(match => (
            <MatchCard key={match.id} match={match} />
          ))}
        </div>
        {/* Final */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-accent" />
            <h3 className="font-bold text-lg">Grand Final</h3>
          </div>
          {finalMatch && <MatchCard match={finalMatch} highlight />}
        </div>
      </div>
    </div>
  );
};
export default Bracket;
