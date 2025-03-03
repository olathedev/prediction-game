## Foundry

**Foundry is a blazing fast, portable and modular toolkit for Ethereum application development written in Rust.**

Foundry consists of:

-   **Forge**: Ethereum testing framework (like Truffle, Hardhat and DappTools).
-   **Cast**: Swiss army knife for interacting with EVM smart contracts, sending transactions and getting chain data.
-   **Anvil**: Local Ethereum node, akin to Ganache, Hardhat Network.
-   **Chisel**: Fast, utilitarian, and verbose solidity REPL.

## Documentation

https://book.getfoundry.sh/

## Usage

### Build

```shell
$ forge build
```

### Test

```shell
$ forge test
```

### Format

```shell
$ forge fmt
```

### Gas Snapshots

```shell
$ forge snapshot
```

### Anvil

```shell
$ anvil
```

### Deploy

```shell
$ forge script script/Counter.s.sol:CounterScript --rpc-url <your_rpc_url> --private-key <your_private_key>
```

### Cast

```shell
$ cast <subcommand>
```

### Help

```shell
$ forge --help
$ anvil --help
$ cast --help
```

# Undead Unluck

This smart contract powers a prediction-based game where players stake CORE tokens and predict answers to randomly generated questions. The contract manages game logic, player scores, staking, and leaderboards.

## Features
- Players predict answers to multiple-choice questions.
- Staking mechanism to participate in a set of 10 questions.
- Automatic scoring and streak rewards.
- Question resolution handled by an admin (backend integration required).
- Real-time leaderboard updates.

## Contract Details

### State Variables
- `owner`: The contract owner.
- `QUESTIONS_PER_GAME`: Number of questions per game (10).
- `MAX_OPTIONS`: Maximum number of answer choices per question (4).
- `POINTS_PER_CORRECT_ANSWER`: Points awarded for a correct answer (10).
- `STREAK_REWARD_POINTS`: Bonus points for a streak of correct answers (50).
- `STREAK_LENGTH`: Number of consecutive correct answers required for a streak bonus (3).
- `questions`: Mapping of all game questions.
- `players`: Mapping of player profiles.
- `leaderboard`: Stores the top players based on points.

## Functions

### Player Actions
#### `setUsername(string _username)`
Allows players to set a unique username. Throws an error if the username is taken or empty.

#### `stakeForQuestions()`
Players stake CORE tokens to participate in the current set of 10 questions. The required stake amount is set by the owner.

#### `predict(uint256 questionId, uint256 answer)`
Allows players to submit predictions for a given question. Predictions must be submitted before the deadline, and the player must have staked beforehand.

### Admin Functions
#### `setStakingAmount(uint256 amount)`
Sets the required staking amount for a set of 10 questions.

#### `createQuestion(string text, string[MAX_OPTIONS] options, uint256 duration, uint256 resolutionWindow, uint256 timeLimit)`
Allows the owner to create a new question with a deadline and resolution window.

#### `resolveQuestion(uint256 questionId, uint256 correctAnswer)`
Marks a question as resolved and assigns points to players based on their predictions.

### View Functions
#### `getPlayerDetails(address playerAddress) → Player`
Returns the details of a player, including total points and prediction history.

#### `getLeaderboard() → (address[], string[], uint256[])`
Returns the leaderboard with player addresses, usernames, and scores.

## Game Flow
1. The admin creates a new question set.
2. Players stake the required amount to participate.
3. Players predict answers before the deadline.
4. The admin resolves questions and updates scores.
5. The leaderboard updates automatically based on scores.

## Deployment
To deploy the contract:
1. Ensure you have Solidity 0.8.13+ installed.
2. Use Hardhat, Foundry, or Remix to compile and deploy.
3. Call `setStakingAmount()` to initialize staking requirements.

## Notes
- Players must stake before participating.
- Predictions are locked after the deadline.
- The owner is responsible for resolving questions.
- The leaderboard is updated after each resolution.

This contract is designed to integrate with a backend system for question generation and resolution.

