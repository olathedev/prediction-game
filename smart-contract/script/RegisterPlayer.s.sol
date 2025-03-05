// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Script.sol";
import "../src/Game.sol";

contract RegisterPlayerScript is Script {
    function run() external {
        uint256 privateKey = vm.envUint("PRIVATE_KEY");
        // Remove vm.deal since we're on testnet and need real funds
        vm.startBroadcast(privateKey);

        // Use the deployed contract address from your environment
        PredictionGame game = PredictionGame(vm.envAddress("GAME_ADDRESS"));
        string memory username = "player123";
        game.setUsername(username);

        console.log("Player registered with username:", username);
        vm.stopBroadcast();
    }
}
