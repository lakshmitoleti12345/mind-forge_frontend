import React, { useState, useEffect } from 'react';
import { Play, CheckCircle2, XCircle, Code, Terminal, Clock, RefreshCw, AlertTriangle, Globe, Search, Filter } from 'lucide-react';
import { api } from '../services/api';

const LANGUAGE_TEMPLATES = {
  python: {
    label: 'Python 3.13',
    icon: '🐍',
    boilerplate: {
      default: "# Write your Python solution here\ndef solution():\n    pass"
    }
  },
  javascript: {
    label: 'JavaScript (Node.js)',
    icon: '⚡',
    boilerplate: {
      default: "// Write your JavaScript solution here\nfunction solution() {\n    return true;\n}"
    }
  },
  sql: {
    label: 'SQL (SQLite)',
    icon: '🗄️',
    boilerplate: {
      default: "-- SQL Query Practice\nSELECT * FROM users;"
    }
  }
};

export default function CodingArena({ problems }) {
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState('python');
  const [userCode, setUserCode] = useState('');
  const [executing, setExecuting] = useState(false);
  const [execResult, setExecResult] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    if (problems && problems.length > 0 && !selectedProblem) {
      handleSelectProblem(problems[0]);
    }
  }, [problems]);

  const handleSelectProblem = (prob) => {
    setSelectedProblem(prob);
    setSelectedLanguage(prob.language || 'python');
    setUserCode(prob.initial_code || '');
    setExecResult(null);
  };

  const handleLanguageChange = (newLang) => {
    setSelectedLanguage(newLang);
    setExecResult(null);
    if (newLang === selectedProblem?.language) {
      setUserCode(selectedProblem.initial_code || '');
    } else {
      const defaultTmpl = LANGUAGE_TEMPLATES[newLang]?.boilerplate.default;
      setUserCode(defaultTmpl || `# Solution in ${newLang}`);
    }
  };

  const handleRunCode = async () => {
    if (!selectedProblem || !userCode) return;
    setExecuting(true);
    setExecResult(null);

    try {
      const result = await api.executeCode(selectedProblem.id, userCode, selectedLanguage);
      setExecResult(result);
    } catch (err) {
      setExecResult({
        status: 'Runtime Error',
        error_message: err.message || 'Execution failed',
        passed_count: 0,
        total_tests: selectedProblem.test_cases_json?.length || 0,
        results: []
      });
    } finally {
      setExecuting(false);
    }
  };

  const categories = ['All', 'Arrays & Hashing', 'Two Pointers', 'Sliding Window', 'Strings', 'Stack & Strings', 'Algorithms & DP', 'SQL Data Query'];

  const filteredProblems = (problems || []).filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) || p.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || p.category.toLowerCase().includes(selectedCategory.toLowerCase());
    return matchesSearch && matchesCategory;
  });

  const difficultyColors = {
    Easy: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    Medium: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    Hard: 'bg-red-500/10 text-red-400 border-red-500/20',
  };

  if (!problems || problems.length === 0) {
    return (
      <div className="py-12 text-center human-panel rounded-xl p-8 max-w-xl mx-auto space-y-3">
        <Code className="w-10 h-10 mx-auto text-indigo-400 animate-pulse" />
        <h3 className="text-lg font-bold text-slate-100">Coding Arena Loading...</h3>
        <p className="text-xs text-slate-400">Loading problem sets.</p>
      </div>
    );
  }

  return (
    <div className="py-6 space-y-5">
      
      {/* Search & Category Filter Bar */}
      <div className="human-panel p-3.5 rounded-xl border border-slate-800 space-y-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-72">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search 55 coding problems..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto w-full pb-1 sm:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-md text-xs font-medium whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Split IDE Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left Column: Problem List & Statement (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Problem Selector List */}
          <div className="human-panel p-3 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-400 px-1 uppercase tracking-wider">
              <span>Problems ({filteredProblems.length})</span>
            </div>

            <div className="space-y-1 max-h-60 overflow-y-auto pr-1">
              {filteredProblems.map((prob) => {
                const isSelected = selectedProblem?.id === prob.id;
                return (
                  <button
                    key={prob.id}
                    onClick={() => handleSelectProblem(prob)}
                    className={`w-full text-left p-2.5 rounded-lg text-xs font-medium flex items-center justify-between transition-all ${
                      isSelected
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
                    }`}
                  >
                    <div className="truncate pr-2">{prob.title}</div>
                    <span className={`text-[10px] px-2 py-0.5 rounded border shrink-0 ${difficultyColors[prob.difficulty] || 'text-slate-400'}`}>
                      {prob.difficulty}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selected Problem Description */}
          {selectedProblem && (
            <div className="human-panel p-5 rounded-xl border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <span className={`text-xs font-bold px-2.5 py-0.5 rounded border ${difficultyColors[selectedProblem.difficulty]}`}>
                  {selectedProblem.difficulty}
                </span>
                <span className="text-xs font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                  {selectedProblem.category}
                </span>
              </div>

              <div>
                <h2 className="text-lg font-bold text-slate-100">{selectedProblem.title}</h2>
              </div>

              <div className="text-xs text-slate-300 leading-relaxed whitespace-pre-line border-t border-slate-800 pt-3">
                {selectedProblem.description}
              </div>

              {/* Example Test Cases */}
              <div className="border-t border-slate-800 pt-3 space-y-2">
                <div className="text-xs font-bold text-slate-400">Example Test Cases:</div>
                {selectedProblem.test_cases_json?.map((tc, idx) => (
                  <div key={idx} className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 font-mono text-[11px] space-y-1">
                    <div className="text-slate-400"><span className="text-indigo-400 font-bold">Input:</span> {tc.input}</div>
                    <div className="text-slate-400"><span className="text-emerald-400 font-bold">Expected:</span> {tc.expected_output}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Right Column: Code Editor & Console Output (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Code Editor Header Controls */}
          <div className="human-panel p-4 rounded-xl border border-slate-800 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
              
              {/* Language Selector Dropdown */}
              <div className="flex items-center gap-2">
                <Globe className="w-3.5 h-3.5 text-indigo-400" />
                <span className="text-xs font-medium text-slate-300">Language:</span>
                <select
                  value={selectedLanguage}
                  onChange={(e) => handleLanguageChange(e.target.value)}
                  className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-700 text-xs font-semibold text-slate-100 focus:outline-none focus:border-indigo-500 cursor-pointer"
                >
                  <option value="python">🐍 Python 3.13</option>
                  <option value="javascript">⚡ JavaScript (Node.js)</option>
                  <option value="sql">🗄️ SQL Query (SQLite)</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleLanguageChange(selectedLanguage)}
                  className="px-2.5 py-1 rounded-md bg-slate-900 hover:bg-slate-800 text-slate-400 text-xs font-medium border border-slate-800 flex items-center gap-1"
                >
                  <RefreshCw className="w-3 h-3" /> Reset
                </button>

                <button
                  onClick={handleRunCode}
                  disabled={executing}
                  className="flex items-center gap-1.5 px-3.5 py-1 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-sm transition-all disabled:opacity-50"
                >
                  <Play className="w-3.5 h-3.5 fill-current" /> {executing ? 'Executing...' : 'Run Code'}
                </button>
              </div>
            </div>

            {/* Monospaced Dark Code Editor */}
            <div className="relative rounded-lg overflow-hidden border border-slate-800 bg-slate-950">
              <textarea
                value={userCode}
                onChange={(e) => setUserCode(e.target.value)}
                rows={14}
                spellCheck={false}
                className="w-full p-4 font-mono text-xs text-emerald-300 bg-slate-950 focus:outline-none resize-none leading-relaxed"
                placeholder="Write code solution here..."
              />
            </div>
          </div>

          {/* Execution Output Console */}
          {execResult && (
            <div className="human-panel p-4 rounded-xl border border-slate-800 space-y-3 animate-fadeIn">
              
              {/* Output Header */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                <div className="flex items-center gap-2">
                  {execResult.status === 'Accepted' ? (
                    <span className="flex items-center gap-1 px-2.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold text-xs border border-emerald-500/20">
                      <CheckCircle2 className="w-3.5 h-3.5" /> ACCEPTED
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 px-2.5 py-0.5 rounded bg-red-500/10 text-red-400 font-bold text-xs border border-red-500/20">
                      <XCircle className="w-3.5 h-3.5" /> {execResult.status.toUpperCase()}
                    </span>
                  )}

                  <span className="text-xs text-slate-400">
                    Passed {execResult.passed_count} / {execResult.total_tests} Test Cases
                  </span>
                </div>

                <div className="text-xs font-mono text-indigo-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {execResult.execution_time_ms} ms
                </div>
              </div>

              {/* Error Details */}
              {execResult.error_message && (
                <div className="p-3 rounded-md bg-red-950/40 border border-red-900 font-mono text-xs text-red-300 whitespace-pre-wrap">
                  <AlertTriangle className="w-3.5 h-3.5 text-red-400 inline mr-1" />
                  {execResult.error_message}
                </div>
              )}

              {/* Test Case Breakdown */}
              {execResult.results && execResult.results.length > 0 && (
                <div className="space-y-1.5">
                  <div className="text-xs font-semibold text-slate-400">Test Case Results:</div>
                  <div className="space-y-1.5">
                    {execResult.results.map((res) => (
                      <div
                        key={res.test_num}
                        className={`p-2.5 rounded-md border font-mono text-xs space-y-1 ${
                          res.passed
                            ? 'bg-slate-900/80 border-slate-800 text-emerald-300'
                            : 'bg-red-950/20 border-red-900/50 text-red-300'
                        }`}
                      >
                        <div className="flex items-center justify-between font-bold text-[11px]">
                          <span>Test #{res.test_num}</span>
                          <span>{res.passed ? '✓ PASSED' : '✗ FAILED'}</span>
                        </div>
                        <div className="text-[11px] opacity-80">Input: {res.input}</div>
                        <div className="text-[11px] opacity-80">Expected: {res.expected} | Output: {res.actual}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          )}

        </div>

      </div>

    </div>
  );
}
