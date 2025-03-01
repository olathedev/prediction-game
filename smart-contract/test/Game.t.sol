// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Test.sol";
import "../src/Game.sol";

contract GameTest is Test {
    Game game;
    address owner = address(this);
    address alice = address(0x1);
    address bob = address(0x2);

    function setUp() public {
        game = new Game();
        vm.deal(alice, 100 ether);
        vm.deal(bob, 100 ether);
    }

    function testCreatePlayer() public {
        vm.prank(alice);
        game.createPlayer("Alice");
        Game.Player memory playerAlice = game.getPlayerDetails(alice);
        assertEq(playerAlice.totalPoints, 0);
        assertEq(playerAlice.correctPredictions, 0);
        assertEq(playerAlice.totalPredictions, 0);
        assertEq(keccak256(bytes(playerAlice.username)), keccak256(bytes("Alice")));
    }

    function testCreateMatchPool() public {
        game.createMatchPool(1);
        (uint totalAmount, uint deadline, Game.Answer correctAnswer) = game.getPoolDetails(1);
        assertEq(totalAmount, 0);
        assertTrue(deadline > block.timestamp);
        assertEq(uint(correctAnswer), uint(Game.Answer.None));
    }

    function testPredictAndAlreadyPredicted() public {
        game.createMatchPool(1);
        vm.prank(alice);
        game.createPlayer("Alice");
        vm.prank(alice);
        game.predict{value: 1 ether}(1, Game.Answer.Yes);
        vm.prank(alice);
        vm.expectRevert();
        game.predict{value: 1 ether}(1, Game.Answer.No);
    }

    function testInvalidStake() public {
        game.createMatchPool(1);
        vm.prank(alice);
        game.createPlayer("Alice");
        vm.prank(alice);
        vm.expectRevert();
        game.predict{value: 0}(1, Game.Answer.Yes);
    }

    function testPredictAfterDeadline() public {
        game.createMatchPool(1);
        vm.prank(alice);
        game.createPlayer("Alice");
        vm.prank(alice);
        game.predict{value: 1 ether}(1, Game.Answer.Yes);
        ( , uint deadline, ) = game.getPoolDetails(1);
        vm.warp(deadline + 1);
        vm.prank(bob);
        vm.expectRevert();
        game.predict{value: 1 ether}(1, Game.Answer.No);
    }

    function testUpdateCorrectAnswerAndDistributeRewards() public {
        game.createMatchPool(1);
        vm.prank(alice);
        game.createPlayer("Alice");
        vm.prank(bob);
        game.createPlayer("Bob");
        vm.prank(alice);
        game.predict{value: 2 ether}(1, Game.Answer.Yes);
        vm.prank(bob);
        game.predict{value: 1 ether}(1, Game.Answer.No);
        game.updateCorrectAnswer(1, Game.Answer.Yes);
        game.distributeRewards(1);
        Game.Player memory alicePlayer = game.getPlayerDetails(alice);
        Game.Player memory bobPlayer = game.getPlayerDetails(bob);
        uint expectedBonusAlice = (2 ether * (3 ether * 500)) / (3 ether);
        uint expectedBonusBob = 0;
        assertEq(alicePlayer.totalPoints, expectedBonusAlice);
        assertEq(bobPlayer.totalPoints, expectedBonusBob);
    }

    function testRewardDistribution() public {
        game.createMatchPool(1);
        vm.prank(alice);
        game.createPlayer("Alice");
        vm.prank(bob);
        game.createPlayer("Bob");
        vm.prank(alice);
        game.predict{value: 2 ether}(1, Game.Answer.Yes);
        vm.prank(bob);
        game.predict{value: 1 ether}(1, Game.Answer.Yes);
        game.updateCorrectAnswer(1, Game.Answer.Yes);
        game.distributeRewards(1);
        Game.Player memory alicePlayer = game.getPlayerDetails(alice);
        Game.Player memory bobPlayer = game.getPlayerDetails(bob);
        uint expectedBonusAlice = (2 ether * (3 ether * 500)) / (3 ether);
        uint expectedBonusBob = (1 ether * (3 ether * 500)) / (3 ether);
        assertEq(alicePlayer.totalPoints, expectedBonusAlice);
        assertEq(bobPlayer.totalPoints, expectedBonusBob);
    }
}
