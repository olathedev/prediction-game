// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Script.sol";
import "../src/Game.sol";

contract PredictScript is Script {
    function run() external {
        uint256 privateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(privateKey);

        Game game = Game(vm.envAddress("GAME_ADDRESS"));
        uint poolId = 1;
        // Using the enum from the contract: 1 for Yes, 2 for No.
        Game.Answer answer = Game.Answer.Yes; 
        uint stake = 0.01 ether;

        game.predict{value: stake}(poolId, answer);
        console.log("Prediction made for Pool:", poolId);
        console.log("Answer:", uint(answer));
        console.log("Stake:", stake);

        vm.stopBroadcast();
    }
}
