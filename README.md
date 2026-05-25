# 🃏 SuiCards — On-Chain Card Battle Game

> Built for the Tatum x Walrus Hackathon 2025

SuiCards is a fully decentralized card battle game built on the **Sui blockchain**. Every game state, player deck, and match result is permanently stored on **Walrus decentralized storage** and all blockchain interactions are powered by **Tatum's enterprise-grade Sui RPC nodes**.

No central server. No database. Just pure on-chain gaming. 🚀

---

## 🎮 How It Works

1. **Enter player names** — Two players enter their names to start a battle
2. **Get your deck** — Each player receives 4 random cards with unique attack and defense stats
3. **Battle rounds** — Cards go head to head, dealing damage each round
4. **Winner decided** — The player with the most health after all rounds wins
5. **Saved on-chain** — Every game state is permanently stored on Walrus with a unique Blob ID

---

## 🛠️ Tech Stack

| Technology | Usage |
|-----------|-------|
| **Sui Blockchain** | On-chain game logic and leaderboard |
| **Walrus Storage** | Decentralized game state and deck storage |
| **Tatum Sui RPC** | Enterprise-grade Sui node connection |
| **React + TypeScript** | Frontend UI |
| **Vite** | Frontend build tool |

---

## 🃏 Card Types

| Type | Attack | Defense |
|------|--------|---------|
| 🔥 Fire | High | Medium |
| 💧 Water | Balanced | Balanced |
| 🌍 Earth | Low | Very High |
| 💨 Air | Very High | Low |

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- A free Tatum API key from [dashboard.tatum.io](https://dashboard.tatum.io)
- A Sui wallet from [suiwallet.com](https://suiwallet.com)

### Installation

```bash
# Clone the repo
git clone https://github.com/castro33dev/suicards.git
cd suicards

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local

# Add your Tatum API key to .env.local
VITE_TATUM_API_KEY=your_tatum_api_key_here
```

### Run the app

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🐋 Walrus Integration

Every game state is saved to Walrus decentralized storage when a battle starts:

- **Publisher:** `https://walrus-testnet-publisher.nodes.guru`
- **Aggregator:** `https://walrus-testnet-aggregator.nodes.guru`

Each game gets a unique **Blob ID** as proof of storage on Walrus.

---

## ⚡ Tatum RPC Integration

All Sui blockchain calls go through Tatum's enterprise RPC nodes:

- **Testnet:** `https://sui-testnet.gateway.tatum.io`
- **Mainnet:** `https://sui-mainnet.gateway.tatum.io`

---

## 📁 Project Structure
---

## 🏆 Hackathon

Built for the **Tatum x Walrus Hackathon** — May 23 to June 6, 2025.

- 🌐 [Tatum](https://tatum.io)
- 🐋 [Walrus](https://walrus.xyz)
- 🔵 [Sui](https://sui.io)

---

## 📄 License

MIT
