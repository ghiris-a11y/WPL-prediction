import React from 'react';
import { AccuracyMetrics } from '@/types';
import { MODEL_VERSION } from '@/constants';
import { TrendingUp, Award, Zap, Star, BarChart3 } from 'lucide-react';
interface AccuracyTrackerProps {
  metrics?: AccuracyMetrics;
}
const AccuracyTracker: React.FC<AccuracyTrackerProps> = ({ metrics }) => {
  // Default metrics for demonstration
  const defaultMetrics: AccuracyMetrics = {
    totalPredictions: 52,
    correctPredictions: 44,
    matchWinnerAccuracy: 84.6,
    playoffAccuracy: 88.5,
    potmAccuracy: 72.3,
    modelVersion: MODEL_VERSION
  };
  const data = metrics || defaultMetrics;
  const overallAccuracy = (data.correctPredictions / data.totalPredictions * 100) || 84.6;
  const AccuracyRing: React.FC<{ value: number; size?: number }> = ({ value, size = 120 }) => {
    const strokeWidth = 8;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (value / 100) * circumference;
    return (
      <div className="relative" style={{ width: size, height: size }}>
        <svg className="transform -rotate-90" width={size} height={size}>
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="hsl(var(--muted))"
            strokeWidth={strokeWidth}
          />
          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="url(#gradient)"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-1000 ease-out"
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="hsl(var(--primary))" />
              <stop offset="100%" stopColor="hsl(var(--secondary))" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold wpl-gradient-text stat-number">
            {value.toFixed(1)}%
          </span>
          <span className="text-[10px] text-muted-foreground uppercase tracking-wide">
            Accuracy
          </span>
        </div>
      </div>
    );
  };
  return (
    <div className="glass-card rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl wpl-gradient flex items-center justify-center">
            <Star className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-foreground">Prediction Accuracy</h3>
            <p className="text-xs text-muted-foreground">Season 4 Performance</p>
          </div>
        </div>
      </div>
      {/* Main Accuracy Display */}
      <div className="p-6 flex justify-center">
        <AccuracyRing value={overallAccuracy} size={140} />
      </div>
      {/* Stats Grid */}
      <div className="px-5 pb-5 grid grid-cols-2 gap-3">
        <div className="p-4 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-green-600" />
            <span className="text-xs font-semibold text-green-700">Match Winner</span>
          </div>
          <p className="text-xl font-bold text-green-800 stat-number">
            {data.matchWinnerAccuracy.toFixed(1)}%
          </p>
        </div>
        <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100">
          <div className="flex items-center gap-2 mb-2">
            <Award className="w-4 h-4 text-blue-600" />
            <span className="text-xs font-semibold text-blue-700">Playoff Picks</span>
          </div>
          <p className="text-xl font-bold text-blue-800 stat-number">
            {data.playoffAccuracy.toFixed(1)}%
          </p>
        </div>
        <div className="p-4 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100">
          <div className="flex items-center gap-2 mb-2">
            <Star className="w-4 h-4 text-amber-600" />
            <span className="text-xs font-semibold text-amber-700">POTM Prediction</span>
          </div>
          <p className="text-xl font-bold text-amber-800 stat-number">
            {data.potmAccuracy.toFixed(1)}%
          </p>
        </div>
        <div className="p-4 rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-100">
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 className="w-4 h-4 text-purple-600" />
            <span className="text-xs font-semibold text-purple-700">Total Calls</span>
          </div>
          <p className="text-xl font-bold text-purple-800 stat-number">
            {data.correctPredictions}/{data.totalPredictions}
          </p>
        </div>
      </div>
      {/* Model Info */}
      <div className="p-4 bg-muted/30 border-t border-border">
        <div className="flex items-center gap-3">
          <Zap className="w-4 h-4 text-primary" />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-foreground truncate">{data.modelVersion}</p>
            <p className="text-[10px] text-muted-foreground">Updated 5 minutes ago</p>
          </div>
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};
export default AccuracyTracker;
