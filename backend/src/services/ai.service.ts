import axios from 'axios';
import { config } from '../config';

export class AIService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = config.aiService.url;
  }

  async predictAPY(vaultData: {
    address: string;
    tvl?: number;
    current_apy?: number;
    asset_symbol?: string;
  }) {
    try {
      const response = await axios.post(`${this.baseUrl}/api/ai/predict-apy`, vaultData);
      return response.data;
    } catch (error) {
      console.error('AI Service - Predict APY error:', error);
      throw error;
    }
  }

  async analyzeRisk(vaultData: {
    address: string;
    tvl?: number;
    current_apy?: number;
  }) {
    try {
      const response = await axios.post(`${this.baseUrl}/api/ai/analyze-risk`, vaultData);
      return response.data;
    } catch (error) {
      console.error('AI Service - Analyze Risk error:', error);
      throw error;
    }
  }

  async generateStrategy(
    vaultData: {
      address: string;
      tvl?: number;
      current_apy?: number;
    },
    userPreferences: {
      risk_tolerance?: string;
      auto_rebalance?: boolean;
      max_slippage?: number;
    }
  ) {
    try {
      const response = await axios.post(`${this.baseUrl}/api/ai/generate-strategy`, {
        vault_data: vaultData,
        user_preferences: userPreferences,
      });
      return response.data;
    } catch (error) {
      console.error('AI Service - Generate Strategy error:', error);
      throw error;
    }
  }

  async shouldRebalance(
    vaultData: {
      address: string;
      tvl?: number;
      current_apy?: number;
    },
    userPreferences: {
      risk_tolerance?: string;
      auto_rebalance?: boolean;
    }
  ) {
    try {
      const response = await axios.post(`${this.baseUrl}/api/ai/should-rebalance`, {
        vault_data: vaultData,
        user_preferences: userPreferences,
      });
      return response.data;
    } catch (error) {
      console.error('AI Service - Should Rebalance error:', error);
      throw error;
    }
  }

  async healthCheck() {
    try {
      const response = await axios.get(`${this.baseUrl}/health`);
      return response.data;
    } catch (error) {
      console.error('AI Service - Health Check error:', error);
      return { status: 'error', message: 'AI service unavailable' };
    }
  }
}

export const aiService = new AIService();
