// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test, console2} from "forge-std/Test.sol";
import {StakingPool} from "../src/StakingPool.sol";
import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {StakingPoolScript} from "../script/StakingPool.s.sol";

contract MockERC20 is ERC20 {
    constructor() ERC20("MockToken", "MTK") {
        _mint(msg.sender, 1000000 * 10 ** 18);
    }
}

contract StakingPoolTest is Test {
    StakingPool stakingPool;
    MockERC20 coreToken;
    address public owner;
    address public USER1;
    address public USER2;

    function setUp() public {
        owner = msg.sender;
        USER1 = address(0x1234);
        USER2 = address(0x5678);
        StakingPoolScript deploy = new StakingPoolScript();
        stakingPool = deploy.run();
        coreToken = new MockERC20();
        console2.log("StakingPoolTest beforeAll");
    }

    function testCreatePool() public view {
        address stakingOwner = stakingPool.owner();
        assertEq(owner, stakingOwner);
    }

    function testOnlyOwnerCanCreatePool() public {
        vm.prank(owner);
        stakingPool.createPool((address(coreToken)), block.timestamp + 2 days);

        vm.prank(USER1);
        vm.expectRevert();
        stakingPool.createPool((address(coreToken)), block.timestamp + 2 days);
    }

//     function testStake() public {

//     }
}
