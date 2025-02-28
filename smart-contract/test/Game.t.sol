// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test, console} from "forge-std/Test.sol";
import "../src/Game.sol";
import "../src/lib/Errors.sol";

contract GameTest is Test {
    Game gameContract;

    address user = address(1);

    struct Player {
        address playerAddress;
        string username;
        uint256 totalPoints;
        uint256 correctPredictions;
        uint256 totalPredictions;
    }

    function setUp() public {
        gameContract = new Game();
    }

    function test_deploy_contract_successfully() public view {
        address owner = gameContract.owner();
        assertEq(owner, address(this));
    }

    function test_fail_if_invalidusername() public {
        vm.expectRevert(Errors.UsernameCannotBeEmpty.selector);
        gameContract.createPlayer("");
    }

    function test_create_player_successfully() public {
        vm.prank(user);
        gameContract.createPlayer("test");

        (address playerAddress, string memory username, uint256 totalPoints, uint256 correctPredictions, uint256 totalPredictions) = gameContract.players(user);

        assertEq(playerAddress, user);
        assertEq(username, "test");
        assertEq(totalPoints, 0);
        assertEq(correctPredictions, 0);
        assertEq(totalPredictions, 0);
    }
}
