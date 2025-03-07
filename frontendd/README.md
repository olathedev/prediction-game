# Lucky Me Frontend

## Overview
This is the frontend implementation of the `Lucky Me` smart contract, built using **React, TypeScript, and RainbowKit**. It allows users to connect their wallets, stake CORE, submit predictions, and view leaderboards.

## Tech Stack
- **React** – Frontend framework
- **TypeScript** – Type safety and better development experience
- **RainbowKit** – Wallet connection and Web3 interactions
- **Ethers.js** – Interacting with the smart contract
- **Tailwind CSS** – Styling

## Features
- **Wallet Connection**: Users can connect via RainbowKit.
- **Staking System**: Users stake CORE before submitting predictions.
- **Game Interaction**: Players submit their answers and receive points.
- **Leaderboard**: Displays top players ranked by total points.
- **Smart Contract Integration**: Reads and writes data to the blockchain.

## Installation

### Prerequisites
Ensure you have the following installed:
- **Node.js** (LTS version recommended)
- **npm**

### Setup
```sh
# Clone the repository
git clone git@github.com:blockfuse-cohort-II/prediction-game.git
cd prediction

# Install dependencies
npm install

# Start the development server
npm run dev
```

## Usage
1. **Connect Wallet**: Click the connect button to link your wallet via RainbowKit.
2. **Stake CORE**: Before playing, stake the required CORE amount.
3. **Submit Predictions**: Choose answers and submit them.
4. **View Results**: See your total points and game history.
5. **Leaderboard**: Check the top-ranked players.

## Deployment
To deploy the frontend:
```sh
# Build the project
npm run build

# Start production server
npm run start
```

## License
This project is licensed under **UNLICENSED**.

