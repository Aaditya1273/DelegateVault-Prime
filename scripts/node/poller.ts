// Node.js ES module script
async function main() {
  console.log("[v0] Poller starting")
  // In Phase 3, add RPC client (viem) and push logs to /api/webhooks/envio
  console.log("[v0] No-op poller. Configure RPC_URL and implement event fetch.")
}

main().catch((err) => {
  console.error("[v0] Poller error:", err)
  process.exit(1)
})
