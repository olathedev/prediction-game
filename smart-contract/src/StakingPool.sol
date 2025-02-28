// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";  
import "./lib/Error.sol";
import "./lib/Event.sol";

contract StakingPool is ReentrancyGuard {
     IERC20 public coreToken;
     address public owner;

     struct Stake {
         uint256 amount;
         uint256 timestamp;
     }

     struct Pool {
        bool isLocked;
        uint256 totalStaked;
        uint256 expireTime;
        uint256 stakersCount;
     }

    uint poolId;
    mapping(uint poolId => Pool) private pools;
    mapping(uint poolId => mapping(address => Stake)) private stakes;

    constructor(address _coreToken) {
        coreToken = IERC20(_coreToken);
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, Errors.NotTheOwner());
        _;
    }

     function createPool(address _stakingToken, uint _expireTime) external onlyOwner {
        if (_stakingToken == address(0)) revert Errors.InvalidAddress();
        if (_expireTime <= 0) revert Errors.LessThanZero();

        IERC20 stakingToken = IERC20(_stakingToken);
        if (stakingToken.totalSupply() <= 0) revert Errors.InvalidTokenSupply();

        poolId++;
        pools[poolId] = Pool({
            isLocked: false,
            totalStaked: 0,
            stakersCount: 0,
            expireTime: _expireTime
        });
    }

    function stake(uint _poolId, uint _amount) external {
        if (_amount <= 0) revert Errors.LessThanZero();
        if (pools[_poolId].isLocked) revert Errors.InvalidPool();
        if (pools[_poolId].expireTime < block.timestamp) revert Errors.ExpiredPool();
        if (coreToken.balanceOf(msg.sender) < _amount) revert Errors.InsufficientFunds();

        if (stakes[_poolId][msg.sender].amount > 0) revert Errors.HasStaked();

        coreToken.transferFrom(msg.sender, address(this), _amount);
        stakes[_poolId][msg.sender] = Stake({
            amount: _amount,
            timestamp: block.timestamp
        });
        pools[_poolId].totalStaked += _amount;
        pools[_poolId].stakersCount++;
    }

}