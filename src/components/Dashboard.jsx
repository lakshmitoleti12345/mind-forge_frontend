import React from 'react';
import { Play, BookOpen, CheckCircle, Clock, Terminal, ArrowRight, Layers, Sparkles, ShieldCheck, Zap, Code, Database, Server } from 'lucide-react';

export default function Dashboard({ decks, analytics, onStartStudy, onOpenNewDeck }) {
  const subjects = [
    {
      id: 'python',
      title: 'Python Core & Advanced',
      icon: Code,
      badge: '30 Questions',
      color: 'from-emerald-500 to-teal-600',
      description: 'GIL, Decorators, Generators, Asyncio, Memory Management, Dunder Methods & OOP.',
      deckId: 4
    },
    {
      id: 'sql',
      title: 'SQL & Database Architecture',
      icon: Database,
      badge: '30 Questions',
      color: 'from-indigo-500 to-blue-600',
      description: 'JOINs, Window Functions, Indexing, ACID Properties, CTEs, Normalization 1NF-3NF.',
      deckId: 5
    },
    {
      id: 'js',
      title: 'JavaScript Core (ES6+)',
      icon: Zap,
      badge: '30 Questions',
      color: 'from-amber-500 to-orange-500',
      description: 'Event Loop, Closures, Prototypes, Async/Await, DOM Delegation, ES6+ Data Structures.',
      deckId: 6
    },
    {
      id: 'react',
      title: 'React 19 Framework',
      icon: Layers,
      badge: '30 Questions',
      color: 'from-cyan-500 to-blue-500',
      description: 'Virtual DOM, Reconciliation, Custom Hooks, Server Components, useActionState, Suspense.',
      deckId: 7
    },
    {
      id: 'django',
      title: 'Django REST Framework',
      icon: Server,
      badge: '30 Questions',
      color: 'from-purple-500 to-indigo-600',
      description: 'MVT, ORM Optimization, Serializers, ViewSets, JWT Auth, Signals, Middleware, Transactions.',
      deckId: 8
    }
  ];

  return (
    <div className="space-y-8 py-8 animate-fadeIn">
      
      {/* 🚀 FIRST-IMPRESSION HERO BANNER */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900/90 to-indigo-950/40 p-8 shadow-xl">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Python Full-Stack Career Portal & LeetCode Arena</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
            Master Full-Stack Engineering & <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-teal-300 bg-clip-text text-transparent">Crack Technical Interviews</span>
          </h1>

          <p className="text-slate-300 text-sm leading-relaxed max-w-2xl">
            A comprehensive practice suite for students and freshers: 150+ high-frequency interview questions powered by SM-2 spaced repetition alongside 55 live LeetCode coding challenges.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => onStartStudy(decks[0] || { id: 4 })}
              className="px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md transition-all flex items-center gap-2"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Start Practice Decks</span>
            </button>
          </div>
        </div>
      </div>

      {/* 📊 METRICS ROW */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="human-card p-5 rounded-xl border border-slate-800 space-y-2 bg-slate-900/90">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Interview Q&A</span>
            <BookOpen className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-3xl font-extrabold text-white">
            150+
          </div>
          <p className="text-[11px] text-slate-400">Across 5 Core Tech Domains</p>
        </div>

        <div className="human-card p-5 rounded-xl border border-slate-800 space-y-2 bg-slate-900/90">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>LeetCode Challenges</span>
            <Terminal className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-extrabold text-white">
            55
          </div>
          <p className="text-[11px] text-slate-400">Python, JS & SQL Problems</p>
        </div>

        <div className="human-card p-5 rounded-xl border border-slate-800 space-y-2 bg-slate-900/90">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Due Today</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-extrabold text-white">
            {analytics?.due_cards ?? 0}
          </div>
          <p className="text-[11px] text-slate-400">SM-2 Scheduled Reviews</p>
        </div>

        <div className="human-card p-5 rounded-xl border border-slate-800 space-y-2 bg-slate-900/90">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Mastered Concepts</span>
            <CheckCircle className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-3xl font-extrabold text-white">
            {analytics?.mastered_cards ?? 0}
          </div>
          <p className="text-[11px] text-slate-400">Interval &gt; 21 Days</p>
        </div>

      </div>

      {/* 📚 FULL-STACK CURRICULUM SUBJECTS GRID */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h2 className="text-xl font-extrabold text-white tracking-tight">Full-Stack Curriculum Subjects</h2>
            <p className="text-xs text-slate-400">Select any module to launch your spaced repetition study session</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {subjects.map((sub) => {
            const IconComponent = sub.icon;
            const matchingDeck = decks.find(d => d.id === sub.deckId || d.title.toLowerCase().includes(sub.id));
            const targetDeck = matchingDeck || decks[0];

            return (
              <div
                key={sub.id}
                className="human-card rounded-xl p-6 border border-slate-800 flex flex-col justify-between hover:border-indigo-500/50 bg-slate-900/90 transition-all group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="p-2.5 rounded-lg bg-slate-800 text-indigo-400 border border-slate-700">
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-bold px-2.5 py-1 rounded bg-slate-800 text-indigo-300 border border-slate-700">
                      {sub.badge}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors">
                      {sub.title}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                      {sub.description}
                    </p>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-400">
                    Verified Q&A
                  </span>

                  <button
                    onClick={() => onStartStudy(targetDeck)}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm transition-all"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" /> Study Now
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
