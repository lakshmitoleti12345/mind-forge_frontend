import React from 'react';
import { BarChart3, TrendingUp, BrainCircuit, Activity, CheckCircle2, Award, Zap, ShieldCheck } from 'lucide-react';

export default function AnalyticsView({ analytics }) {
  const ratings = analytics?.ratings_summary || { blackout: 1, hard: 2, good: 8, easy: 14 };
  const total = (ratings.blackout + ratings.hard + ratings.good + ratings.easy) || 1;

  const pct = (val) => Math.round((val / total) * 100);

  const dailyActivity = analytics?.daily_activity || [
    { date: 'Mon', reviews: 4 },
    { date: 'Tue', reviews: 8 },
    { date: 'Wed', reviews: 12 },
    { date: 'Thu', reviews: 6 },
    { date: 'Fri', reviews: 15 },
    { date: 'Sat', reviews: 9 },
    { date: 'Sun', reviews: 18 },
  ];

  const maxReviews = Math.max(...dailyActivity.map(d => d.reviews), 1);

  return (
    <div className="space-y-8 py-6">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Memory Analytics & SM-2 Performance</h1>
        <p className="text-xs text-gray-400">Algorithmic metrics tracking recall stability and long-term retention</p>
      </div>

      {/* Primary KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        <div className="glass-panel p-6 rounded-2xl border border-gray-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-gray-400 font-semibold">
            <span>Recall Accuracy Rate</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-4xl font-extrabold text-white">
            {analytics?.accuracy_percentage ?? 95.8}%
          </div>
          <p className="text-xs text-emerald-400">High memory stability score</p>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-gray-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-gray-400 font-semibold">
            <span>Total Logged Reviews</span>
            <Activity className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-4xl font-extrabold text-white">
            {analytics?.total_reviews ?? 47}
          </div>
          <p className="text-xs text-indigo-400">SM-2 algorithm updates logged</p>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-gray-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-gray-400 font-semibold">
            <span>Cards in Mastery Phase</span>
            <Award className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-4xl font-extrabold text-white">
            {analytics?.mastered_cards ?? 4}
          </div>
          <p className="text-xs text-amber-400">Review interval &gt; 21 days</p>
        </div>

      </div>

      {/* Visual Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Weekly Activity Histogram */}
        <div className="glass-panel p-6 rounded-2xl border border-gray-800 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">Weekly Review Volume</h3>
              <p className="text-xs text-gray-400">Flashcard reviews processed per day</p>
            </div>
            <BarChart3 className="w-5 h-5 text-indigo-400" />
          </div>

          <div className="h-44 flex items-end justify-between gap-3 pt-4 border-b border-gray-800 pb-2">
            {dailyActivity.map((d, i) => {
              const heightPct = Math.round((d.reviews / maxReviews) * 100);
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                  <span className="text-[10px] font-mono text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    {d.reviews}
                  </span>
                  <div
                    className="w-full bg-gradient-to-t from-indigo-600 to-purple-500 rounded-t-lg transition-all duration-500 group-hover:from-indigo-500 group-hover:to-purple-400 shadow-lg shadow-indigo-600/20"
                    style={{ height: `${Math.max(heightPct, 10)}%` }}
                  />
                  <span className="text-xs font-semibold text-gray-400">{d.date}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Rating Breakdown */}
        <div className="glass-panel p-6 rounded-2xl border border-gray-800 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">Recall Rating Distribution</h3>
              <p className="text-xs text-gray-400">User difficulty feedback breakdown</p>
            </div>
            <TrendingUp className="w-5 h-5 text-emerald-400" />
          </div>

          <div className="space-y-4">
            
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-cyan-400">Easy (Rating 4)</span>
                <span className="text-gray-300">{ratings.easy} ({pct(ratings.easy)}%)</span>
              </div>
              <div className="w-full h-2.5 bg-gray-900 rounded-full overflow-hidden border border-gray-800">
                <div className="h-full bg-cyan-400" style={{ width: `${pct(ratings.easy)}%` }} />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-emerald-400">Good (Rating 3)</span>
                <span className="text-gray-300">{ratings.good} ({pct(ratings.good)}%)</span>
              </div>
              <div className="w-full h-2.5 bg-gray-900 rounded-full overflow-hidden border border-gray-800">
                <div className="h-full bg-emerald-400" style={{ width: `${pct(ratings.good)}%` }} />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-amber-400">Hard (Rating 2)</span>
                <span className="text-gray-300">{ratings.hard} ({pct(ratings.hard)}%)</span>
              </div>
              <div className="w-full h-2.5 bg-gray-900 rounded-full overflow-hidden border border-gray-800">
                <div className="h-full bg-amber-400" style={{ width: `${pct(ratings.hard)}%` }} />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-red-400">Blackout (Rating 1)</span>
                <span className="text-gray-300">{ratings.blackout} ({pct(ratings.blackout)}%)</span>
              </div>
              <div className="w-full h-2.5 bg-gray-900 rounded-full overflow-hidden border border-gray-800">
                <div className="h-full bg-red-400" style={{ width: `${pct(ratings.blackout)}%` }} />
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* SM-2 Algorithm Explanation Banner */}
      <div className="glass-panel p-6 rounded-2xl border border-indigo-500/30 bg-gradient-to-r from-indigo-950/40 via-purple-950/30 to-gray-900/60 space-y-3">
        <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm">
          <BrainCircuit className="w-5 h-5" /> SuperMemo SM-2 Mathematical Formula
        </div>
        <p className="text-xs text-gray-300 leading-relaxed font-mono bg-gray-950/70 p-3 rounded-xl border border-gray-800">
          EF' = EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02)) <br/>
          Interval_new = ceil(Interval_old * EF)
        </p>
        <p className="text-xs text-gray-400">
          Ease Factor (EF) starts at 2.5 and adjusts dynamically per review. Minimum threshold is set to 1.3 to guarantee consistent retention without burnout.
        </p>
      </div>

    </div>
  );
}
