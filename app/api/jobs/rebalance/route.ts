import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const header = request.headers.get("x-cron-secret")
  if (!header || header !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // TODO: call strategy logic, simulate, or enqueue a task
  // For now, return a stub payload.
  return NextResponse.json({
    ok: true,
    task: "rebalance",
    at: new Date().toISOString(),
  })
}
