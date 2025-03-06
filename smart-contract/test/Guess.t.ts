import { ethers } from "hardhat";
import { expect } from "chai";
import { Signer } from "ethers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { GuessGame } from "../typechain-types";

describe("GuessGame Contract", function () {
  let guessGame: GuessGame;
  let owner: Signer;
  let player1: Signer;
  let player2: Signer;
  let player1Address: string;
  let player2Address: string;

  const STAKE_AMOUNT = ethers.parseEther("0.1");
  const QUESTIONS_PER_GAME = 10;

  before(async function () {
    [owner, player1, player2] = await ethers.getSigners();
    player1Address = await player1.getAddress();
    player2Address = await player2.getAddress();

    const GuessGameFactory = await ethers.getContractFactory("GuessGame");
    guessGame = (await GuessGameFactory.deploy()) as GuessGame;
  });

  describe("Username Registration", function () {
    it("should not allow withdrawal if results are not generated", async function () {
      await expect(
        guessGame.connect(player1).withdrawStake()
      ).to.be.revertedWith("No games played yet");
    });
    it("should allow players to set a unique username", async function () {
      await expect(guessGame.connect(player1).setUsername("PlayerOne"))
        .to.emit(guessGame, "UsernameSet")
        .withArgs(player1Address, "PlayerOne");

      await expect(guessGame.connect(player2).setUsername("PlayerTwo"))
        .to.emit(guessGame, "UsernameSet")
        .withArgs(player2Address, "PlayerTwo");
    });

    it("should not allow duplicate usernames", async function () {
      await expect(
        guessGame.connect(player1).setUsername("PlayerTwo")
      ).to.be.revertedWith("Username already taken");
    });
  });

  describe("Gameplay - Submitting Predictions & Staking", function () {
    it("should allow players to stake ETH and submit predictions", async function () {
      const answers = Array(QUESTIONS_PER_GAME).fill(0);

      await expect(
        guessGame
          .connect(player1)
          .submitPredictions(answers, { value: STAKE_AMOUNT })
      )
        .to.emit(guessGame, "PredictionsSubmitted")
        .withArgs(player1Address, answers, anyValue);

      await expect(
        guessGame
          .connect(player2)
          .submitPredictions(answers, { value: STAKE_AMOUNT })
      )
        .to.emit(guessGame, "PredictionsSubmitted")
        .withArgs(player2Address, answers, anyValue);
    });

    it("should require ETH to be staked", async function () {
      const answers = Array(QUESTIONS_PER_GAME).fill(1);
      await expect(
        guessGame.connect(player1).submitPredictions(answers, { value: 0 })
      ).to.be.revertedWith("Must stake some ETH");
    });
  });

  describe("Game ID Auto-Incrementation", function () {
    it("should increment gameId after each game", async function () {
      const gameIdBefore = await guessGame.currentGameId();

      const answers = Array(QUESTIONS_PER_GAME).fill(1);
      await guessGame
        .connect(player1)
        .submitPredictions(answers, { value: STAKE_AMOUNT });

      const gameIdAfter = await guessGame.currentGameId();
      expect(Number(gameIdAfter)).to.equal(Number(gameIdBefore) + 1);
    });
    it("should get player result", async function () {
      const result = await guessGame.connect(player1).getPlayerLatestGameResult(player1Address);
      console.log({result})
    })
  });

  describe("Stake Withdrawal (Security & Reentrancy Check)", function () {
    it("should allow players to withdraw their stake after results are generated", async function () {
      const balanceBefore = await ethers.provider.getBalance(player1Address);

      await expect(guessGame.connect(player1).withdrawStake())
        .to.emit(guessGame, "StakeWithdrawn")
        .withArgs(player1Address, STAKE_AMOUNT);

      const balanceAfter = await ethers.provider.getBalance(player1Address);
      expect(balanceAfter).to.be.gt(balanceBefore);
    });

    it("should not allow withdrawing twice", async function () {
      const getUser = await guessGame.connect(player1).getPlayerLatestGameResult(player2Address);
      console.log({getUser})


      await expect(
        guessGame.connect(player1).withdrawStake()
      ).to.be.revertedWith("No stake to withdraw");
    });

    
  });

  describe("Leaderboard Management", function () {
    it("should correctly update the leaderboard after games", async function () {
      const leaderboard = await guessGame.getGlobalLeaderboard();
      console.log(leaderboard)
      expect(leaderboard.length).to.be.gte(2);
      expect(leaderboard[0].totalPoints).to.be.gte(leaderboard[1].totalPoints);
    });
  });

  describe("Error Handling", function () {
    it("should prevent getting latest game result for a player with no games", async function () {
      const randomPlayer = ethers.Wallet.createRandom();
      await expect(
        guessGame.getPlayerLatestGameResult(randomPlayer.address)
      ).to.be.revertedWith("No games played yet");
    });
  });
});
