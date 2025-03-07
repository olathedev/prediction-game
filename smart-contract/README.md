# Lucky Me Smart Contract

## Overview
The `Lucky Me` smart contract is a blockchain-based prediction game where players stake CORE, submit answers to randomly generated questions, and earn points for correct predictions. Bonus points are awarded for consecutive correct answers. The contract maintains player statistics and a global leaderboard.

## Features
- Players set a unique username.
- CORE staking is required to participate.
- Players submit answers and receive points for correct predictions.
- Bonus points are awarded for achieving a streak of correct answers.
- Players can withdraw their staked CORE after submitting predictions.
- A global leaderboard ranks players by total points.
- The contract owner can withdraw the accumulated balance.

## Constants
- `QUESTIONS_PER_GAME = 10`: Number of questions per game.
- `POINTS_PER_CORRECT_ANSWER = 10`: Points awarded per correct answer.
- `STREAK_REWARD_POINTS = 50`: Bonus points for getting 3 consecutive answers correct.
- `STREAK_LENGTH = 3`: Minimum streak length for bonus points.

## Smart Contract Functions

### Player Functions
1. **setUsername(string _username)**  
   - Sets a unique username for the player.

2. **stake() payable**  
   - Players must stake CORE before submitting predictions.

3. **submitPredictions(uint256[10] answers, uint256[10] _correctAnswers) returns (bool)**  
   - Players submit their answers and compare them with correct answers.
   - The contract calculates scores and updates player statistics.

4. **getPlayerLatestGameResult(address player) view returns (GameResult)**  
   - Retrieves the latest game result for a player.

5. **getPlayerDetails(address playerAddress) view returns (Player)**  
   - Returns detailed player information.

6. **getPlayerScores(address playerAddress) view returns (uint256 totalPoints, uint256 totalCorrect)**  
   - Fetches a player's total points and correct answers count.

### Leaderboard Functions
1. **getGlobalLeaderboard() view returns (Player[])**  
   - Returns a sorted list of players by total points.

### Owner Functions
1. **withdrawFromContract() onlyOwner**  
   - Withdraws all CORE from the contract balance.

## Events
- `UsernameSet(address player, string username)`: Emitted when a player sets a username.
- `Staked(address player, uint256 amount)`: Emitted when a player stakes CORE.
- `PredictionsSubmitted(address player, uint256[10] answers, GameResult result)`: Emitted when predictions are submitted.
- `StakeWithdrawn(address player, uint256 amount)`: Emitted when a player withdraws their stake.
- `OwnerWithdrawn(address owner, uint256 amount)`: Emitted when the owner withdraws funds.

## Deployment
- The contract deploys with the owner as the deployer.
- Players interact by setting a username, staking CORE, and submitting predictions.
- The owner can withdraw funds collected in the contract.

## Security Considerations
- Players must stake CORE before submitting predictions to prevent spam submissions.
- The contract uses `onlyOwner` to restrict fund withdrawals to the contract owner.
- Safe handling of CORE transfers to prevent loss of funds.

### Setup & Deploy Smart Contract
```sh
# Navigate to the smart contract directory
cd smart-contracts

# Install dependencies
npm install

# Compile the smart contracts
npx hardhat compile

## License
This project is licensed under the **UNLICENSED** SPDX identifier.



Try running some of the following tasks:

```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat ignition deploy ./ignition/modules/Lock.ts
```
