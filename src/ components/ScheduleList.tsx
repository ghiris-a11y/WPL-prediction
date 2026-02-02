import React from 'react';
import { Match } from '../types';

interface ScheduleListProps {
  matches: Match[];
}

const ScheduleList: React.FC<ScheduleListProps> = ({ matches }) => {
  const upcomingMatches = matches.filter(m => m.status === 'Upcoming');
  const liveMatches = matches.filter(m => m.status === 'Live');
  const completedMatches = matches.filter(m => m.status === 'Completed');

  const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
    const colors = {
      Upcoming: 'bg-blue-100 text-blue-700 border-blue-200',
      Live: 'bg-red-100 text-red-700 border-red-200',
      Completed: 'bg-gray-100 text-gray-700 border-gray-200'
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-bold border ${colors[status as keyof typeof colors]}`}>
        {status === 'Live' && <span className="inline-block w-2 h-2 bg-red-500 rounded-full animate-pulse mr-1"></span>}
        {status.toUpperCase()}
      </span>
    );
  };

  const MatchCard: React.FC<{ match: Match }> = ({ match }) => (
    <div className={`bg-white border rounded-xl p-4 hover:shadow-lg transition ${
      match.status === 'Live' ? 'border-red-300 ring-2 ring-red-100' : 'border-slate-200'
    }`}>
      <div className="flex items-start justify-between mb-3">
        <div className="text-sm text-slate-500">
          <div className="flex items-center space-x-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="font-medium">{match.stage}</span>
          </div>
        </div>
        <StatusBadge status={match.status} />
      </div>

      {/* Teams */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 flex-1">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center font-bold text-blue-600 text-sm shadow-sm">
              {match.team1.substring(0, 2).toUpperCase()}
            </div>
            <span className={`font-semibold ${match.winner === match.team1 ? 'text-green-600' : 'text-slate-800'}`}>
              {match.team1}
            </span>
          </div>
          <div className="text-right ml-2">
            <span className="text-lg font-bold text-slate-900">
              {match.score1 || '-'}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-center">
          <span className="text-slate-400 font-bold text-sm">VS</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 flex-1">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl flex items-center justify-center font-bold text-purple-600 text-sm shadow-sm">
              {match.team2.substring(0, 2).toUpperCase()}
            </div>
            <span className={`font-semibold ${match.winner === match.team2 ? 'text-green-600' : 'text-slate-800'}`}>
              {match.team2}
            </span>
          </div>
          <div className="text-right ml-2">
            <span className="text-lg font-bold text-slate-900">
              {match.score2 || '-'}
            </span>
          </div>
        </div>
      </div>

      {/* Summary */}
      {match.summary && (
        <div className="mt-3 pt-3 border-t border-slate-100">
          <div className="text-sm text-slate-600">{match.summary}</div>
        </div>
      )}

      {/* Winner */}
      {match.winner && match.status === 'Completed' && (
        <div className="mt-3 pt-3 border-t border-slate-100">
          <div className="text-sm font-semibold text-green-600 flex items-center gap-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            {match.winner} won
          </div>
        </div>
      )}

      {/* Prediction for upcoming matches */}
      {match.prediction && match.status === 'Upcoming' && (
        <div className="mt-3 pt-3 border-t border-slate-100">
          <div className="flex justify-between text-xs mb-2">
            <span className="text-slate-500 font-medium">Win Probability</span>
            <span className="text-purple-600 font-bold">
              {(match.prediction.team1WinProb * 100).toFixed(0)}% - {(match.prediction.team2WinProb * 100).toFixed(0)}%
            </span>
          </div>
          <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500"
              style={{ width: `${match.prediction.team1WinProb * 100}%` }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Live Matches */}
      {liveMatches.length > 0 && (
        <div>
          <h3 className="text-lg font-bold text-red-600 mb-4 flex items-center gap-2">
            <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
            Live Matches
          </h3>
          <div className="grid gap-4 md:grid-cols-2">
            {liveMatches.map((match) => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        </div>
      )}

      {/* Upcoming Matches */}
      {upcomingMatches.length > 0 && (
        <div>
          <h3 className="text-lg font-bold text-blue-600 mb-4">Upcoming Matches</h3>
          <div className="grid gap-4 md:grid-cols-2">
            {upcomingMatches.map((match) => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        </div>
      )}

      {/* Completed Matches */}
      {completedMatches.length > 0 && (
        <div>
          <h3 className="text-lg font-bold text-slate-600 mb-4">Recent Results</h3>
          <div className="grid gap-4 md:grid-cols-2">
            {completedMatches.map((match) => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        </div>
      )}

      {matches.length === 0 && (
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          <p className="text-slate-600">No matches scheduled</p>
        </div>
      )}
    </div>
  );
};

export default ScheduleList;
