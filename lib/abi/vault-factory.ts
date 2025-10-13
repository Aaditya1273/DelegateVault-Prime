export const VAULT_FACTORY_ABI = [
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
    name: "deployVault",
    inputs: [{ name: "underlying", type: "address" }],
    outputs: [{ name: "vault", type: "address" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "allVaults",
    inputs: [{ name: "", type: "uint256" }],
    outputs: [{ type: "address" }],
    stateMutability: "view",
  },
  { type: "function", name: "allVaultsLength", inputs: [], outputs: [{ type: "uint256" }], stateMutability: "view" },
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
    name: "VaultDeployed",
    inputs: [
      { name: "vault", type: "address", indexed: true },
      { name: "creator", type: "address", indexed: true },
      { name: "underlying", type: "address", indexed: true },
    ],
  },
] as const
