type Log = {
  address: string
  topics: string[]
  data: string
  blockNumber: number
  transactionHash: string
  transactionIndex: number
  logIndex: number
}

export function makeLogKey(log: Log) {
  return `${log.blockNumber}:${log.transactionIndex}:${log.logIndex}`
}

export function decodeStub(_log: Log) {
  // Replace with real decoding using ABI (viem or custom).
  return { name: "Unknown", args: {} }
}
