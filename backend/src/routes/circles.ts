import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// GET /api/v1/circles - List all circles
router.get('/', async (_req: Request, res: Response) => {
  try {
    const circles = await prisma.circle.findMany({
      include: {
        members: {
          include: {
            user: true,
          },
        },
      },
      orderBy: { performanceAPY: 'desc' },
    });
    
    res.json({ circles });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to fetch circles',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// GET /api/v1/circles/:id - Get circle details
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const circle = await prisma.circle.findUnique({
      where: { id },
      include: {
        members: {
          include: {
            user: true,
            vault: true,
          },
        },
      },
    });
    
    if (!circle) {
      return res.status(404).json({ error: 'Circle not found' });
    }
    
    res.json(circle);
  } catch (error) {
    res.status(500).json({
      error: 'Failed to fetch circle',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// POST /api/v1/circles - Create circle
router.post('/', async (req: Request, res: Response) => {
  try {
    const { name, description, vaultAddress } = req.body;
    
    if (!name || !vaultAddress) {
      return res.status(400).json({ error: 'Name and vaultAddress required' });
    }
    
    // Find vault
    const vault = await prisma.vault.findUnique({
      where: { address: vaultAddress.toLowerCase() },
    });
    
    if (!vault) {
      return res.status(404).json({ error: 'Vault not found' });
    }
    
    const circle = await prisma.circle.create({
      data: {
        name,
        description,
        vaultId: vault.id,
      },
    });
    
    res.status(201).json(circle);
  } catch (error) {
    res.status(500).json({
      error: 'Failed to create circle',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

export default router;
