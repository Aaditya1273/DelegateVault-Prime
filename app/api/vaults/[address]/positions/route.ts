import { NextResponse } from "next/server"
import { storage } from "@/lib/storage"

export async function GET(_: Request, { params }: { params: { address: string } }) {
  const { address } = params
  const positions = await storage.listPositions(address)
  return NextResponse.json({ address, positions })
}
