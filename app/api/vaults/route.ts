import { NextResponse } from "next/server"
import { storage, seedVaultFromEnv } from "@/lib/storage"

export async function GET() {
  await seedVaultFromEnv()
  const items = await storage.listVaults()
  return NextResponse.json({ items })
}
