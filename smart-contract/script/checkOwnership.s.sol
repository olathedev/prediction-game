// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Script.sol";
import "../src/Game.sol";

contract CheckOwnerScript is Script {
    function run() external view {
        Game game = Game(vm.envAddress("GAME_ADDRESS"));
        address owner = game.owner();
        console.log("Contract owner:", owner);
    }
}
