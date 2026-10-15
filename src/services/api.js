
const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL ||
  'https://mind-forge-backendfolder.vercel.app/api'
).replace(/\/+$/, '');

console.log('API Base URL:', API_BASE_URL);

/**
 * Safely parse a fetch Response as JSON.
 * If the server returns HTML (e.g. a Django 500 debug page or a Vercel error
 * page) this gives a readable message instead of "Unexpected token '<'".
 */
async function safeJson(res) {
  const contentType = res.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    return res.json();
  }
  // Non-JSON body — read as text for diagnostics
  const text = await res.text();
  if (text.includes('readonly database') || text.includes('OperationalError')) {
    throw new Error(
      `Server error ${res.status}: The backend database is read-only on this deployment. ` +
      'Please contact the administrator to fix the Vercel SQLite configuration.'
    );
  }
  if (res.status >= 500) {
    throw new Error(
      `Server error ${res.status}: The backend returned an unexpected response. ` +
      'Check the Vercel deployment logs for details.'
    );
  }
  // For 4xx with non-JSON, include the raw text (truncated)
  throw new Error(`Unexpected response (${res.status}): ${text.substring(0, 200)}`);
}

export const api = {
  // Fetch all decks
  async getDecks() {
    try {
      const res = await fetch(`${API_BASE_URL}/decks/`, { credentials: 'include' });
      if (!res.ok) throw new Error('Network response was not ok');
      return await res.json();
    } catch (err) {
      console.warn('API error, using local fallback:', err);
      return null;
    }
  },

  // Fetch cards due for study in a deck
  async getStudyCards(deckId) {
    try {
      const res = await fetch(`${API_BASE_URL}/decks/${deckId}/study/`, { credentials: 'include' });
      if (!res.ok) throw new Error('Failed to fetch study session');
      return await res.json();
    } catch (err) {
      console.warn('API error during study fetch:', err);
      return null;
    }
  },

  // Submit card review rating to trigger SM-2 algorithm
  async submitReview(cardId, rating) {
    try {
      const res = await fetch(`${API_BASE_URL}/study/review/`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ card_id: cardId, rating: Number(rating) })
      });
      if (!res.ok) throw new Error('Failed to submit review');
      return await res.json();
    } catch (err) {
      console.warn('API error during review submission:', err);
      return null;
    }
  },

  // LEETCODE-STYLE CODING PRACTICE APIS
  async getCodingProblems() {
    try {
      const res = await fetch(`${API_BASE_URL}/coding-problems/`, { credentials: 'include' });
      if (!res.ok) throw new Error('Failed to fetch coding problems');
      return await res.json();
    } catch (err) {
      console.warn('API error fetching coding problems:', err);
      return [];
    }
  },

  async executeCode(problemId, code, language = 'python') {
    try {
      const res = await fetch(`${API_BASE_URL}/code/execute/`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ problem_id: problemId, code, language })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Code execution failed');
      return data;
    } catch (err) {
      console.error('Execute code error:', err);
      throw err;
    }
  },

  // Fetch system analytics
  async getAnalytics() {
    try {
      const res = await fetch(`${API_BASE_URL}/analytics/`, { credentials: 'include' });
      if (!res.ok) throw new Error('Failed to fetch analytics');
      return await res.json();
    } catch (err) {
      console.warn('API error during analytics fetch:', err);
      return null;
    }
  },

  // AUTHENTICATION APIS
  async login(username, password) {
    const res = await fetch(`${API_BASE_URL}/auth/login/`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const data = await safeJson(res);
    if (!res.ok) throw new Error(data.error || data.detail || 'Login failed. Please check your credentials.');
    return data;
  },

  async register(username, password, email, is_admin = false) {
    const res = await fetch(`${API_BASE_URL}/auth/register/`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password, email, is_admin })
    });
    const data = await safeJson(res);
    if (!res.ok) throw new Error(data.error || data.detail || 'Registration failed');
    return data;
  },

  async logout() {
    await fetch(`${API_BASE_URL}/auth/logout/`, { 
      method: 'POST',
      credentials: 'include'
    });
  },

  async getCurrentUser() {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/user/`, { credentials: 'include' });
      if (!res.ok) return null;
      return await res.json();
    } catch (e) {
      return null;
    }
  },

  // Create new Deck (Admin Only)
  async createDeck(deckData) {
    const res = await fetch(`${API_BASE_URL}/decks/`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(deckData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || 'Authentication credentials were not provided. Please log in as admin.');
    return data;
  },

  // Create new Card (Admin Only)
  async createCard(cardData) {
    const res = await fetch(`${API_BASE_URL}/cards/`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cardData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || 'Authentication credentials were not provided. Please log in as admin.');
    return data;
  }
};
