# Lucky Me

## Overview
Lucky Me is a blockchain-based prediction game where players stake CORE tokens, submit answers to randomly generated questions, and earn points for correct predictions. The game is designed to be **fun, competitive, and rewarding**, featuring an AI-powered question-answering system and secure blockchain-based randomness to ensure fairness. Players compete for rankings on a **leaderboard** based on their accumulated points.

## How It Works
1. **Wallet Connection**: Players connect their wallets using **RainbowKit**.
2. **Staking**: Players stake **0.02 CORE** to participate in a game session.
3. **Prediction Phase**: The game presents **10 randomly generated questions**.
4. **AI-Generated Answers**: An **AI agent** generates answers for each question in the background.
5. **On-Chain Randomness**: The smart contract uses **secure randomness** to determine the correct answer (either **A or B**).
6. **Scoring System**:
   - **Correct Answer**: Players earn **100,000 points**.
   - **Wrong Answer**: **20,000 points are deducted**.
   - **Streak Bonus**: Players who get **3 consecutive correct answers** receive an extra **50,000 points**.
7. **Leaderboard Ranking**: Players are ranked based on their total points.
8. **Rewards**: Players who correctly predict at least **8 out of 10 answers** **double their staked CORE**.

## AI-Powered Answer Generation & Blockchain Randomness
- The **AI agent** generates random questions and potential answers, ensuring a dynamic and engaging gameplay experience.
- The **final correct answer** for each question is determined **on-chain** using **randomness mechanisms** to ensure **fairness and prevent manipulation**.
- Since blockchain randomness is crucial, the smart contract leverages **Core DAO's native random number generation (RNG) solutions** to finalize outcomes in a **provably fair** manner.

## Tech Stack
### Frontend
- **React.js** – User interface
- **TypeScript** – Type safety and development efficiency
- **RainbowKit** – Wallet connection and Web3 interactions
- **Ethers.js** – Smart contract interaction
- **Tailwind CSS** – Styling

### Smart Contract
- **Solidity** – Smart contract logic
- **Hardhat** – Smart contract development and testing
- **Core DAO Blockchain** – Deployed network

## Features
- **Wallet Connection**: Users connect via RainbowKit.
- **CORE Staking**: Players stake CORE before playing.
- **AI-Generated Questions**: Unique, unpredictable questions per session.
- **Randomized Answers**: On-chain randomness determines correct predictions.
- **Automated Scoring**: Points awarded based on correct answers.
- **Streak Bonus**: Extra points for consecutive correct answers.
- **Leaderboard**: Top players ranked by total points.
- **Smart Contract Integration**: Data stored securely on-chain.

## Live Demo
🔗 **Deployed Game:** [https://luckyme-game1.vercel.app/]

## GitHub Repository
📂 **Frontend & Smart Contract:** [https://github.com/blockfuse-cohort-II/prediction-game]

## Video Demo
🎥 **Watch How It Works:** [Insert Video Link Here]

## Installation & Setup
### Prerequisites
Ensure you have the following installed:
- **Node.js** (LTS version recommended)
- **npm**

### Setup & Run
```sh
# Clone the repository
git clone git@github.com:blockfuse-cohort-II/prediction-game.git
cd prediction-game

# Install dependencies
npm install

# Start the development server
npm run dev
```

## License
This project is licensed under **UNLICENSED**.

