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

  describe("Gameplay - Staking & Submitting Predictions", function () {
    it("should allow players to stake ETH", async function () {
      await expect(guessGame.connect(player1).stake({ value: STAKE_AMOUNT }))
        .to.emit(guessGame, "Staked")
        .withArgs(player1Address, STAKE_AMOUNT);
    });

    it("should allow players to submit predictions after staking and return true", async function () {
      const answers = Array(QUESTIONS_PER_GAME).fill(0);
      const correctAnswers = Array(QUESTIONS_PER_GAME).fill(0);

      await expect(
        guessGame.connect(player1).submitPredictions(answers, correctAnswers)
      )
        .to.emit(guessGame, "PredictionsSubmitted")
        .withArgs(player1Address, answers, anyValue);

      const playerResult = await guessGame.getPlayerLatestGameResult(
        player1Address
      );

      expect(playerResult.correctAnswers).to.equal(QUESTIONS_PER_GAME);
    });
  });

  describe("Game ID Auto-Incrementation", function () {
    it("should increment gameId after each game", async function () {
      const gameIdBefore = await guessGame.currentGameId();

      const answers = Array(QUESTIONS_PER_GAME).fill(1);
      const correctAnswers = Array(QUESTIONS_PER_GAME).fill(1);
      await guessGame.connect(player1).stake({ value: STAKE_AMOUNT });
      
      await guessGame
        .connect(player1)
        .submitPredictions(answers, correctAnswers);

      const gameIdAfter = await guessGame.currentGameId();
      expect(Number(gameIdAfter)).to.equal(Number(gameIdBefore) + 1);
    });
  });

  describe("Stake Auto Withdrawal", function () {
     it("should automatically withdraw stake after game result is calculated", async function () {
       const balanceBefore = await ethers.provider.getBalance(player1Address);
       const answers = Array(QUESTIONS_PER_GAME).fill(1);
       const correctAnswers = Array(QUESTIONS_PER_GAME).fill(1);

       const tx = await guessGame
         .connect(player1)
         .stake({ value: STAKE_AMOUNT });
       const receipt = await tx.wait();
       const gasUsed = receipt!.gasUsed * tx.gasPrice;

       await guessGame
         .connect(player1)
         .submitPredictions(answers, correctAnswers);

       const balanceAfter = await ethers.provider.getBalance(player1Address);

       expect(balanceAfter).to.be.closeTo(
         balanceBefore,
         gasUsed + STAKE_AMOUNT
       );
     });

  });

  describe("Leaderboard Management", function () {
    it("should correctly update the leaderboard after games", async function () {
      const leaderboard = await guessGame.getGlobalLeaderboard();
      expect(leaderboard.length).to.be.gte(1);
    });
  });

  describe("Owner Withdraw Function", function () {
    it("should allow only the owner to withdraw funds from the contract", async function () {
      guessGame.connect(player1).stake({ value: STAKE_AMOUNT });
      await expect(
        guessGame.connect(player2).withdrawFromContract()
      ).to.be.revertedWith("Not contract owner");

      await expect(guessGame.connect(owner).withdrawFromContract()).to.emit(
        guessGame,
        "OwnerWithdrawn"
      );
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
