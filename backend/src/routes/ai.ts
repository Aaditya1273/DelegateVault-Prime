import { Router, Request, Response } from 'express';
import { aiService } from '../services/ai.service';

const router = Router();

// GET /api/v1/ai/health - Check AI service health
router.get('/health', async (_req: Request, res: Response) => {
  try {
    const health = await aiService.healthCheck();
    return res.json(health);
  } catch (error) {
    return res.status(503).json({
      error: 'AI service unavailable',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// POST /api/v1/ai/predict-apy - Predict APY for vault
router.post('/predict-apy', async (req: Request, res: Response) => {
  try {
    const { address, tvl, current_apy, asset_symbol } = req.body;
    
    if (!address) {
      return res.status(400).json({ error: 'Vault address required' });
    }
    
    const prediction = await aiService.predictAPY({
      address,
      tvl,
      current_apy,
      asset_symbol,
    });
    
    return res.json(prediction);
  } catch (error) {
    return res.status(500).json({
      error: 'Failed to predict APY',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// POST /api/v1/ai/analyze-risk - Analyze vault risk
router.post('/analyze-risk', async (req: Request, res: Response) => {
  try {
    const { address, tvl, current_apy } = req.body;
    
    if (!address) {
      return res.status(400).json({ error: 'Vault address required' });
    }
    
    const analysis = await aiService.analyzeRisk({
      address,
      tvl,
      current_apy,
    });
    
    return res.json(analysis);
  } catch (error) {
    return res.status(500).json({
      error: 'Failed to analyze risk',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// POST /api/v1/ai/generate-strategy - Generate investment strategy
router.post('/generate-strategy', async (req: Request, res: Response) => {
  try {
    const { vault_data, user_preferences } = req.body;
    
    if (!vault_data?.address) {
      return res.status(400).json({ error: 'Vault data required' });
    }
    
    const strategy = await aiService.generateStrategy(vault_data, user_preferences || {});
    
    return res.json(strategy);
  } catch (error) {
    return res.status(500).json({
      error: 'Failed to generate strategy',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// POST /api/v1/ai/should-rebalance - Check if rebalancing needed
router.post('/should-rebalance', async (req: Request, res: Response) => {
  try {
    const { vault_data, user_preferences } = req.body;
    
    if (!vault_data?.address) {
      return res.status(400).json({ error: 'Vault data required' });
    }
    
    const result = await aiService.shouldRebalance(vault_data, user_preferences || {});
    
    return res.json(result);
  } catch (error) {
    return res.status(500).json({
      error: 'Failed to check rebalance status',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

export default router;
