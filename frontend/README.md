# 🔧 ForgeKit — Universal Web3 Developer Platform
 
> The complete developer platform for building, simulating, and deploying Web3 smart contracts.
> Visual composer + AI security scanner + protocol integrations — all in one.
 
---
 
## 🎯 Project Purpose
 
ForgeKit is a full-stack Web3 developer platform that makes building on Ethereum protocols fast and accessible. It solves four major pain points every Solidity developer faces:
 
1. Building Uniswap V4 Hooks requires raw boilerplate, manual address mining, and zero tooling
2. Integrating Aave and Chainlink requires reading hundreds of pages of documentation
3. Smart contract security vulnerabilities cause billions in losses annually
4. Gas optimization is manual and time-consuming
 
ForgeKit solves all four with a unified visual platform.
 
---
 
## 🏗️ Architecture Overview
 
```
forgekit/
├── frontend/          # Next.js 15 + TypeScript — main user interface
├── contracts/         # Foundry + Solidity — smart contracts
└── backend/           # FastAPI Python — simulation + AI scanner
```
 
### Frontend Stack
- **Framework**: Next.js 15 (App Router, Server + Client Components)
- **Language**: TypeScript
- **Styling**: TailwindCSS (dark theme — bg #0a0a0f)
- **Wallet**: Wagmi v2 + Viem (MetaMask, WalletConnect)
- **State**: @tanstack/react-query
- **Code Editor**: Monaco Editor (@monaco-editor/react) — VS Code engine
- **Drag & Drop**: @dnd-kit/core + @dnd-kit/sortable
- **Visualizations**: D3.js
- **Icons**: lucide-react
- **Utilities**: clsx, tailwind-merge
 
### Blockchain Stack
- **V4 Hooks**: Uniswap V4 Core (v4-core, v4-periphery)
- **DeFi Protocol**: Aave V3 SDK
- **Oracle**: Chainlink SDK
- **Security**: OpenZeppelin Contracts
- **Testing**: Foundry (forge test)
- **Local Node**: Anvil (mainnet fork simulation)
- **ERC Standards Used**:
  - ERC-20: Token interactions
  - ERC-721: Deployed contract registry (NFT receipt)
  - ERC-1967: Upgradeable proxy for hook contracts
  - ERC-2612: Gasless permit for Aave integrations
  - ERC-7702: Wallet delegation (Pectra upgrade — brand new 2025)
 
### Backend Stack
- **Framework**: FastAPI (Python 3.11)
- **Server**: Uvicorn
- **AI**: Anthropic Claude API (security scanner + gas optimizer)
- **Blockchain**: web3.py
- **HTTP**: httpx
- **Simulation**: Anvil process management
 
---
 
## 📦 Four Core Modules
 
### Module 1 — Hook Builder (`/hook-builder`)
**Target: Uniswap V4 developers**
 
Visual drag-drop interface for building Uniswap V4 Hooks.
 
**Key Features:**
- Drag lifecycle blocks (beforeSwap, afterSwap, beforeAddLiquidity, afterAddLiquidity, beforeRemoveLiquidity, afterRemoveLiquidity) onto canvas
- Monaco Editor on right side shows real Solidity code generating in real-time as user drags
- Pre-built hook modules: Dynamic Fee, TWAMM, MEV Rebate, Limit Order, Whitelist Gate
- Automatic CREATE2 address mining (Node.js Web Worker runs in background — finds valid hook address whose last 14 bits encode hook permissions)
- One-click deploy to Polygon/Base/Arbitrum/Mainnet
- Auto-verification on Etherscan
 
**How address mining works:**
Uniswap V4 requires hook addresses where specific bits encode callback permissions. Worker thread iterates salts and computes CREATE2 addresses until last 14 bits match required permission flags.
 
**Solidity base template:**
```solidity
// Every generated hook extends BaseHook from v4-periphery
import {BaseHook} from "v4-periphery/src/base/hooks/BaseHook.sol";
import {IPoolManager} from "v4-core/src/interfaces/IPoolManager.sol";
import {Hooks} from "v4-core/src/libraries/Hooks.sol";
 
contract GeneratedHook is BaseHook {
    constructor(IPoolManager _poolManager) BaseHook(_poolManager) {}
    
    function getHookPermissions() public pure override returns (Hooks.Permissions memory) {
        return Hooks.Permissions({
            beforeSwap: true,
            afterSwap: false,
            // ... other permissions based on user selection
        });
    }
    
    function beforeSwap(address, PoolKey calldata, IPoolManager.SwapParams calldata, bytes calldata)
        external override returns (bytes4, BeforeSwapDelta, uint24) {
        // User logic here
        return (BaseHook.beforeSwap.selector, BeforeSwapDeltaLibrary.ZERO_DELTA, 0);
    }
}
```
 
---
 
### Module 2 — Protocol Integrator (`/protocol-integrator`)
**Target: Aave, Chainlink, DeFi startups**
 
Visual interface to integrate protocol blocks into any smart contract.
 
**Available Blocks:**
- Aave V3 FlashLoan
- Aave V3 Supply
- Aave V3 Borrow
- Chainlink Price Feed (AggregatorV3Interface)
- Chainlink VRF (randomness)
- Chainlink Automation (keepers)
 
**How it works:**
User drags blocks → corresponding Solidity code appends to Monaco editor automatically. Multiple blocks can be combined. Final contract compiles and deploys.
 
**Aave FlashLoan template auto-generated:**
```solidity
import {IPool} from "@aave/core-v3/contracts/interfaces/IPool.sol";
import {IFlashLoanSimpleReceiver} from "@aave/core-v3/contracts/flashloan/interfaces/IFlashLoanSimpleReceiver.sol";
// ... full template
```
 
**Chainlink Price Feed template auto-generated:**
```solidity
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
// ETH/USD Polygon: 0xF9680D99D6C9589e2a93a78A04A279e509205945
// ... full template
```
 
---
 
### Module 3 — AI Security Scanner (`/security-scanner`)
**Target: OpenZeppelin, Nethermind, all blockchain companies**
 
Paste any Solidity contract → AI returns full vulnerability report.
 
**Detects:**
- 🔴 Reentrancy vulnerabilities
- 🔴 Integer overflow/underflow
- 🟡 Missing access control (onlyOwner, roles)
- 🟡 Unchecked external calls
- 🟢 Gas inefficiencies
- 🟢 Best practice violations
 
**How it works:**
1. User pastes contract into editor
2. FastAPI receives contract code
3. Anthropic Claude API analyzes with security-focused prompt
4. Returns structured JSON: severity, line number, description, fix
5. Frontend renders color-coded audit report
6. Overall security score 0-100
 
**API flow:**
```
Frontend → POST /api/security/scan → FastAPI → Claude API → JSON report → Frontend renders
```
 
---
 
### Module 4 — Gas Optimizer (`/gas-optimizer`)
**Target: Every blockchain company**
 
Paste any Solidity contract → AI finds gas inefficiencies + shows exact savings.
 
**Optimizations detected:**
- Storage variable packing (save 1 SSTORE per packed slot)
- `unchecked{}` blocks for safe arithmetic
- `calldata` vs `memory` for function parameters
- Loop optimizations (cache length, ++i vs i++)
- Event vs storage for historical data
 
**API flow:**
```
Frontend → POST /api/optimize/gas → FastAPI → Claude API → optimization list → Frontend renders
```
 
---
 
## 🗺️ Complete File Structure
 
```
frontend/
├── src/
│   ├── app/
│   │   ├── layout.tsx                    # Root layout, metadata
│   │   ├── page.tsx                      # Landing page
│   │   ├── globals.css                   # Global styles, CSS variables
│   │   │
│   │   ├── hook-builder/
│   │   │   ├── page.tsx                  # Hook Builder main page
│   │   │   └── _components/
│   │   │       ├── DragCanvas.tsx        # Left: drag-drop lifecycle blocks
│   │   │       ├── MonacoPane.tsx        # Right: Monaco code editor
│   │   │       ├── ModulePanel.tsx       # Pre-built hook modules sidebar
│   │   │       ├── MinerStatus.tsx       # Address mining progress bar
│   │   │       └── DeployPanel.tsx       # Chain selector + deploy button
│   │   │
│   │   ├── protocol-integrator/
│   │   │   ├── page.tsx
│   │   │   └── _components/
│   │   │       ├── AaveBlocks.tsx        # Aave protocol drag blocks
│   │   │       ├── ChainlinkBlocks.tsx   # Chainlink drag blocks
│   │   │       └── CodePreview.tsx       # Monaco editor output
│   │   │
│   │   ├── security-scanner/
│   │   │   ├── page.tsx
│   │   │   └── _components/
│   │   │       ├── ContractInput.tsx     # Paste contract textarea
│   │   │       ├── AuditReport.tsx       # Vulnerability results display
│   │   │       └── VulnerabilityCard.tsx # Individual finding card
│   │   │
│   │   ├── gas-optimizer/
│   │   │   ├── page.tsx
│   │   │   └── _components/
│   │   │       ├── ContractInput.tsx     # Paste contract textarea
│   │   │       └── OptimizationReport.tsx # Gas savings display
│   │   │
│   │   ├── simulate/
│   │   │   └── page.tsx                  # Anvil fork simulation UI
│   │   │
│   │   └── deploy/
│   │       └── page.tsx                  # Unified deploy interface
│   │
│   ├── components/
│   │   ├── ui/
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Badge.tsx
│   │   │   └── Modal.tsx
│   │   ├── Navbar.tsx                    # Fixed top navigation
│   │   ├── WalletButton.tsx              # Wagmi connect wallet button
│   │   └── ChainSelector.tsx             # Network switcher dropdown
│   │
│   ├── lib/
│   │   ├── wagmi.ts                      # Wagmi + RainbowKit config
│   │   ├── chains.ts                     # Polygon, Base, Arbitrum, Mainnet config
│   │   ├── thegraph.ts                   # TheGraph subgraph query functions
│   │   └── workers/
│   │       └── addressMiner.worker.ts    # Web Worker: CREATE2 address mining
│   │
│   ├── hooks/
│   │   ├── useHookComposer.ts            # Hook builder state management
│   │   ├── useAddressMiner.ts            # Address mining state + worker comm
│   │   ├── useSimulation.ts              # Simulation state
│   │   └── useWallet.ts                  # Wallet connection helpers
│   │
│   └── codegen/
│       ├── hookGenerator.ts              # Generates V4 hook Solidity from config
│       ├── aaveGenerator.ts              # Generates Aave integration code
│       └── chainlinkGenerator.ts         # Generates Chainlink oracle code
│
├── .env.local                            # Environment variables (never commit)
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
 
contracts/
├── src/
│   ├── ForgeKitRegistry.sol              # On-chain hook registry (ERC-721 receipt)
│   └── templates/
│       ├── BaseHookTemplate.sol          # Base V4 hook all generated hooks extend
│       ├── DynamicFeeHook.sol            # Pre-built: dynamic fee hook
│       ├── LimitOrderHook.sol            # Pre-built: limit order hook
│       └── AaveIntegration.sol           # Aave flashloan template
├── test/
│   └── ForgeKit.t.sol
├── script/
│   └── Deploy.s.sol
├── lib/
│   ├── v4-core/                          # Uniswap V4 core contracts
│   ├── v4-periphery/                     # Uniswap V4 periphery
│   └── openzeppelin-contracts/           # OZ standards
└── foundry.toml
 
backend/
├── main.py                               # FastAPI entry point
├── routers/
│   ├── simulate.py                       # POST /simulate — Anvil fork manager
│   ├── security.py                       # POST /security/scan — AI audit
│   └── optimize.py                       # POST /optimize/gas — gas analysis
├── services/
│   ├── anvil_manager.py                  # Starts/stops Anvil process
│   ├── ai_scanner.py                     # Claude API integration
│   └── thegraph_client.py                # Fetches historical swap data
└── requirements.txt
```
 
---
 
## 🔑 Environment Variables
 
```bash
# frontend/.env.local
 
# Alchemy (get free key at alchemy.com)
NEXT_PUBLIC_ALCHEMY_KEY=
 
# WalletConnect (get at cloud.walletconnect.com)
NEXT_PUBLIC_WALLETCONNECT_ID=
 
# Anthropic (get at console.anthropic.com)
ANTHROPIC_API_KEY=
 
# Network
NEXT_PUBLIC_CHAIN_ID=80002
NEXT_PUBLIC_NETWORK_NAME=Polygon Amoy
 
# Backend
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
```
 
---
 
## 🚀 Running The Project
 
### Frontend
```bash
cd frontend
npm run dev
# Runs on localhost:3000
```
 
### Backend
```bash
cd backend
source venv/bin/activate
uvicorn main:app --reload
# Runs on localhost:8000
```
 
### Contracts
```bash
cd contracts
forge build          # Compile contracts
forge test           # Run tests
anvil                # Start local node
```
 
---
 
## 🎨 Design System
 
All UI follows this design language:
 
```
Background:     #0a0a0f  (near black)
Card:           #0f0f1a
Card border:    #1e1e2e
Primary:        #7c3aed  (purple)
Primary light:  #a78bfa
Secondary:      #06b6d4  (cyan)
Accent:         #10b981  (green)
Danger:         #ef4444  (red)
Warning:        #f59e0b  (amber)
Muted text:     #64748b
Body text:      #e2e8f0
```
 
Gradient: `linear-gradient(135deg, #7c3aed, #06b6d4)`
 
---
 
## 📋 Build Order (For Copilot — Build In This Sequence)
 
```
Phase 1 — Foundation (Current)
├── Landing page (/app/page.tsx)           ← DONE
├── Navbar component                        ← NEXT
├── Wagmi provider setup                    ← NEXT
└── Wallet connect button                   ← NEXT
 
Phase 2 — Hook Builder (Module 1)
├── DragCanvas component
├── MonacoPane component  
├── hookGenerator.ts (code generation)
├── addressMiner.worker.ts
└── Deploy integration
 
Phase 3 — Protocol Integrator (Module 2)
├── AaveBlocks component
├── ChainlinkBlocks component
├── aaveGenerator.ts
└── chainlinkGenerator.ts
 
Phase 4 — AI Modules (Module 3 + 4)
├── FastAPI backend setup
├── Claude API integration
├── Security scanner UI
└── Gas optimizer UI
 
Phase 5 — Contracts
├── ForgeKitRegistry.sol
├── BaseHookTemplate.sol
└── Deploy scripts
```
 
---
 
## 🏆 Project Goals
 
**For Hiring:**
- Uniswap internship: Hook Builder shows deep V4 protocol knowledge
- Aave internship: Protocol Integrator shows Aave V3 understanding  
- Chainlink: Protocol Integrator uses their oracle SDK
- OpenZeppelin/Nethermind: Security Scanner shows auditor mindset
- Any Web3 startup: Full platform shows production-grade thinking
 
**For Hackathon (ETHIndia 2026):**
- ForgeKit knowledge used to build LiquidMind (AI LP manager hook)
- LiquidMind = hackathon submission built using ForgeKit tooling
 
---
 
## 👨‍💻 Developer
 
**Abhinav Malik**  
B.Tech ECE — KIET Group of Institutions, Ghaziabad  
GitHub: [@Abhinav-Malik-154](https://github.com/Abhinav-Malik-154)  
Focus: Core Blockchain Developer + Protocol-level Web3 Engineer  
Target: Uniswap, Aave, Polygon Labs, Chainlink Labs, Web3 startups
 