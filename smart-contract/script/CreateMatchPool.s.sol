// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Script.sol";
import "../src/Game.sol";

contract CreateMatchPoolScript is Script {
    function run() external {
        uint256 privateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(privateKey);

        Game game = Game(vm.envAddress("GAME_ADDRESS"));
        uint roiYes = 120;
        uint roiNo = 80;
        uint deadlineInDays = 5; // days until deadline

        game.createMatchPool(roiYes, roiNo, deadlineInDays);
        console.log("Match pool created");
        console.log("ROI Yes:", roiYes);
        console.log("ROI No:", roiNo);
        console.log("Deadline (days):", deadlineInDays);

        vm.stopBroadcast();
    }
}
