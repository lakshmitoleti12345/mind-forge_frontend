import React, { useState } from 'react';
import { Plus, Search, BookOpen, Layers, Sparkles, Check, X, Lock, ShieldAlert } from 'lucide-react';

export default function DeckManager({ decks, currentUser, onCreateDeck, onCreateCard }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeckModal, setShowDeckModal] = useState(false);
  const [showCardModal, setShowCardModal] = useState(false);
  const [selectedDeckId, setSelectedDeckId] = useState(decks[0]?.id || 1);

  // Deck Form state
  const [deckTitle, setDeckTitle] = useState('');
  const [deckDesc, setDeckDesc] = useState('');
  const [deckCategory, setDeckCategory] = useState('Backend Development');

  // Card Form state
  const [cardFront, setCardFront] = useState('');
  const [cardBack, setCardBack] = useState('');
  const [cardExplanation, setCardExplanation] = useState('');
  const [cardTags, setCardTags] = useState('');

  const [errorMsg, setErrorMsg] = useState('');

  const isAdmin = currentUser?.is_admin;

  const filteredDecks = decks.filter(d => 
    d.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeckSubmit = async (e) => {
    e.preventDefault();
    if (!isAdmin) {
      setErrorMsg('Permission Denied: Only Admin users can create new study decks!');
      return;
    }
    try {
      await onCreateDeck({
        title: deckTitle,
        description: deckDesc,
        category: deckCategory,
        color_gradient: 'from-indigo-600 to-purple-600'
      });
      setDeckTitle('');
      setDeckDesc('');
      setShowDeckModal(false);
    } catch (err) {
      setErrorMsg(err.message);
    }
  };

  const handleCardSubmit = async (e) => {
    e.preventDefault();
    if (!isAdmin) {
      setErrorMsg('Permission Denied: Only Admin users can add cards!');
      return;
    }
    try {
      await onCreateCard({
        deck: selectedDeckId,
        front: cardFront,
        back: cardBack,
        explanation: cardExplanation,
        tags: cardTags
      });
      setCardFront('');
      setCardBack('');
      setCardExplanation('');
      setCardTags('');
      setShowCardModal(false);
    } catch (err) {
      setErrorMsg(err.message);
    }
  };

  return (
    <div className="space-y-6 py-6">
      
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Deck & Card Management</h1>
          <p className="text-xs text-gray-400">150+ Interview Questions across 5 Subjects</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search subjects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 rounded-xl bg-gray-900 border border-gray-800 text-xs text-white focus:outline-none focus:border-indigo-500 w-48 sm:w-64"
            />
          </div>

          {isAdmin ? (
            <>
              <button
                onClick={() => setShowCardModal(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-white text-xs font-semibold border border-gray-700 transition-all"
              >
                <Plus className="w-4 h-4 text-indigo-400" /> Add Card
              </button>

              <button
                onClick={() => setShowDeckModal(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/20 transition-all"
              >
                <Plus className="w-4 h-4" /> New Deck
              </button>
            </>
          ) : (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold">
              <Lock className="w-3.5 h-3.5" /> Admin Only Card Creation
            </div>
          )}
        </div>
      </div>

      {/* Permission Warning Banner for non-admins */}
      {!isAdmin && (
        <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Card creation is locked to <strong>Admin users</strong>. Sign in as <strong>admin</strong> to add or edit flashcards.</span>
          </div>
        </div>
      )}

      {/* Decks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredDecks.map((deck) => (
          <div key={deck.id} className="glass-panel rounded-2xl p-6 border border-gray-800 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                {deck.category}
              </span>
              <span className="text-xs text-gray-400 font-mono">
                {deck.total_cards || 30} cards
              </span>
            </div>

            <div>
              <h3 className="text-lg font-bold text-white">{deck.title}</h3>
              <p className="text-xs text-gray-400 line-clamp-2 mt-1">{deck.description}</p>
            </div>

            <div className="pt-3 border-t border-gray-800 flex justify-between items-center text-xs">
              {isAdmin ? (
                <button
                  onClick={() => {
                    setSelectedDeckId(deck.id);
                    setShowCardModal(true);
                  }}
                  className="text-indigo-400 font-semibold hover:underline flex items-center gap-1"
                >
                  + Add Card to Deck
                </button>
              ) : (
                <span className="text-gray-500 text-[11px]">30 Verified Questions</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* NEW DECK MODAL */}
      {showDeckModal && isAdmin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="glass-panel w-full max-w-lg rounded-3xl p-6 border border-gray-700 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-gray-800 pb-3">
              <h3 className="text-lg font-bold text-white">Create New Study Deck (Admin Only)</h3>
              <button onClick={() => setShowDeckModal(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleDeckSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Deck Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. System Design Patterns"
                  value={deckTitle}
                  onChange={(e) => setDeckTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-gray-900 border border-gray-800 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Category</label>
                <input
                  type="text"
                  placeholder="e.g. Computer Science, Architecture"
                  value={deckCategory}
                  onChange={(e) => setDeckCategory(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-gray-900 border border-gray-800 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Description</label>
                <textarea
                  rows="3"
                  placeholder="Brief summary of topics covered..."
                  value={deckDesc}
                  onChange={(e) => setDeckDesc(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-gray-900 border border-gray-800 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowDeckModal(false)}
                  className="px-4 py-2 rounded-xl bg-gray-800 text-xs font-semibold text-gray-300 hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 text-xs font-semibold text-white shadow-lg hover:bg-indigo-500"
                >
                  Create Deck
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* NEW CARD MODAL */}
      {showCardModal && isAdmin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="glass-panel w-full max-w-xl rounded-3xl p-6 border border-gray-700 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-gray-800 pb-3">
              <h3 className="text-lg font-bold text-white">Add Flashcard (Admin Only)</h3>
              <button onClick={() => setShowCardModal(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleCardSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Target Deck</label>
                <select
                  value={selectedDeckId}
                  onChange={(e) => setSelectedDeckId(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-xl bg-gray-900 border border-gray-800 text-sm text-white focus:outline-none focus:border-indigo-500"
                >
                  {decks.map(d => (
                    <option key={d.id} value={d.id}>{d.title}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Front (Question)</label>
                <textarea
                  rows="2"
                  required
                  placeholder="Enter the prompt or question..."
                  value={cardFront}
                  onChange={(e) => setCardFront(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-gray-900 border border-gray-800 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Back (Verified Answer)</label>
                <textarea
                  rows="3"
                  required
                  placeholder="Enter the clear, concise answer..."
                  value={cardBack}
                  onChange={(e) => setCardBack(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-gray-900 border border-gray-800 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Code Snippet / Explanation (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Example code snippet..."
                  value={cardExplanation}
                  onChange={(e) => setCardExplanation(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-gray-900 border border-gray-800 text-sm font-mono text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Tags (Comma-separated)</label>
                <input
                  type="text"
                  placeholder="e.g. Python, REST, Algorithms"
                  value={cardTags}
                  onChange={(e) => setCardTags(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-gray-900 border border-gray-800 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCardModal(false)}
                  className="px-4 py-2 rounded-xl bg-gray-800 text-xs font-semibold text-gray-300 hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 text-xs font-semibold text-white shadow-lg hover:bg-indigo-500"
                >
                  Save Card
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
