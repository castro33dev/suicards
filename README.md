# 🃏 SuiCards — On-Chain Card Battle Game

> Built for the Tatum x Walrus Hackathon 2025

SuiCards is a fully decentralized card battle game built on the **Sui blockchain**. Every game state and player deck is permanently stored on **Walrus decentralized storage**, all blockchain interactions are powered by **Tatum's enterprise-grade Sui RPC nodes**, and game results are recorded on-chain via a **deployed Move smart contract**.

No central server. No database. Just pure on-chain gaming. 🚀

🌐 **Live Demo:** https://reimagined-pancake-xr55q4rwg949fw96-3000.app.github.dev

---

## 🏆 Hackathon Prizes Targeting

- ⚡ **Best Use of Tatum Tools** — Tatum Sui Mainnet RPC powers all blockchain calls
- 🌟 **Best Walrus Integration** — Game state stored on Walrus on every battle

---

## ✨ Features

- 🃏 Card battle game with 8 unique cards across 4 types
- 🔗 Sui wallet connection via `@mysten/dapp-kit`
- 🐋 Game state saved to Walrus decentralized storage
- ⛓️ Results recorded on Sui Mainnet smart contract
- 🏆 Leaderboard tracking wins, losses, and draws
- 🔍 Clickable Sui transaction links after every game
- ⚡ Powered by Tatum's enterprise Sui RPC nodes

---

## 🛠️ Tech Stack

| Technology | Usage |
|-----------|-------|
| **Sui Blockchain** | Smart contract + game results |
| **Walrus Storage** | Decentralized game state storage |
| **Tatum Sui RPC** | Enterprise Sui Mainnet connection |
| **React + TypeScript** | Frontend UI |
| **@mysten/dapp-kit** | Sui wallet connection |
| **Sui Move** | On-chain leaderboard contract |
| **Vite** | Frontend build tool |

---

## 📋 Smart Contract

Deployed on **Sui Mainnet**:

| Object | ID |
|--------|-----|
| **Package** | `0xaec6ffd87cbb3230291aa29f944af7d2448c163285c4a9176fcab5ee3c4ccea4` |
| **Leaderboard** | `0x77aa34b0c5f58caa0ac1c410b1c13f5597c206454347380c1fca1cfcfa12f3cd` |

Key functions:
- `record_result` — Records winner, loser, and draw status on-chain
- `create_leaderboard` — Initializes the shared leaderboard object

---

## 🃏 Card Types

| Type | Attack | Defense |
|------|--------|---------|
| 🔥 Fire | High | Medium |
| 💧 Water | Balanced | Balanced |
| 🌍 Earth | Low | Very High |
| 💨 Air | Very High | Low |

---

## 🐋 Walrus Integration

Every game state is saved to Walrus when a battle starts:

- **Publisher:** `https://publisher.walrus-testnet.walrus.space`
- **Aggregator:** `https://aggregator.walrus-testnet.walrus.space`

Each game gets a unique **Blob ID** as proof of decentralized storage.

---

## ⚡ Tatum RPC Integration

All Sui blockchain calls go through Tatum's enterprise RPC:

- **Mainnet:** `https://sui-mainnet.gateway.tatum.io`

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- A free Tatum API key from [dashboard.tatum.io](https://dashboard.tatum.io)
- A Sui wallet from [suiwallet.com](https://suiwallet.com)

### Installation

```bash
git clone https://github.com/castro33dev/suicards.git
cd suicards
npm install
cp .env.example .env.local
# Add your Tatum API key to .env.local
npm run dev
```

---

## 📁 Project Structure
---

## 🔗 Links

- 📦 [Smart Contract on SuiScan](https://suiscan.xyz/mainnet/object/0xaec6ffd87cbb3230291aa29f944af7d2448c163285c4a9176fcab5ee3c4ccea4)
- 🐋 [Walrus](https://walrus.xyz)
- ⚡ [Tatum](https://tatum.io)
- 🔵 [Sui](https://sui.io)

---

## 📄 License

MIT — Built for Tatum x Walrus Hackathon 2025
