export function shortAddress(addr?: string, size = 4) {
  if (!addr || addr.length < size * 2 + 2) return addr || "—"
  return `${addr.slice(0, size + 2)}…${addr.slice(-size)}`
}
