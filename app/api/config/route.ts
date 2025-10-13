import { NextResponse } from "next/server"

export async function GET() {
  const vaultAddress = process.env.NEXT_PUBLIC_DELEGATE_VAULT_ADDRESS || ""
  const chainId = Number(process.env.NEXT_PUBLIC_CHAIN_ID || 0)
  return NextResponse.json({ vaultAddress, chainId })
}
