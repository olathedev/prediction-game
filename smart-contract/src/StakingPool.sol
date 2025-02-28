// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";  
import "./lib/Error.sol";
import "./lib/Event.sol";

contract StakingPool is ReentrancyGuard {
     IERC20 public coreToken;
     address owner;

     struct Stake {
         uint256 amount;
         uint256 timestamp;
     }

     struct Pool {
        bool isLocked;
        uint256 totalStaked;
     }

    uint poolId;
    mapping(uint poolId => Pool) private pools;
    mapping(uint poolId => mapping(address admin => Stake)) private stakes;

    constructor(address _coreToken) {
        coreToken = IERC20(_coreToken);
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, Errors.NotTheOwner());
        _;
    }

    function createPool() external {
        if 
        poolId++;
        pools[poolId] = Pool(false, 0);
    }

}