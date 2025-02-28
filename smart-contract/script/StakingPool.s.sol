// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {StakingPool} from "../src/StakingPool.sol";

contract StakingPoolScript is Script  {
    function run() public returns (StakingPool) {
        address coreDaoAddress = 0xf66Cd2f8755a21d3c8683a10269F795c0532Dd58;
        vm.startBroadcast();
        StakingPool stakingPool = new StakingPool(coreDaoAddress);
        vm.stopBroadcast(); 
        return stakingPool;       
    }
}