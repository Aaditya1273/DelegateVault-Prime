import type { NextRequest } from "next/server"
import { toChecksum } from "@/lib/viem"
import { erc20Abi } from "@/lib/abi/erc20"
import { encodeFunctionData } from "viem"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    // Expected body: { token: "0x..", spender: "0x..", amount: string }
    const { token, spender, amount } = body || {}
    if (!token || !spender || !amount) throw new Error("Missing required fields")

    const to = toChecksum(token)
    const sp = toChecksum(spender)
    const amt = BigInt(amount)

    const data = encodeFunctionData({
      abi: erc20Abi as any,
      functionName: "approve",
      args: [sp, amt],
    })

    return new Response(
      JSON.stringify({
        chainId: 10143,
        to,
        data,
        value: "0x0",
      }),
      { headers: { "content-type": "application/json" } },
    )
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err?.message || "failed" }), { status: 400 })
  }
}
