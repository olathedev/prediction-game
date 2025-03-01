// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Script.sol";
import "../src/Game.sol";

contract GetPoolDetailsScript is Script {
    function run() external view {
        Game game = Game(vm.envAddress("GAME_ADDRESS"));
        uint poolId = 1;
        (
            uint totalAmount,
            uint deadline,
            Game.Answer correctAnswer
        ) = game.getPoolDetails(poolId);

        console.log("Pool Details:");
        console.log("Total Amount:", totalAmount);
        console.log("Deadline:", deadline);
        console.log("Correct Answer (enum):", uint(correctAnswer));
    }
}
