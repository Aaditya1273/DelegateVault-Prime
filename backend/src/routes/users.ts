import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// GET /api/v1/users/:address - Get user profile
router.get('/:address', async (req: Request, res: Response) => {
  try {
    const { address } = req.params;
    
    const user = await prisma.user.findUnique({
      where: { address: address.toLowerCase() },
      include: {
        circleMembers: {
          include: {
            circle: true,
          },
        },
      },
    });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    res.status(500).json({
      error: 'Failed to fetch user',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// POST /api/v1/users - Create user
router.post('/', async (req: Request, res: Response) => {
  try {
    const { address, username, email, farcasterFid } = req.body;
    
    if (!address || !/^0x[a-fA-F0-9]{40}$/.test(address)) {
      return res.status(400).json({ error: 'Invalid address' });
    }
    
    const user = await prisma.user.create({
      data: {
        address: address.toLowerCase(),
        username,
        email,
        farcasterFid,
      },
    });
    
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({
      error: 'Failed to create user',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// PUT /api/v1/users/:address - Update user
router.put('/:address', async (req: Request, res: Response) => {
  try {
    const { address } = req.params;
    const { username, email, nftBadges, streakDays, totalPoints } = req.body;
    
    const user = await prisma.user.update({
      where: { address: address.toLowerCase() },
      data: {
        ...(username !== undefined && { username }),
        ...(email !== undefined && { email }),
        ...(nftBadges !== undefined && { nftBadges }),
        ...(streakDays !== undefined && { streakDays }),
        ...(totalPoints !== undefined && { totalPoints }),
      },
    });
    
    res.json(user);
  } catch (error) {
    res.status(500).json({
      error: 'Failed to update user',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

export default router;
