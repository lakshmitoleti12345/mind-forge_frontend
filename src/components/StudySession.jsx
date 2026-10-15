import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { ArrowLeft, CheckCircle2, RotateCcw, Award, Sparkles, Keyboard, Volume2 } from 'lucide-react';
import Flashcard3D from './Flashcard3D';

export default function StudySession({ deck, cards, onComplete, onRateCard }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [reviewedStats, setReviewedStats] = useState({ 1: 0, 2: 0, 3: 0, 4: 0 });

  const currentCard = cards[currentIndex];

  // Keyboard shortcut listeners
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (completed || !currentCard) return;

      if (e.code === 'Space') {
        e.preventDefault();
        setIsFlipped(prev => !prev);
      } else if (isFlipped && ['Digit1', 'Digit2', 'Digit3', 'Digit4'].includes(e.code)) {
        const rating = Number(e.code.replace('Digit', ''));
        handleRate(currentCard.id, rating);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, isFlipped, completed, currentCard]);

  const handleRate = async (cardId, rating) => {
    // Record rating count
    setReviewedStats(prev => ({ ...prev, [rating]: prev[rating] + 1 }));

    // Send rating to backend SM-2 algorithm
    if (onRateCard) {
      await onRateCard(cardId, rating);
    }

    // Move to next card or complete
    if (currentIndex + 1 < cards.length) {
      setIsFlipped(false);
      setCurrentIndex(prev => prev + 1);
    } else {
      setCompleted(true);
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      });
    }
  };

  const progressPct = cards.length > 0 ? Math.round(((currentIndex) / cards.length) * 100) : 100;

  if (!cards || cards.length === 0) {
    return (
      <div className="max-w-xl mx-auto my-12 p-8 glass-panel rounded-3xl text-center space-y-4">
        <CheckCircle2 className="w-16 h-16 mx-auto text-emerald-400 animate-bounce" />
        <h2 className="text-2xl font-bold text-gray-100">All caught up!</h2>
        <p className="text-gray-400 text-sm">No cards due for review in this deck right now. Great job!</p>
        <button
          onClick={onComplete}
          className="px-6 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold text-sm hover:bg-indigo-500 transition-colors"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  if (completed) {
    return (
      <div className="max-w-xl mx-auto my-12 p-8 glass-panel rounded-3xl text-center space-y-6">
        <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-tr from-amber-500 to-indigo-600 p-0.5 shadow-xl shadow-indigo-500/20">
          <div className="w-full h-full rounded-full bg-gray-900 flex items-center justify-center">
            <Award className="w-10 h-10 text-amber-400" />
          </div>
        </div>

        <div>
          <h2 className="text-3xl font-extrabold text-white">Study Session Complete!</h2>
          <p className="text-gray-400 text-sm mt-1">You just updated memory curves for {cards.length} flashcards.</p>
        </div>

        <div className="grid grid-cols-4 gap-2 bg-gray-900/60 p-4 rounded-2xl border border-gray-800 text-xs">
          <div className="text-red-400"><div className="font-bold text-lg">{reviewedStats[1]}</div>Blackout</div>
          <div className="text-amber-400"><div className="font-bold text-lg">{reviewedStats[2]}</div>Hard</div>
          <div className="text-emerald-400"><div className="font-bold text-lg">{reviewedStats[3]}</div>Good</div>
          <div className="text-cyan-400"><div className="font-bold text-lg">{reviewedStats[4]}</div>Easy</div>
        </div>

        <button
          onClick={onComplete}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-sm shadow-lg hover:from-indigo-500 hover:to-purple-500 transition-all"
        >
          Done & Return to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      
      {/* Top Session Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={onComplete}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gray-900 text-gray-400 hover:text-white border border-gray-800 text-xs font-medium transition-all"
        >
          <ArrowLeft className="w-4 h-4" /> Exit Session
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-gray-400">{deck?.title || 'Study Mode'}</span>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-gray-400 font-mono">
          <Keyboard className="w-4 h-4 text-indigo-400" />
          <span className="hidden sm:inline">Space: Flip | 1-4: Rate</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs font-semibold text-gray-400">
          <span>Progress ({currentIndex + 1} / {cards.length})</span>
          <span>{progressPct}%</span>
        </div>
        <div className="w-full h-2 bg-gray-900 rounded-full overflow-hidden border border-gray-800">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-400 transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / cards.length) * 100}%` }}
          />
        </div>
      </div>

      {/* 3D Flashcard */}
      <Flashcard3D
        card={currentCard}
        isFlipped={isFlipped}
        setIsFlipped={setIsFlipped}
        onRate={handleRate}
      />

    </div>
  );
}
