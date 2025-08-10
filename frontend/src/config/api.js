// API Configuration
const API_CONFIG = {
  // Base URL for the deployed backend
  BASE_URL: 'https://jovac-project-2oqb.onrender.com',
  API_URL: 'https://jovac-project-2oqb.onrender.com/api',
  
  // Endpoints
  ENDPOINTS: {
    AUTH: '/auth',
    TESTS: '/tests',
    USERS: '/users',
    RESULTS: '/results',
    PROFILE: '/profile'
  },
  
  // Helper function to get full endpoint URL
  getEndpoint: (endpoint) => `${API_CONFIG.API_URL}${endpoint}`,
  
  // Helper function to get asset URL (for images, uploads, etc.)
  getAssetUrl: (path) => `${API_CONFIG.BASE_URL}/${path}`
};

export default API_CONFIG;
