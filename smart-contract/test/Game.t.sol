// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test, console} from "forge-std/Test.sol";
import '../src/Game.sol';

contract GameTest is Test {
    Game gameContract;

    function setUp() public {
        gameContract = new Game();
    }

    function test_deploy_contract_successfully() public view {
        address owner = gameContract.owner();
        assertEq(owner, address(this));
    }

}