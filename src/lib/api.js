export const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

/**
 * Helper pour faire des requêtes au backend
 * @param {string} endpoint - L'endpoint à appeler (ex: '/api/stripe/create-checkout-session')
 * @param {object} options - Options fetch (method, headers, body, etc.)
 * @returns {Promise} - Promesse avec la réponse
 */
export async function apiRequest(endpoint, options = {}) {
  const url = `${BACKEND_URL}${endpoint}`;
  
  const defaultHeaders = {
    'Content-Type': 'application/json',
  };
  
  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };
  
  try {
    const response = await fetch(url, config);
    
    // Si la réponse n'est pas ok, lever une erreur
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || `Erreur HTTP ${response.status}`);
    }
    
    // Essayer de parser le JSON
    const data = await response.json();
    return { data, error: null };
    
  } catch (error) {
    console.error(`Erreur API ${endpoint}:`, error);
    return { data: null, error: error.message };
  }
}

/**
 * Helpers spécifiques pour Stripe
 */
export const stripeAPI = {
  /**
   * Créer une session de paiement
   */
  createCheckoutSession: async (priceId, userId, userEmail) => {
    return apiRequest('/api/stripe/create-checkout-session', {
      method: 'POST',
      body: JSON.stringify({ priceId, userId, userEmail }),
    });
  },
  
  /**
   * Vérifier le statut d'un abonnement
   */
  getSubscriptionStatus: async (userId) => {
    return apiRequest(`/api/stripe/subscription-status/${userId}`);
  },
  
  /**
   * Vérifier une session après paiement
   */
  verifySession: async (sessionId) => {
    return apiRequest(`/api/stripe/verify-session/${sessionId}`);
  },
  
  /**
   * Créer une session du portail client (pour gérer l'abonnement)
   */
  createPortalSession: async (userId) => {
    return apiRequest('/api/stripe/create-portal-session', {
      method: 'POST',
      body: JSON.stringify({ userId }),
    });
  },
};

/**
 * Helper pour gérer les erreurs API de manière cohérente
 */
export function handleAPIError(error, defaultMessage = 'Une erreur est survenue') {
  if (typeof error === 'string') {
    return error;
  }
  
  if (error?.message) {
    return error.message;
  }
  
  return defaultMessage;
}

// Export par défaut pour une utilisation simple
export default {
  BACKEND_URL,
  apiRequest,
  stripeAPI,
  handleAPIError,
};