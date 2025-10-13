import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json({
    status: "ok",
    service: "delegatevault-prime",
    time: new Date().toISOString(),
  })
}
