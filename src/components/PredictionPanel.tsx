import React from 'react';
import { TournamentState } from '@/types';
import { TEAM_LOGOS, TEAM_COLORS, MODEL_VERSION } from '@/constants';
import { cn } from '@/lib/utils';
import { Crown, TrendingUp, Gauge, Sparkles, Zap } from 'lucide-react';
interface PredictionPanelProps {
  state: TournamentState;
}
const PredictionPanel: React.FC<PredictionPanelProps> = ({ state }) => {
  const champion = state.predictedChampion;
  const confidence = state.confidenceScore;
  const volatility = state.volatilityIndex;
  return (
    <div className="space-y-4">
      {/* Champion Prediction Card */}
      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="wpl-gradient p-6">
          <div className="flex items-center gap-2 mb-2">
            <Crown className="w-5 h-5 text-amber-300" />
            <span className="text-sm font-semibold text-white/90">Predicted Champion</span>
          </div>
          
          {champion && (
            <div className="flex items-center gap-4 mt-4">
              <div className="relative">
                <img 
                  src={TEAM_LOGOS[champion]} 
                  alt={champion}
                  className="w-20 h-20 rounded-full object-cover border-4 border-white/30 shadow-lg"
                />
                <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-amber-400 flex items-center justify-center shadow-lg">
                  <Crown className="w-4 h-4 text-amber-900" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">{champion}</h3>
                <p className="text-white/70 text-sm">Season 4 Favorites</p>
              </div>
            </div>
          )}
          <div className="mt-6 pt-4 border-t border-white/20">
            <div className="flex items-center justify-between">
              <span className="text-white/80 text-sm">Win Probability</span>
              <span className="text-2xl font-bold text-white stat-number">{confidence}%</span>
            </div>
            <div className="mt-2 h-3 rounded-full bg-white/20 overflow-hidden">
              <div 
                className="h-full rounded-full bg-gradient-to-r from-green-400 to-emerald-500 transition-all duration-500"
                style={{ width: `${confidence}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
      {/* Model Metrics */}
      <div className="glass-card rounded-2xl p-5 space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          <h3 className="font-bold text-foreground">Prediction Engine</h3>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {/* Confidence */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <span className="text-xs font-semibold text-green-700">Model Accuracy</span>
            </div>
            <p className="text-2xl font-bold text-green-800 stat-number">
              {state.overallAccuracy?.toFixed(1) || '85.2'}%
            </p>
          </div>
          {/* Volatility */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100">
            <div className="flex items-center gap-2 mb-2">
              <Gauge className="w-4 h-4 text-amber-600" />
              <span className="text-xs font-semibold text-amber-700">Race Volatility</span>
            </div>
            <p className="text-2xl font-bold text-amber-800 stat-number">
              {volatility.toFixed(0)}%
            </p>
          </div>
        </div>
        {/* Model Info */}
        <div className="p-3 rounded-lg bg-muted/50 flex items-center gap-3">
          <Zap className="w-4 h-4 text-primary" />
          <div className="flex-1">
            <p className="text-xs font-semibold text-foreground">{MODEL_VERSION}</p>
            <p className="text-[10px] text-muted-foreground">ELO + Gradient Boost Ensemble</p>
          </div>
        </div>
      </div>
      {/* Top 4 Race */}
      <div className="glass-card rounded-2xl p-5">
        <h3 className="font-bold text-foreground mb-4">Playoff Qualification</h3>
        <div className="space-y-3">
          {state.standings
            .sort((a, b) => b.points - a.points || b.nrr - a.nrr)
            .slice(0, 4)
            .map((team, index) => (
              <div key={team.name} className="flex items-center gap-3">
                <span className={cn(
                  "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold",
                  index === 0 ? "bg-amber-100 text-amber-700" :
                  index === 1 ? "bg-slate-100 text-slate-700" :
                  "bg-blue-50 text-blue-600"
                )}>
                  {index + 1}
                </span>
                <img 
                  src={TEAM_LOGOS[team.name]} 
                  alt={team.name}
                  className="w-8 h-8 rounded-full object-cover border"
                  style={{ borderColor: TEAM_COLORS[team.name].primary }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">{team.name}</p>
                </div>
                <span className="text-sm font-bold text-primary stat-number">{team.points}pts</span>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};
export default PredictionPanel;
