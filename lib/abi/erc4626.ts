// Minimal ERC-4626 ABI for vault metadata and tx building
export const erc4626Abi = [
  { type: "function", name: "asset", stateMutability: "view", inputs: [], outputs: [{ type: "address" }] },
  { type: "function", name: "totalAssets", stateMutability: "view", inputs: [], outputs: [{ type: "uint256" }] },
  { type: "function", name: "totalSupply", stateMutability: "view", inputs: [], outputs: [{ type: "uint256" }] },
  {
    type: "function",
    name: "convertToShares",
    stateMutability: "view",
    inputs: [{ type: "uint256" }],
    outputs: [{ type: "uint256" }],
  },
  {
    type: "function",
    name: "convertToAssets",
    stateMutability: "view",
    inputs: [{ type: "uint256" }],
    outputs: [{ type: "uint256" }],
  },
  {
    type: "function",
    name: "deposit",
    stateMutability: "nonpayable",
    inputs: [{ type: "uint256" }, { type: "address" }],
    outputs: [{ type: "uint256" }],
  },
  {
    type: "function",
    name: "withdraw",
    stateMutability: "nonpayable",
    inputs: [{ type: "uint256" }, { type: "address" }, { type: "address" }],
    outputs: [{ type: "uint256" }],
  },
  // Standard events
  {
    type: "event",
    name: "Deposit",
    inputs: [
      { indexed: true, name: "caller", type: "address" },
      { indexed: true, name: "owner", type: "address" },
      { indexed: false, name: "assets", type: "uint256" },
      { indexed: false, name: "shares", type: "uint256" },
    ],
  },
  {
    type: "event",
    name: "Withdraw",
    inputs: [
      { indexed: true, name: "caller", type: "address" },
      { indexed: true, name: "receiver", type: "address" },
      { indexed: false, name: "assets", type: "uint256" },
      { indexed: false, name: "shares", type: "uint256" },
    ],
  },
] as const
