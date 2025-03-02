// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Test.sol";
import "../src/Game.sol";

contract PredictionGameTest is Test {
    PredictionGame game;
    address owner = address(this); // Set test contract as owner
    address player1 = address(0x1);
    address player2 = address(0x2);

    event UsernameSet(address indexed player, string username);
    event QuestionCreated(
        uint256 indexed questionId,
        string text,
        uint256 duration,
        uint256 resolutionWindow,
        uint256 timeLimit
    );
    event PredictionSubmitted(
        address indexed player,
        uint256 indexed questionId,
        uint256 answer,
        uint256 stake
    );
    event QuestionResolved(uint256 indexed questionId, uint256 correctAnswer);
    event RewardDistributed(address indexed player, uint256 reward);

    function setUp() public {
        game = new PredictionGame();
    }

    function testSetUsername() public {
        vm.prank(player1);
        vm.expectEmit(true, false, false, true);
        emit UsernameSet(player1, "Alice");
        game.setUsername("Alice");

        vm.prank(player2);
        vm.expectEmit(true, false, false, true);
        emit UsernameSet(player2, "Bob");
        game.setUsername("Bob");

        PredictionGame.Player memory p1 = game.getPlayerDetails(player1);
        PredictionGame.Player memory p2 = game.getPlayerDetails(player2);

        console.log("Player 1 Username: %s", p1.username);
        console.log("Player 2 Username: %s", p2.username);
    }

    function testCreateQuestion() public {
        string[4] memory options = ["A", "B", "C", "D"];
        uint256 duration = 1; // 1 hour
        uint256 resolutionWindow = 1; // 1 hour
        uint256 timeLimit = 10 minutes;

        vm.expectEmit(true, false, false, true);
        emit QuestionCreated(1, "What is Solidity?", duration, resolutionWindow, timeLimit);

        game.createQuestion("What is Solidity?", options, duration, resolutionWindow, timeLimit);

        (string memory text, , , , , , , ) = game.questions(1);
        console.log("Question 1: %s", text);
    }

    function testPredict() public {
        string[4] memory options = ["A", "B", "C", "D"];
        game.createQuestion("What is Solidity?", options, 1, 1, 10 minutes);

        vm.prank(player1);
        vm.deal(player1, 1 ether);
        vm.expectEmit(true, false, false, true);
        emit PredictionSubmitted(player1, 1, 2, 1 ether);
        game.predict{value: 1 ether}(1, 2);

        vm.prank(player2);
        vm.deal(player2, 1 ether);
        vm.expectEmit(true, false, false, true);
        emit PredictionSubmitted(player2, 1, 3, 1 ether);
        game.predict{value: 1 ether}(1, 3);

        (,,,,, uint256 totalStakes,,) = game.questions(1);
        console.log("Total stakes: %d wei", totalStakes);
    }

    function testResolveQuestion() public {
        string[4] memory options = ["A", "B", "C", "D"];
        game.createQuestion("What is Solidity?", options, 1, 1, 10 minutes);

        vm.prank(player1);
        vm.deal(player1, 1 ether);
        game.predict{value: 1 ether}(1, 2);

        vm.prank(player2);
        vm.deal(player2, 1 ether);
        game.predict{value: 1 ether}(1, 3);

        vm.warp(block.timestamp + 2 hours); // Simulate time passing

        vm.expectEmit(true, false, false, true);
        emit QuestionResolved(1, 2);
        game.resolveQuestion(1, 2);

        PredictionGame.Player memory p1 = game.getPlayerDetails(player1);
        PredictionGame.Player memory p2 = game.getPlayerDetails(player2);

        console.log("Player 1 Points: %d", p1.totalPoints);
        console.log("Player 2 Points: %d", p2.totalPoints);
    }
}
