import React from 'react';
import { RotateCw, CheckCircle2, HelpCircle, Code } from 'lucide-react';

export default function Flashcard3D({ card, onRate, isFlipped, setIsFlipped }) {
  if (!card) return null;

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const ratings = [
    { value: 1, label: 'Blackout', subtitle: '1 day', color: 'bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20' },
    { value: 2, label: 'Hard', subtitle: '1 day', color: 'bg-amber-500/10 text-amber-400 border-amber-500/20 hover:bg-amber-500/20' },
    { value: 3, label: 'Good', subtitle: '6 days', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20' },
    { value: 4, label: 'Easy', subtitle: '14 days', color: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20 hover:bg-indigo-500/20' },
  ];

  const tagList = card.tags ? card.tags.split(',').map(t => t.trim()) : [];

  return (
    <div className="w-full max-w-2xl mx-auto my-4">
      <div 
        onClick={handleFlip}
        className="w-full min-h-[360px] cursor-pointer transition-all duration-300 relative"
      >
        {!isFlipped ? (
          /* FRONT SIDE - QUESTION */
          <div className="w-full min-h-[360px] p-7 flex flex-col justify-between human-panel border border-slate-800 rounded-xl bg-slate-900 shadow-md">
            {/* Front Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-indigo-400" />
                <span className="text-xs uppercase font-bold tracking-wider text-slate-400">
                  Question Card
                </span>
              </div>

              <div className="flex gap-1.5 flex-wrap">
                {tagList.map((tag, idx) => (
                  <span key={idx} className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Question Text */}
            <div className="my-auto py-6">
              <h3 className="text-xl font-semibold text-slate-100 leading-relaxed">
                {card.front}
              </h3>
            </div>

            {/* Front Footer */}
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1.5 text-indigo-400 font-medium">
                <RotateCw className="w-3.5 h-3.5" /> Click or press Space to reveal answer
              </span>
              <span>Interval: {card.interval || 0} days</span>
            </div>
          </div>
        ) : (
          /* BACK SIDE - ANSWER */
          <div className="w-full min-h-[360px] p-7 flex flex-col justify-between human-panel border border-indigo-500/30 rounded-xl bg-slate-900 shadow-md">
            {/* Back Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span className="text-xs uppercase font-bold tracking-wider text-emerald-400">
                  Verified Answer & Explanation
                </span>
              </div>
              <span className="text-xs font-mono text-slate-400">Ease Factor: {card.ease_factor || 2.5}</span>
            </div>

            {/* Answer Content */}
            <div className="my-auto py-3 space-y-3 overflow-y-auto max-h-[200px] pr-1">
              <div className="text-base font-medium text-slate-100 whitespace-pre-line leading-relaxed">
                {card.back}
              </div>

              {card.explanation && (
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs text-indigo-200 font-mono flex items-start gap-2">
                  <Code className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                  <div className="whitespace-pre-wrap">{card.explanation}</div>
                </div>
              )}
            </div>

            {/* Back Footer Rating Buttons */}
            <div 
              onClick={(e) => e.stopPropagation()} 
              className="pt-3 border-t border-slate-800"
            >
              <p className="text-xs text-center text-slate-400 mb-2 font-medium">
                Rate recall difficulty:
              </p>
              <div className="grid grid-cols-4 gap-2">
                {ratings.map((r) => (
                  <button
                    key={r.value}
                    onClick={() => onRate(card.id, r.value)}
                    className={`py-1.5 px-1 rounded-md text-center border font-semibold transition-all hover:scale-105 ${r.color}`}
                  >
                    <div className="text-xs font-bold">{r.label}</div>
                    <div className="text-[10px] opacity-70">{r.subtitle}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
