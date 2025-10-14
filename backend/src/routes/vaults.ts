import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const router = Router();
const prisma = new PrismaClient();

// Validation schemas
const createVaultSchema = z.object({
  address: z.string().regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid Ethereum address'),
  chainId: z.number().int().positive(),
  name: z.string().min(1).max(100),
  assetSymbol: z.string().min(1).max(20),
  underlying: z.string().regex(/^0x[a-fA-F0-9]{40}$/).optional(),
  owner: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
});

// GET /api/v1/vaults - List all vaults
router.get('/', async (req: Request, res: Response) => {
  try {
    const { page = '1', limit = '20', chainId } = req.query;
    
    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
    const take = parseInt(limit as string);
    
    const where = chainId ? { chainId: parseInt(chainId as string) } : {};
    
    const [vaults, total] = await Promise.all([
      prisma.vault.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.vault.count({ where }),
    ]);
    
    res.json({
      items: vaults,
      pagination: {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        total,
        pages: Math.ceil(total / take),
      },
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to fetch vaults',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// GET /api/v1/vaults/:address - Get vault by address
router.get('/:address', async (req: Request, res: Response) => {
  try {
    const { address } = req.params;
    
    const vault = await prisma.vault.findUnique({
      where: { address: address.toLowerCase() },
      include: {
        positions: true,
        delegations: true,
        aiStrategies: true,
      },
    });
    
    if (!vault) {
      return res.status(404).json({
        error: 'Vault not found',
        address,
      });
    }
    
    return res.json(vault);
  } catch (error) {
    return res.status(500).json({
      error: 'Failed to fetch vault',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// POST /api/v1/vaults - Create new vault
router.post('/', async (req: Request, res: Response) => {
  try {
    const validatedData = createVaultSchema.parse(req.body);
    
    const vault = await prisma.vault.create({
      data: {
        ...validatedData,
        address: validatedData.address.toLowerCase(),
        owner: validatedData.owner.toLowerCase(),
        underlying: validatedData.underlying?.toLowerCase(),
      } as any,
    });
    
    return res.status(201).json(vault);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Validation error',
        details: error.errors,
      });
    }
    
    return res.status(500).json({
      error: 'Failed to create vault',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// PUT /api/v1/vaults/:address - Update vault
router.put('/:address', async (req: Request, res: Response) => {
  try {
    const { address } = req.params;
    const { tvl, totalShares, totalAssets, feeBps, paused } = req.body;
    
    const vault = await prisma.vault.update({
      where: { address: address.toLowerCase() },
      data: {
        ...(tvl !== undefined && { tvl }),
        ...(totalShares !== undefined && { totalShares }),
        ...(totalAssets !== undefined && { totalAssets }),
        ...(feeBps !== undefined && { feeBps }),
        ...(paused !== undefined && { paused }),
      },
    });
    
    res.json(vault);
  } catch (error) {
    res.status(500).json({
      error: 'Failed to update vault',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// GET /api/v1/vaults/:address/positions - Get vault positions
router.get('/:address/positions', async (req: Request, res: Response) => {
  try {
    const { address } = req.params;
    
    const vault = await prisma.vault.findUnique({
      where: { address: address.toLowerCase() },
    });
    
    if (!vault) {
      return res.status(404).json({ error: 'Vault not found' });
    }
    
    const positions = await prisma.position.findMany({
      where: { vaultId: vault.id },
      orderBy: { assets: 'desc' },
    });
    
    return res.json({ positions });
  } catch (error) {
    return res.status(500).json({
      error: 'Failed to fetch positions',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

export default router;
