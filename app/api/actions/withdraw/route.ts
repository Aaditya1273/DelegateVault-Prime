import { NextResponse } from "next/server"

type Payload = { shares: string }

function validate(body: any): body is Payload {
  return body && typeof body.shares === "string"
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

  const call = {
    to: vaultAddress,
    value: "0",
    data: "0x", // Phase 4: encode ABI for withdraw(shares)
    method: "withdraw(uint256)",
    args: [json.shares],
  }

  return NextResponse.json({ ok: true, call })
}
