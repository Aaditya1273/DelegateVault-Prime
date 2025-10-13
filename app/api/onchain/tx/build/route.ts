import type { NextRequest } from "next/server"
import { toChecksum } from "@/lib/viem"
import { erc4626Abi } from "@/lib/abi/erc4626"
import { encodeFunctionData } from "viem"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    // Expected body: { action: "deposit"|"withdraw", vault: "0x..", amount: string, receiver?: "0x..", owner?: "0x.." }
    const { action, vault, amount, receiver, owner } = body || {}
    if (!action || !vault || !amount) throw new Error("Missing required fields")

    const to = toChecksum(vault)
    const amt = BigInt(amount)

    let data: `0x${string}`
    if (action === "deposit") {
      const rec = receiver ? toChecksum(receiver) : to // default: self
      data = encodeFunctionData({
        abi: erc4626Abi as any,
        functionName: "deposit",
        args: [amt, rec],
      })
    } else if (action === "withdraw") {
      const rec = receiver ? toChecksum(receiver) : to
      const own = owner ? toChecksum(owner) : rec
      data = encodeFunctionData({
        abi: erc4626Abi as any,
        functionName: "withdraw",
        args: [amt, rec, own],
      })
    } else {
      throw new Error("Unsupported action")
    }

    // Returns a generic EVM tx payload; the wallet should set gas as needed.
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
