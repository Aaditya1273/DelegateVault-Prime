import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const router = Router();
const prisma = new PrismaClient();

const createDelegationSchema = z.object({
  vaultAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
  vaultOwner: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
  delegate: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
  expiresAt: z.string().datetime(),
  zkProof: z.string().optional(),
  signature: z.string().optional(),
  nonce: z.string().optional(),
});

// GET /api/v1/delegations/:owner - Get delegations by owner
router.get('/:owner', async (req: Request, res: Response) => {
  try {
    const { owner } = req.params;
    
    const delegations = await prisma.delegation.findMany({
      where: {
        vaultOwner: owner.toLowerCase(),
        active: true,
      },
      include: {
        vault: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    
    res.json({ delegations });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to fetch delegations',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// POST /api/v1/delegations - Create delegation
router.post('/', async (req: Request, res: Response) => {
  try {
    const validatedData = createDelegationSchema.parse(req.body);
    
    // Find vault
    const vault = await prisma.vault.findUnique({
      where: { address: validatedData.vaultAddress.toLowerCase() },
    });
    
    if (!vault) {
      return res.status(404).json({ error: 'Vault not found' });
    }
    
    const delegation = await prisma.delegation.create({
      data: {
        vaultId: vault.id,
        vaultOwner: validatedData.vaultOwner.toLowerCase(),
        delegate: validatedData.delegate.toLowerCase(),
        expiresAt: new Date(validatedData.expiresAt),
        zkProof: validatedData.zkProof,
        signature: validatedData.signature,
        nonce: validatedData.nonce,
        active: true,
      },
    });
    
    res.status(201).json(delegation);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Validation error',
        details: error.errors,
      });
    }
    
    res.status(500).json({
      error: 'Failed to create delegation',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// DELETE /api/v1/delegations/:id - Revoke delegation
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const delegation = await prisma.delegation.update({
      where: { id },
      data: { active: false },
    });
    
    res.json({
      message: 'Delegation revoked',
      delegation,
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to revoke delegation',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

export default router;
