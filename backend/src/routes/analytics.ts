import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// GET /api/v1/analytics/metrics - Get overall metrics
router.get('/metrics', async (_req: Request, res: Response) => {
  try {
    const [vaults, users, totalPositions] = await Promise.all([
      prisma.vault.findMany(),
      prisma.user.count(),
      prisma.position.count(),
    ]);
    
    const totalTVL = vaults.reduce((sum: number, v: any) => sum + Number(v.tvl || 0), 0);
    const avgAPY = vaults.length > 0
      ? vaults.reduce((sum: number, v: any) => sum + Number(v.performanceAPY || 0), 0) / vaults.length
      : 0;
    
    // Active users (updated in last 7 days)
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const activeUsers = await prisma.user.count({
      where: { updatedAt: { gte: sevenDaysAgo } },
    });
    
    res.json({
      totalTVL,
      totalVaults: vaults.length,
      activeUsers,
      totalUsers: users,
      avgAPY: avgAPY.toFixed(2),
      totalPositions,
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to fetch metrics',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// GET /api/v1/analytics/user-growth - Get user growth data
router.get('/user-growth', async (req: Request, res: Response) => {
  try {
    const { days = '30' } = req.query;
    const numDays = parseInt(days as string);
    
    const data = [];
    const now = new Date();
    
    for (let i = numDays; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const count = await prisma.user.count({
        where: { createdAt: { lte: date } },
      });
      
      data.push({
        date: date.toISOString().split('T')[0],
        users: count,
      });
    }
    
    res.json(data);
  } catch (error) {
    res.status(500).json({
      error: 'Failed to fetch user growth',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

export default router;
