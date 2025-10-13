# DelegateVault Prime

> Social DeFi vaults with AI orchestration on Monad Testnet

[![Next.js](https://img.shields.io/badge/Next.js-15.2.4-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Monad](https://img.shields.io/badge/Monad-Testnet-purple?style=flat-square)](https://monad.xyz/)

## Overview

DelegateVault Prime is a decentralized vault management platform built on the Monad Testnet. It enables users to create and manage vaults with delegated control, supporting both ETH and ERC20 tokens. The platform features a modern web interface for seamless interaction with on-chain vault contracts.

### Key Features

- **Dual-Mode Vaults** - Support for both native ETH and ERC20 tokens
- **Delegation System** - Time-based delegation with expiration controls
- **Fee Management** - Configurable withdrawal fees (0-10%)
- **Security** - Pausable operations and reentrancy protection
- **Real-time Data** - Live vault metrics and position tracking
- **Modern UI** - Built with Next.js 15, React 19, and TailwindCSS

## Tech Stack

### Frontend
- **Framework**: Next.js 15.2.4 with App Router
- **Language**: TypeScript 5
- **Styling**: TailwindCSS 4.1.9 + shadcn/ui
- **State**: SWR for data fetching
- **Icons**: Lucide React

### Blockchain
- **Chain**: Monad Testnet (Chain ID: 10143)
- **Library**: Viem (latest)
- **Contracts**: Solidity ^0.8.24

## Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm
- MetaMask or compatible Web3 wallet

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd DelegateVault-Prime
```

2. Install dependencies:
```bash
pnpm install
```

3. Create environment file:
```bash
# Create .env.local file
NEXT_PUBLIC_DELEGATE_VAULT_ADDRESS=0x...
NEXT_PUBLIC_CHAIN_ID=10143
```

4. Run development server:
```bash
pnpm dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
pnpm build
pnpm start
```

## Smart Contracts

### DelegateVault.sol

Main vault contract supporting deposits, withdrawals, and fee management.

**Key Functions:**
- `depositETH()` - Deposit native ETH into the vault
- `depositToken(uint256 amount)` - Deposit ERC20 tokens
- `withdraw(uint256 shares)` - Withdraw assets (with fee deduction)
- `pause() / unpause()` - Emergency controls (owner only)
- `setFeeBps(uint16 newFeeBps)` - Update withdrawal fee (0-1000 bps)

### DelegationManager.sol

Manages time-based delegation permissions for vault operations.

**Key Functions:**
- `setDelegation(address vaultOwner, address delegate, uint256 expiresAt)`
- `revokeDelegation(address vaultOwner, address delegate)`
- `isDelegateActive(address vaultOwner, address delegate)`

### VaultFactory.sol

Factory contract for deploying new DelegateVault instances.

**Key Functions:**
- `deployVault(address underlying)` - Deploy a new vault
- `allVaultsLength()` - Get total number of deployed vaults

## Project Structure

```
├── app/                    # Next.js app router
│   ├── api/               # API routes
│   ├── vaults/            # Vault browsing pages
│   ├── onchain/           # Direct blockchain interaction
│   └── settings/          # Configuration
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── vault/            # Vault-specific components
│   └── onchain/          # Blockchain components
├── contracts/            # Solidity smart contracts
├── lib/                  # Utilities and libraries
│   ├── abi/             # Contract ABIs
│   ├── chain/           # Chain configurations
│   └── *.ts             # Helper utilities
├── hooks/               # Custom React hooks
└── scripts/             # Deployment scripts
```

## API Endpoints

- `GET /api/health` - Service health check
- `GET /api/config` - Chain and vault configuration
- `GET /api/vaults` - List all vaults
- `GET /api/vaults/[address]` - Get vault details
- `GET /api/vaults/[address]/positions` - Get user positions
- `GET /api/onchain/vaults/[address]/metadata` - On-chain metadata
- `GET /api/onchain/vaults/[address]/events` - Contract events
- `POST /api/actions/deposit` - Execute deposit
- `POST /api/actions/withdraw` - Execute withdrawal

## Monad Testnet Configuration

- **Chain ID**: 10143
- **RPC URL**: https://testnet-rpc.monad.xyz
- **Explorer**: https://testnet.monadexplorer.com
- **Native Currency**: MON

The application will automatically prompt you to add/switch to Monad Testnet when connecting your wallet.

## Usage

### Browsing Vaults

Navigate to `/vaults` to see all available vaults. Click on any vault to view details and interact.

### Depositing Assets

1. Connect your wallet
2. Select a vault
3. Choose deposit amount
4. Approve token (if ERC20)
5. Confirm deposit transaction

### Withdrawing Assets

1. Navigate to vault detail page
2. Enter shares to withdraw
3. Confirm withdrawal (fees will be deducted)

### On-Chain Interactions

Visit `/onchain` for advanced features:
- Build custom transactions
- View contract events
- Query vault metadata directly from chain

## Development

### Adding New Vaults

Vaults are stored in-memory by default. To add a vault:

1. Set environment variable: `NEXT_PUBLIC_DELEGATE_VAULT_ADDRESS`
2. Or use the `/onchain` interface to add vaults locally

### Extending Storage

The current implementation uses in-memory storage (`lib/storage.ts`). For production:

1. Implement `StorageAdapter` interface
2. Replace `InMemoryStorage` with your database adapter (PostgreSQL, MongoDB, etc.)

## Security Considerations

**Important**: This is an MVP/prototype. Before production deployment:

- [ ] Replace minimal interfaces with OpenZeppelin contracts
- [ ] Implement persistent database storage
- [ ] Add signature validation for delegations
- [ ] Conduct professional security audits
- [ ] Enable proper error handling
- [ ] Add comprehensive testing
- [ ] Review and fix TypeScript/ESLint errors

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Support

For issues and questions:
- Open an issue on GitHub
- Check existing documentation
- Review smart contract comments

---

**Built for Monad Testnet** | **Powered by Next.js & Viem**