import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// Create axios instance
const api = axios.create({
  baseURL: `${API_URL}/api/v1`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// API Service
export const apiService = {
  // Vaults
  vaults: {
    getAll: async () => {
      const response = await api.get('/vaults');
      return response.data;
    },
    getById: async (id: string) => {
      const response = await api.get(`/vaults/${id}`);
      return response.data;
    },
    create: async (data: any) => {
      const response = await api.post('/vaults', data);
      return response.data;
    },
    deposit: async (id: string, amount: number) => {
      const response = await api.post(`/vaults/${id}/deposit`, { amount });
      return response.data;
    },
    withdraw: async (id: string, amount: number) => {
      const response = await api.post(`/vaults/${id}/withdraw`, { amount });
      return response.data;
    },
    getPerformance: async (id: string) => {
      const response = await api.get(`/vaults/${id}/performance`);
      return response.data;
    },
  },

  // Users
  users: {
    getProfile: async (address: string) => {
      const response = await api.get(`/users/${address}`);
      return response.data;
    },
    updateProfile: async (address: string, data: any) => {
      const response = await api.put(`/users/${address}`, data);
      return response.data;
    },
    getStats: async (address: string) => {
      const response = await api.get(`/users/${address}/stats`);
      return response.data;
    },
    getVaults: async (address: string) => {
      const response = await api.get(`/users/${address}/vaults`);
      return response.data;
    },
  },

  // Analytics
  analytics: {
    getPortfolio: async (address: string) => {
      const response = await api.get(`/analytics/portfolio/${address}`);
      return response.data;
    },
    getPerformance: async (address: string, days: number = 30) => {
      const response = await api.get(`/analytics/performance/${address}?days=${days}`);
      return response.data;
    },
    getTrending: async () => {
      const response = await api.get('/analytics/trending');
      return response.data;
    },
  },

  // AI
  ai: {
    predictAPY: async (vaultData: any) => {
      const response = await api.post('/ai/predict-apy', vaultData);
      return response.data;
    },
    analyzeRisk: async (vaultData: any) => {
      const response = await api.post('/ai/analyze-risk', vaultData);
      return response.data;
    },
    generateStrategy: async (data: any) => {
      const response = await api.post('/ai/generate-strategy', data);
      return response.data;
    },
    shouldRebalance: async (data: any) => {
      const response = await api.post('/ai/should-rebalance', data);
      return response.data;
    },
  },

  // Social
  social: {
    getAchievements: async (address: string) => {
      const response = await api.get(`/social/achievements/${address}`);
      return response.data;
    },
    unlockAchievement: async (address: string, achievementId: number) => {
      const response = await api.post(`/social/achievements/${address}/unlock`, { achievementId });
      return response.data;
    },
    getLeaderboard: async () => {
      const response = await api.get('/social/leaderboard');
      return response.data;
    },
    sharePerformance: async (address: string, data: any) => {
      const response = await api.post(`/social/share/${address}`, data);
      return response.data;
    },
  },

  // Circles
  circles: {
    getAll: async () => {
      const response = await api.get('/circles');
      return response.data;
    },
    getById: async (id: string) => {
      const response = await api.get(`/circles/${id}`);
      return response.data;
    },
    create: async (data: any) => {
      const response = await api.post('/circles', data);
      return response.data;
    },
    join: async (id: string, address: string) => {
      const response = await api.post(`/circles/${id}/join`, { address });
      return response.data;
    },
  },

  // Circle Clash
  circleClash: {
    getSeason: async () => {
      const response = await api.get('/social-advanced/circle-clash/season');
      return response.data;
    },
    getRankings: async (limit: number = 100) => {
      const response = await api.get(`/social-advanced/circle-clash/rankings?limit=${limit}`);
      return response.data;
    },
    compare: async (id1: string, id2: string) => {
      const response = await api.get(`/social-advanced/circle-clash/compare/${id1}/${id2}`);
      return response.data;
    },
    createChallenge: async (data: any) => {
      const response = await api.post('/social-advanced/circle-clash/challenge', data);
      return response.data;
    },
    getLeaderboard: async () => {
      const response = await api.get('/social-advanced/circle-clash/leaderboard');
      return response.data;
    },
  },

  // Emoji Voting
  voting: {
    create: async (data: any) => {
      const response = await api.post('/social-advanced/voting/create', data);
      return response.data;
    },
    vote: async (proposalId: string, emoji: string, userId: string) => {
      const response = await api.post('/social-advanced/voting/vote', { proposalId, emoji, userId });
      return response.data;
    },
    getProposal: async (id: string) => {
      const response = await api.get(`/social-advanced/voting/proposal/${id}`);
      return response.data;
    },
    getActive: async (circleId: string) => {
      const response = await api.get(`/social-advanced/voting/active/${circleId}`);
      return response.data;
    },
    getResults: async (id: string) => {
      const response = await api.get(`/social-advanced/voting/results/${id}`);
      return response.data;
    },
    getTrending: async () => {
      const response = await api.get('/social-advanced/voting/trending');
      return response.data;
    },
    execute: async (id: string) => {
      const response = await api.post(`/social-advanced/voting/execute/${id}`);
      return response.data;
    },
  },

  // Envio (Real-time data)
  envio: {
    getPrice: async (tokenAddress: string) => {
      const response = await api.get(`/envio/price/${tokenAddress}`);
      return response.data;
    },
    getVaultEvents: async (vaultAddress: string, limit: number = 100) => {
      const response = await api.get(`/envio/vault-events/${vaultAddress}?limit=${limit}`);
      return response.data;
    },
    getHistorical: async (vaultAddress: string, days: number = 30) => {
      const response = await api.get(`/envio/historical/${vaultAddress}?days=${days}`);
      return response.data;
    },
    getTopVaults: async (limit: number = 10) => {
      const response = await api.get(`/envio/top-vaults?limit=${limit}`);
      return response.data;
    },
  },

  // Monad
  monad: {
    getNetwork: async () => {
      const response = await api.get('/monad/network');
      return response.data;
    },
    getStats: async () => {
      const response = await api.get('/monad/stats');
      return response.data;
    },
    getGas: async () => {
      const response = await api.get('/monad/gas');
      return response.data;
    },
    getBalance: async (address: string) => {
      const response = await api.get(`/monad/balance/${address}`);
      return response.data;
    },
  },
};

export default apiService;
