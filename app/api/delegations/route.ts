import { NextResponse } from "next/server"
import { storage, type DelegationPolicy } from "@/lib/storage"

type Payload = { vaultOwner: string; delegate: string; expiresAt: number; sig?: string; nonce?: string }

function validate(body: any): body is Payload {
  return (
    body &&
    typeof body.vaultOwner === "string" &&
    typeof body.delegate === "string" &&
    typeof body.expiresAt === "number" &&
    body.expiresAt > 0
  )
}

export async function POST(req: Request) {
  const json = (await req.json().catch(() => null)) as Payload | null
  if (!validate(json)) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 })
  }
  // TODO (future): verify signature belongs to vaultOwner
  const policy: DelegationPolicy = {
    vaultOwner: json.vaultOwner,
    delegate: json.delegate,
    expiresAt: json.expiresAt,
    sig: json.sig,
    nonce: json.nonce,
  }
  await storage.upsertDelegation(policy)
  const list = await storage.listDelegationsByOwner(json.vaultOwner)
  return NextResponse.json({ ok: true, policies: list })
}
