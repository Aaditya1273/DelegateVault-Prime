import type { NextRequest } from "next/server"
import { getPublicClient, toChecksum } from "@/lib/viem"
import { erc4626Abi } from "@/lib/abi/erc4626"
import { parseEventLogs } from "viem"

export async function GET(req: NextRequest, { params }: { params: { address: string } }) {
  try {
    const url = new URL(req.url)
    const fromBlockParam = url.searchParams.get("fromBlock")
    const fromBlock = fromBlockParam ? BigInt(fromBlockParam) : undefined

    const client = getPublicClient()
    const vault = toChecksum(params.address)

    const logs = await client.getLogs({
      address: vault,
      fromBlock, // if undefined, node decides default lookback
      toBlock: "latest",
    })

    const parsed = parseEventLogs({
      abi: erc4626Abi as any,
      logs,
      strict: false,
    })

    const simplified = parsed
      .filter((p) => p.eventName === "Deposit" || p.eventName === "Withdraw")
      .map((p, i) => {
        const args: any = p.args || {}
        const base = {
          event: p.eventName,
          blockNumber: p.blockNumber?.toString() ?? "",
          txHash: p.transactionHash,
          logIndex: p.logIndex ?? i,
        }
        if (p.eventName === "Deposit") {
          return {
            ...base,
            caller: args.caller,
            party: args.owner,
            assets: args.assets?.toString?.() ?? "",
            shares: args.shares?.toString?.() ?? "",
          }
        } else {
          return {
            ...base,
            caller: args.caller,
            party: args.receiver,
            assets: args.assets?.toString?.() ?? "",
            shares: args.shares?.toString?.() ?? "",
          }
        }
      })

    return new Response(JSON.stringify(simplified), { headers: { "content-type": "application/json" } })
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err?.message || "failed" }), { status: 400 })
  }
}
