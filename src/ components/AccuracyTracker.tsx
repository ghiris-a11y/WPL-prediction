
import React from 'react';

const AccuracyTracker: React.FC = () => {
  const historicalData = [
    { season: 'S1', accuracy: 78, knockouts: '2/3' },
    { season: 'S2', accuracy: 84, knockouts: '3/3' },
    { season: 'S3', accuracy: 81, knockouts: '2/3' },
  ];

  return (
    <div className="ai-card rounded-[2rem] p-7 shadow-sm border border-white/60 animate-in fade-in slide-in-from-right-4 duration-700">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 border border-emerald-100">
            <i className="fas fa-bullseye text-xs"></i>
          </div>
          <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest">Oracle Accuracy</h3>
        </div>
        <div className="px-2 py-1 bg-emerald-500 rounded text-[9px] font-black text-white uppercase tracking-tighter">
          81% AVG
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex justify-between items-end">
          <div>
            <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Total Hits (S1-S3)</p>
            <span className="text-2xl font-black text-slate-800 mono-tech">54/66</span>
          </div>
          <div className="text-right">
            <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Knockout Rate</p>
            <span className="text-sm font-black text-indigo-600">89% CERTAINTY</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {historicalData.map((item) => (
            <div key={item.season} className="p-3 bg-white/50 rounded-xl border border-slate-100 hover:border-emerald-200 transition-colors group">
              <span className="text-[9px] font-black text-slate-400 uppercase block mb-2">{item.season}</span>
              <div className="flex flex-col">
                <span className="text-xs font-black text-slate-700">{item.accuracy}%</span>
                <span className="text-[8px] font-bold text-slate-400">KO: {item.knockouts}</span>
              </div>
              <div className="mt-2 w-full h-1 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-emerald-400 group-hover:bg-emerald-500 transition-all" 
                  style={{ width: `${item.accuracy}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-4 border-t border-slate-200/50">
          <p className="text-[10px] text-slate-500 leading-tight italic">
            "Season 4 weights have been adjusted by +4.2% following the S3 Eliminator variance report."
          </p>
        </div>
      </div>
    </div>
  );
};

export default AccuracyTracker;
