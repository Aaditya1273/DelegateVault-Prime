import { NextResponse } from "next/server"

// This does not hold keys or send tx; it returns method + params for the client.
type Payload = { amount: string; assetMode: "ETH" | "ERC20" }

function validate(body: any): body is Payload {
  return body && typeof body.amount === "string" && (body.assetMode === "ETH" || body.assetMode === "ERC20")
}

export async function POST(req: Request) {
  const json = await req.json().catch(() => null)
  if (!validate(json)) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 })
  }

  const vaultAddress = process.env.NEXT_PUBLIC_DELEGATE_VAULT_ADDRESS
  if (!vaultAddress) {
    return NextResponse.json({ error: "Vault address not configured" }, { status: 500 })
  }

  const call =
    json.assetMode === "ETH"
      ? { to: vaultAddress, value: json.amount, data: "0x", method: "depositETH()", args: [] as any[] }
      : {
          to: vaultAddress,
          value: "0",
          data: "0x", // Phase 4: encode ABI for depositToken(amount)
          method: "depositToken(uint256)",
          args: [json.amount],
        }

  return NextResponse.json({ ok: true, call })
}
