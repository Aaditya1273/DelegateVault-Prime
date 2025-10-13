import { NextResponse } from "next/server"
import { storage } from "@/lib/storage"

export async function GET(_: Request, { params }: { params: { address: string } }) {
  const { address } = params
  const vault = await storage.getVault(address)
  if (vault) {
    const { chainId, name, feeBps = null, totalAssets = null, totalShares = null } = vault
    return NextResponse.json({
      address,
      chainId,
      name,
      feeBps,
      totalAssets,
      totalShares,
    })
  }
  // not seeded yet: return placeholder consistent with previous behavior
  const chainId = Number(process.env.NEXT_PUBLIC_CHAIN_ID || 0)
  return NextResponse.json({
    address,
    chainId,
    name: "DelegateVault",
    feeBps: null as number | null,
    totalAssets: null as number | null,
    totalShares: null as number | null,
  })
}
