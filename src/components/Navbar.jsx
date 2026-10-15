import React from 'react';
import { Terminal, Layers, LayoutDashboard, BarChart2, User, LogOut, Shield, Plus } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, currentUser, onOpenAuthModal, onLogout, onOpenNewDeck }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'coding', label: 'Coding Arena', icon: Terminal },
    { id: 'decks', label: 'Flashcards', icon: Layers },
    { id: 'analytics', label: 'Analytics', icon: BarChart2 },
  ];

  const isAdmin = currentUser?.is_admin;

  return (
    <header className="sticky top-0 z-50 bg-[#0f172a]/90 backdrop-blur-md border-b border-slate-800 px-6 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Brand Logo */}
        <div 
          onClick={() => setActiveTab('dashboard')} 
          className="flex items-center gap-3 cursor-pointer"
        >
          <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-black text-lg shadow-sm">
            M
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg text-slate-100 tracking-tight">
                MindForge
              </span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                Career Prep
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Bar */}
        <nav className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-md text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right User Actions */}
        <div className="flex items-center gap-3">
          
          {/* Admin Deck Creation Button */}
          {isAdmin && (
            <button
              onClick={onOpenNewDeck}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Content</span>
            </button>
          )}

          {/* User Account / Sign In */}
          {currentUser ? (
            <div className="flex items-center gap-2 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
              <div className="text-right">
                <div className="text-xs font-semibold text-slate-200 flex items-center gap-1">
                  {isAdmin && <Shield className="w-3 h-3 text-amber-400 inline" />}
                  {currentUser.username}
                </div>
              </div>

              <button
                onClick={onLogout}
                title="Sign out"
                className="p-1 rounded text-slate-400 hover:text-red-400 transition-colors ml-1"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuthModal}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-medium transition-all"
            >
              <User className="w-3.5 h-3.5 text-indigo-400" />
              <span>Sign In</span>
            </button>
          )}

        </div>

      </div>
    </header>
  );
}
