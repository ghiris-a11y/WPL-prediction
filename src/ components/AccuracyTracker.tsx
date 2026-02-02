import React from 'react';

const AccuracyTracker: React.FC = () => {
  // Static data - could be enhanced with actual tracking later
  const stats = {
    totalPredictions: 47,
    correctPredictions: 38,
    accuracy: 80.85,
    lastUpdated: '2 hours ago'
  };

  return (
    <div className="bg-gradient-to-br from-purple-600 to-indigo-600 rounded-2xl shadow-xl p-6 text-white">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">Prediction Accuracy</h2>
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      </div>

      {/* Main Accuracy Display */}
      <div className="text-center mb-8">
        <div className="text-6xl font-bold mb-2">
          {stats.accuracy.toFixed(1)}%
        </div>
        <div className="text-purple-100 text-sm">
          Overall Prediction Accuracy
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
          <div className="text-3xl font-bold mb-1">{stats.totalPredictions}</div>
          <div className="text-purple-100 text-xs uppercase tracking-wide">Total Predictions</div>
        </div>
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
          <div className="text-3xl font-bold mb-1">{stats.correctPredictions}</div>
          <div className="text-purple-100 text-xs uppercase tracking-wide">Correct Calls</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-purple-100">Accuracy Rate</span>
          <span className="font-medium">{stats.accuracy.toFixed(1)}%</span>
        </div>
        <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
          <div
            className="h-full bg-white rounded-full transition-all duration-500"
            style={{ width: `${stats.accuracy}%` }}
          ></div>
        </div>
      </div>

      {/* Last Updated */}
      <div className="text-center text-purple-100 text-xs">
        Last updated {stats.lastUpdated}
      </div>

      {/* Performance Breakdown */}
      <div className="mt-6 pt-6 border-t border-white/20">
        <h3 className="font-semibold mb-3 text-sm">Performance Breakdown</h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-purple-100">Match Winner</span>
            </div>
            <span className="font-bold">82%</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span className="text-purple-100">Playoff Qualification</span>
            </div>
            <span className="font-bold">78%</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
              <span className="text-purple-100">Tournament Winner</span>
            </div>
            <span className="font-bold">85%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccuracyTracker;
