import type { NextRequest } from "next/server"
import { getPublicClient, toChecksum } from "@/lib/viem"
import { erc4626Abi } from "@/lib/abi/erc4626"
import { erc20Abi } from "@/lib/abi/erc20"

export async function GET(_req: NextRequest, { params }: { params: { address: string } }) {
  try {
    const client = getPublicClient()
    const vault = toChecksum(params.address)

    const [asset, totalAssets, totalSupply] = await Promise.all([
      client.readContract({ address: vault, abi: erc4626Abi as any, functionName: "asset" }) as Promise<`0x${string}`>,
      client.readContract({ address: vault, abi: erc4626Abi as any, functionName: "totalAssets" }) as Promise<bigint>,
      client.readContract({ address: vault, abi: erc4626Abi as any, functionName: "totalSupply" }) as Promise<bigint>,
    ])

    const [symbol, decimals] = await Promise.all([
      client.readContract({ address: asset, abi: erc20Abi as any, functionName: "symbol" }) as Promise<string>,
      client.readContract({ address: asset, abi: erc20Abi as any, functionName: "decimals" }) as Promise<number>,
    ])

    const body = {
      vault,
      asset,
      assetSymbol: symbol,
      assetDecimals: decimals,
      totalAssets: totalAssets.toString(),
      totalSupply: totalSupply.toString(),
    }
    return new Response(JSON.stringify(body), { headers: { "content-type": "application/json" } })
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err?.message || "failed" }), { status: 400 })
  }
}
