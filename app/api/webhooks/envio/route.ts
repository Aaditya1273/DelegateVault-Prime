import { NextResponse } from "next/server"
import { makeLogKey } from "@/lib/indexer"
import { storage, type VaultEvent } from "@/lib/storage"

export async function POST(req: Request) {
  const body = await req.json().catch(() => null)
  if (!body || !Array.isArray(body.logs)) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 })
  }

  const processed: { key: string; stored: boolean }[] = []
  for (const log of body.logs) {
    const key = makeLogKey(log)
    const ev: VaultEvent = {
      id: key,
      address: log.address,
      blockNumber: log.blockNumber,
      transactionHash: log.transactionHash,
      transactionIndex: log.transactionIndex,
      logIndex: log.logIndex,
      topics: log.topics,
      data: log.data,
    }
    const stored = await storage.addEvent(ev)
    processed.push({ key, stored })
  }

  return NextResponse.json({ ok: true, processed })
}
