export const DELEGATION_MANAGER_ABI = [
  { type: "constructor", inputs: [], stateMutability: "nonpayable" },
  { type: "function", name: "owner", inputs: [], outputs: [{ type: "address" }], stateMutability: "view" },
  {
    type: "function",
    name: "transferOwnership",
    inputs: [{ name: "newOwner", type: "address" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "allowanceUntil",
    inputs: [
      { name: "vaultOwner", type: "address" },
      { name: "delegate", type: "address" },
    ],
    outputs: [{ type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "setDelegation",
    inputs: [
      { name: "vaultOwner", type: "address" },
      { name: "delegate", type: "address" },
      { name: "expiresAt", type: "uint256" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "revokeDelegation",
    inputs: [
      { name: "vaultOwner", type: "address" },
      { name: "delegate", type: "address" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "isDelegateActive",
    inputs: [
      { name: "vaultOwner", type: "address" },
      { name: "delegate", type: "address" },
    ],
    outputs: [{ type: "bool" }],
    stateMutability: "view",
  },
  {
    type: "event",
    name: "OwnershipTransferred",
    inputs: [
      { name: "previousOwner", type: "address", indexed: true },
      { name: "newOwner", type: "address", indexed: true },
    ],
  },
  {
    type: "event",
    name: "DelegationSet",
    inputs: [
      { name: "vaultOwner", type: "address", indexed: true },
      { name: "delegate", type: "address", indexed: true },
      { name: "expiresAt", type: "uint256", indexed: false },
    ],
  },
  {
    type: "event",
    name: "DelegationRevoked",
    inputs: [
      { name: "vaultOwner", type: "address", indexed: true },
      { name: "delegate", type: "address", indexed: true },
    ],
  },
] as const
