import { expect } from "chai";
import { ethers } from "hardhat";

describe("PredictionGame", function () {
  let PredictionGame: any;
  let predictionGame: any;
  let owner: any, player1: any, player2: any;

  beforeEach(async function () {
    [owner, player1, player2] = await ethers.getSigners();
    PredictionGame = await ethers.getContractFactory("PredictionGame");
    predictionGame = await PredictionGame.deploy();
  });

  it("should deploy the contract and set the owner", async function () {
    expect(await predictionGame.owner()).to.equal(owner.address);
  });

  it("should allow players to set usernames", async function () {
    await expect(predictionGame.connect(player1).setUsername("Alice"))
      .to.emit(predictionGame, "UsernameSet")
      .withArgs(player1.address, "Alice");

    await expect(predictionGame.connect(player2).setUsername("Bob"))
      .to.emit(predictionGame, "UsernameSet")
      .withArgs(player2.address, "Bob");

    const player1Data = await predictionGame.getPlayerDetails(player1.address);
    const player2Data = await predictionGame.getPlayerDetails(player2.address);

    console.log("Player 1 Username:", player1Data.username);
    console.log("Player 2 Username:", player2Data.username);

    expect(player1Data.username).to.equal("Alice");
    expect(player2Data.username).to.equal("Bob");
  });

  it("should allow the owner to create a question", async function () {
    const questionText = "What is Solidity?";
    const options = ["A", "B", "C", "D"];
    const duration = 1;
    const resolutionWindow = 1;
    const timeLimit = 600; // 10 minutes

    await expect(
      predictionGame.createQuestion(
        questionText,
        options,
        duration,
        resolutionWindow,
        timeLimit
      )
    )
      .to.emit(predictionGame, "QuestionCreated")
      .withArgs(1, questionText, duration, resolutionWindow, timeLimit);

    const question = await predictionGame.questions(1);
    console.log("Question:", question.text);
    expect(question.text).to.equal(questionText);
  });

  it("should allow players to make predictions", async function () {
    const options = ["A", "B", "C", "D"];
    await predictionGame.createQuestion(
      "What is Solidity?",
      options,
      1,
      1,
      600
    );

    await expect(
      predictionGame
        .connect(player1)
        .predict(1, 2, { value: ethers.parseEther("1") })
    )
      .to.emit(predictionGame, "PredictionSubmitted")
      .withArgs(player1.address, 1, 2, ethers.parseEther("1"));

    await expect(
      predictionGame
        .connect(player2)
        .predict(1, 3, { value: ethers.parseEther("1") })
    )
      .to.emit(predictionGame, "PredictionSubmitted")
      .withArgs(player2.address, 1, 3, ethers.parseEther("1"));

    const question = await predictionGame.questions(1);
    console.log("Total Stakes:", question.totalStakes.toString());
    expect(question.totalStakes).to.equal(ethers.parseEther("2"));
  });

  it("should allow the owner to resolve a question", async function () {
    const options = ["A", "B", "C", "D"];
    await predictionGame.createQuestion(
      "What is Solidity?",
      options,
      1,
      2,
      600
    ); // resolutionWindow = 2 hours

    await predictionGame
      .connect(player1)
      .predict(1, 2, { value: ethers.parseEther("1") });
    await predictionGame
      .connect(player2)
      .predict(1, 3, { value: ethers.parseEther("1") });

    // Fast-forward time **just past the deadline** but within the resolution window
    await ethers.provider.send("evm_increaseTime", [3600 + 300]); // 1 hour + 5 minutes (to ensure we are after the deadline but before expiration)
    await ethers.provider.send("evm_mine", []);

    await expect(predictionGame.resolveQuestion(1, 2))
      .to.emit(predictionGame, "QuestionResolved")
      .withArgs(1, 2);

    const player1Data = await predictionGame.getPlayerDetails(player1.address);
    const player2Data = await predictionGame.getPlayerDetails(player2.address);

    console.log("Player 1 Points:", player1Data.totalPoints.toString());
    console.log("Player 2 Points:", player2Data.totalPoints.toString());

    expect(player1Data.totalPoints).to.be.greaterThan(0);
    expect(player2Data.totalPoints).to.equal(0);
  });

  it("should update the leaderboard after resolving questions", async function () {
    const options = ["A", "B", "C", "D"];
    await predictionGame.createQuestion(
      "What is Solidity?",
      options,
      1,
      2,
      600
    );

    await predictionGame
      .connect(player1)
      .predict(1, 2, { value: ethers.parseEther("1") });
    await predictionGame
      .connect(player2)
      .predict(1, 3, { value: ethers.parseEther("1") });

    // Fast-forward time to be within the resolution window
    await ethers.provider.send("evm_increaseTime", [3600 + 300]); // 1 hour + 5 minutes
    await ethers.provider.send("evm_mine", []);

    await predictionGame.resolveQuestion(1, 2);

    const leaderboard = await predictionGame.getLeaderboard();
    console.log("Leaderboard:", leaderboard);

    expect(leaderboard[0][0]).to.equal(player1.address);
  });
});
