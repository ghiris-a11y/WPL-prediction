import React from 'react';
import { Match, TeamName } from '@/types';
import { TEAM_LOGOS, TEAM_COLORS } from '@/constants';
import { cn } from '@/lib/utils';
import { Radio, Target, Droplets, Thermometer, Clock, Star, TrendingUp } from 'lucide-react';
interface LiveMatchTrackerProps {
  currentMatch: Match | undefined;
}
const LiveMatchTracker: React.FC<LiveMatchTrackerProps> = ({ currentMatch }) => {
  if (!currentMatch) {
    return (
      <div className="glass-card rounded-2xl p-8 text-center">
        <Radio className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
        <h3 className="text-lg font-bold text-foreground">No Live Match</h3>
        <p className="text-muted-foreground text-sm mt-1">Check back during match hours</p>
      </div>
    );
  }
  const isLive = currentMatch.status === 'Live';
  const prediction = currentMatch.prediction;
  const metrics = currentMatch.liveMetrics;
  return (
    <div className={cn(
      "glass-card rounded-2xl overflow-hidden",
      isLive && "ring-2 ring-red-500 ring-offset-2"
    )}>
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Radio className={cn(
              "w-5 h-5",
              isLive ? "text-red-400 animate-pulse" : "text-slate-400"
            )} />
            <div>
              <h3 className="text-white font-bold">
                {isLive ? 'LIVE MATCH' : 'Match Details'}
              </h3>
              <p className="text-slate-400 text-xs">
                {currentMatch.stage} • {currentMatch.venue}
              </p>
            </div>
          </div>
          {isLive && (
            <span className="px-3 py-1.5 rounded-full bg-red-500/20 text-red-400 text-xs font-bold animate-pulse">
              🔴 LIVE
            </span>
          )}
        </div>
        {/* Teams Score Display */}
        <div className="mt-6 flex items-center justify-between">
          {/* Team 1 */}
          <div className="text-center flex-1">
            <img 
              src={TEAM_LOGOS[currentMatch.team1]} 
              alt={currentMatch.team1}
              className="w-16 h-16 rounded-full mx-auto border-3 shadow-lg mb-2"
              style={{ borderColor: TEAM_COLORS[currentMatch.team1].primary }}
            />
            <p className="text-white font-bold text-sm truncate max-w-[100px] mx-auto">
              {currentMatch.team1.split(' ').pop()}
            </p>
            {currentMatch.score1 && (
              <p className="text-2xl font-bold text-white mt-1 font-mono">
                {currentMatch.score1}
              </p>
            )}
          </div>
          {/* VS / Prediction */}
          <div className="px-6 text-center">
            <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mb-2">
              <span className="text-white/80 font-bold">VS</span>
            </div>
            {prediction && (
              <div className="text-xs">
                <span className="text-green-400 font-bold">
                  {Math.round(Math.max(prediction.team1WinProb, prediction.team2WinProb) * 100)}%
                </span>
                <p className="text-slate-500">Edge</p>
              </div>
            )}
          </div>
          {/* Team 2 */}
          <div className="text-center flex-1">
            <img 
              src={TEAM_LOGOS[currentMatch.team2]} 
              alt={currentMatch.team2}
              className="w-16 h-16 rounded-full mx-auto border-3 shadow-lg mb-2"
              style={{ borderColor: TEAM_COLORS[currentMatch.team2].primary }}
            />
            <p className="text-white font-bold text-sm truncate max-w-[100px] mx-auto">
              {currentMatch.team2.split(' ').pop()}
            </p>
            {currentMatch.score2 && (
              <p className="text-2xl font-bold text-white mt-1 font-mono">
                {currentMatch.score2}
              </p>
            )}
          </div>
        </div>
        {/* Summary */}
        {currentMatch.summary && (
          <div className="mt-4 p-3 rounded-lg bg-white/5 text-center">
            <p className="text-slate-300 text-sm">{currentMatch.summary}</p>
          </div>
        )}
      </div>
      {/* Live Metrics */}
      {metrics && (
        <div className="p-5 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="text-center p-3 rounded-xl bg-muted/50">
            <Target className="w-5 h-5 text-primary mx-auto mb-1" />
            <p className="text-lg font-bold text-foreground stat-number">{metrics.target}</p>
            <p className="text-[10px] text-muted-foreground">Target</p>
          </div>
          <div className="text-center p-3 rounded-xl bg-muted/50">
            <TrendingUp className="w-5 h-5 text-secondary mx-auto mb-1" />
            <p className="text-lg font-bold text-foreground stat-number">
              {metrics.requiredRR?.toFixed(2) || '0.00'}
            </p>
            <p className="text-[10px] text-muted-foreground">Req. RR</p>
          </div>
          <div className="text-center p-3 rounded-xl bg-muted/50">
            <Droplets className="w-5 h-5 text-blue-500 mx-auto mb-1" />
            <p className="text-lg font-bold text-foreground stat-number">
              {(metrics.dewLikelihood * 100).toFixed(0)}%
            </p>
            <p className="text-[10px] text-muted-foreground">Dew Factor</p>
          </div>
          <div className="text-center p-3 rounded-xl bg-muted/50">
            <Thermometer className="w-5 h-5 text-orange-500 mx-auto mb-1" />
            <p className="text-lg font-bold text-foreground stat-number">
              {metrics.humidityLevel || 65}%
            </p>
            <p className="text-[10px] text-muted-foreground">Humidity</p>
          </div>
        </div>
      )}
      {/* Predicted POTM */}
      {prediction?.predictedPOTM && (
        <div className="px-5 pb-5">
          <div className="p-4 rounded-xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-200/50">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                <Star className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-semibold text-amber-600 mb-0.5">Predicted Player of the Match</p>
                <p className="text-lg font-bold text-foreground">
                  {prediction.predictedPOTM.player.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {prediction.predictedPOTM.team} • {prediction.predictedPOTM.player.role}
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold wpl-gradient-text stat-number">
                  {(prediction.predictedPOTM.probability * 100).toFixed(0)}%
                </p>
                <p className="text-[10px] text-muted-foreground">Probability</p>
              </div>
            </div>
            {prediction.predictedPOTM.reasoning && (
              <p className="mt-3 text-xs text-muted-foreground italic">
                "{prediction.predictedPOTM.reasoning}"
              </p>
            )}
          </div>
        </div>
      )}
      {/* Match Info */}
      {currentMatch.date && (
        <div className="px-5 pb-5 flex items-center justify-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {currentMatch.date}
          </span>
          {currentMatch.time && (
            <span>{currentMatch.time}</span>
          )}
        </div>
      )}
    </div>
  );
};
export default LiveMatchTracker;
