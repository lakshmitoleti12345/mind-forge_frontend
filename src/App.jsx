import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import StudySession from './components/StudySession';
import DeckManager from './components/DeckManager';
import AnalyticsView from './components/AnalyticsView';
import CodingArena from './components/CodingArena';
import AuthModal from './components/AuthModal';
import { api } from './services/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [decks, setDecks] = useState([]);
  const [codingProblems, setCodingProblems] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [activeStudyDeck, setActiveStudyDeck] = useState(null);
  const [studyCards, setStudyCards] = useState([]);
  const [loading, setLoading] = useState(true);

  // User Authentication State
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    checkCurrentUser();
    loadInitialData();
  }, []);

  const checkCurrentUser = async () => {
    const userData = await api.getCurrentUser();
    if (userData && userData.is_authenticated) {
      setCurrentUser(userData.user);
    }
  };

  const loadInitialData = async () => {
    setLoading(true);
    const backendDecks = await api.getDecks();
    if (backendDecks) setDecks(backendDecks);

    const problems = await api.getCodingProblems();
    if (problems) setCodingProblems(problems);

    const backendAnalytics = await api.getAnalytics();
    if (backendAnalytics) setAnalytics(backendAnalytics);

    setLoading(false);
  };

  const handleStartStudy = async (deck) => {
    setLoading(true);
    setActiveStudyDeck(deck);

    const studySessionData = await api.getStudyCards(deck.id);
    if (studySessionData && studySessionData.cards) {
      setStudyCards(studySessionData.cards);
    } else {
      setStudyCards([]);
    }

    setLoading(false);
    setActiveTab('study');
  };

  const handleRateCard = async (cardId, rating) => {
    await api.submitReview(cardId, rating);
    const updatedAnalytics = await api.getAnalytics();
    if (updatedAnalytics) setAnalytics(updatedAnalytics);
  };

  const handleAuthAction = async (type, credentials) => {
    if (type === 'login') {
      const data = await api.login(credentials.username, credentials.password);
      setCurrentUser(data.user);
    } else if (type === 'register') {
      await api.register(credentials.username, credentials.password, credentials.email, credentials.is_admin);
      const loginData = await api.login(credentials.username, credentials.password);
      setCurrentUser(loginData.user);
    }
  };

  const handleLogout = async () => {
    await api.logout();
    setCurrentUser(null);
  };

  const handleCreateDeck = async (newDeckData) => {
    const created = await api.createDeck(newDeckData);
    if (created) {
      setDecks(prev => [created, ...prev]);
    }
  };

  const handleCreateCard = async (newCardData) => {
    await api.createCard(newCardData);
    loadInitialData();
  };

  return (
    <div className="min-h-screen bg-mesh text-gray-100 flex flex-col font-sans">
      
      {/* Navigation Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onLogout={handleLogout}
        onOpenNewDeck={() => setActiveTab('decks')}
      />

      {/* Main App Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8">
        {activeTab === 'dashboard' && (
          <Dashboard
            decks={decks}
            analytics={analytics}
            onStartStudy={handleStartStudy}
            onOpenNewDeck={() => setActiveTab('decks')}
          />
        )}

        {activeTab === 'coding' && (
          <CodingArena problems={codingProblems} />
        )}

        {activeTab === 'study' && (
          <StudySession
            deck={activeStudyDeck}
            cards={studyCards}
            onRateCard={handleRateCard}
            onComplete={() => setActiveTab('dashboard')}
          />
        )}

        {activeTab === 'decks' && (
          <DeckManager
            decks={decks}
            currentUser={currentUser}
            onCreateDeck={handleCreateDeck}
            onCreateCard={handleCreateCard}
          />
        )}

        {activeTab === 'analytics' && (
          <AnalyticsView analytics={analytics} />
        )}
      </main>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={handleAuthAction}
      />

      {/* Footer */}
      <footer className="border-t border-gray-900 glass-panel mt-12 py-6 text-center text-xs text-gray-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            <span className="font-bold text-gray-300">MindForge Career Portal</span> &bull; 150+ Questions + LeetCode Practice Arena
          </div>
          <div>
            Python 3.13 &bull; Django REST &bull; React 19 &bull; Live Code Execution Sandbox
          </div>
        </div>
      </footer>

    </div>
  );
}
