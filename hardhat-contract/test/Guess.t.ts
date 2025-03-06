import { expect } from "chai";
import { ethers } from "hardhat";
import hre from "hardhat";

import { GuessGame, GuessGame__factory } from "../typechain-types";
import { HardhatEthersHelpers } from "hardhat/types";

describe("GuesGame", function () {
  let GuessGame;
  let guessGame: GuessGame;
  let owner: any;
  let addr1: any;
  let addr2: any;

  beforeEach(async function () {
    GuessGame = await ethers.getContractFactory("GuessGame");
    [owner, addr1, addr2] = await ethers.getSigners();
    guessGame = await GuessGame.deploy();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await guessGame.owner()).to.equal(owner.address);
    });

    it("Should initialize with the correct game ID", async function () {
      expect(await guessGame.currentGameId()).to.equal(1);
    });
  });

  describe("Set Username", function () {
    it("Should allow a user to set a username", async function () {
      await guessGame.connect(addr1).setUsername("Player1");
      const player = await guessGame.getPlayerDetails(addr1.address);
      expect(player.username).to.equal("Player1");
    });

    it("Should not allow setting an empty username", async function () {
      await expect(guessGame.connect(addr1).setUsername("")).to.be.revertedWith(
        "Username cannot be empty"
      );
    });

    it("Should not allow setting a duplicate username", async function () {
      await guessGame.connect(addr1).setUsername("Player1");
      await expect(
        guessGame.connect(addr2).setUsername("Player1")
      ).to.be.revertedWith("Username already taken");
    });
  });

  describe("Submit Predictions", function () {
    it("Should allow a user to submit predictions and stake ETH", async function () {
      const answers = Array(10).fill(0);
      await guessGame
        .connect(addr1)
        .submitPredictions(answers, { value: ethers.parseEther("1") });
      const player = await guessGame.getPlayerDetails(addr1.address);
      expect(player.stakedAmount).to.equal(ethers.parseEther("1"));
    });

    it("Should not allow a user to submit predictions without staking ETH", async function () {
      const answers = Array(10).fill(0);
      await expect(
        guessGame.connect(addr1).submitPredictions(answers)
      ).to.be.revertedWith("Must stake some ETH");
    });

    it("Should allow a user to submit predictions more than once but less than 10", async function () {
      const answers = Array(10).fill(0);
      for (let i = 0; i < 10; i++) {
        await guessGame
          .connect(addr1)
          .submitPredictions(answers, { value: ethers.parseEther("1") });
      }
      await expect(
        guessGame
          .connect(addr1)
          .submitPredictions(answers, { value: ethers.parseEther("1") })
      ).to.be.revertedWith("Level already completed");
    });
  });

  describe("Withdraw Stake", function () {
    it("Should allow a user to withdraw their stake after results are generated", async function () {
      const answers = Array(10).fill(0);
      await guessGame
        .connect(addr1)
        .submitPredictions(answers, { value: ethers.parseEther("1") });
      await guessGame.connect(owner).finishGame();
      await guessGame.connect(addr1).withdrawStake();
      const player = await guessGame.getPlayerDetails(addr1.address);
      expect(player.stakedAmount).to.equal(0);
    });

    it("Should not allow a user to withdraw their stake before results are generated", async function () {
      const answers = Array(10).fill(0);
      await guessGame
        .connect(addr1)
        .submitPredictions(answers, { value: ethers.parseEther("1") });
      await expect(guessGame.connect(addr1).withdrawStake()).to.be.not.reverted;
    });

    // it("Should check if user actually received their money", async function () {
    //   const answers = Array(10).fill(0);
    //   await guessGame
    //     .connect(addr1)
    //     .submitPredictions(answers, { value: ethers.parseEther("1") });
    //     const initialBalance = await ethers.provider.getBalance(addr1.address);
    //   await guessGame.connect(owner).finishGame();
    //   await guessGame.connect(addr1).withdrawStake();
    // await guessGame.connect(addr1).withdrawStake();
    // const finalBalance = await ethers.provider.getBalance(addr1.address);
    // expect(finalBalance).to.be.above(initialBalance);
    // });
  });

  describe("Finish Game", function () {
    it("Should allow the owner to finish the game", async function () {
      await guessGame.connect(owner).finishGame();
      expect(await guessGame.currentGameId()).to.equal(2);
    });

    it("Should not allow non-owners to finish the game", async function () {
      await expect(guessGame.connect(addr1).finishGame()).to.be.revertedWith(
        "Only owner can call this"
      );
    });
  });

  describe("Get Player Details", function () {
    it("should check if user details is return", async function () {
        const answers = Array(10).fill(0);
      await guessGame
        .connect(addr1)
        .submitPredictions(answers, { value: ethers.parseEther("1") });
        await guessGame.connect(addr2).submitPredictions(answers, {value: ethers.parseEther("1")});

        const getDetails = await guessGame.getPlayerDetails(addr2.address);
        console.log({getDetails})
    })
  })
});
