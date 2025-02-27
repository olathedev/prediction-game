// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;
import "./lib/Errors.sol";
import "./lib/Events.sol";

contract Game {
    struct Player {
        address playerAddress;
        string username;
        uint256 totalPoints;
        uint256 correctPredictions;
        uint256 totalPredictions;
    }

    mapping(address => Player) public players;

    address public owner;
    enum Answer {
        None,
        Yes,
        No
    }

    struct MatchPool {
        uint roiYes;
        uint roiNo;
        uint totalAmount;
        uint deadline;
        Answer correctAnswer;
        mapping(address => uint) stakes;
        mapping(address => Answer) answer;
    }

    uint totalPools;

    mapping(uint => MatchPool) public matchPools;

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Game: only owner can call this function");
        _;
    }

    function createPlayer(string memory _username) external {
        if (bytes(_username).length == 0) {
            revert Errors.UsernameCannotBeEmpty();
        }
        players[msg.sender] = Player({
            playerAddress: msg.sender,
            username: _username,
            totalPoints: 0,
            correctPredictions: 0,
            totalPredictions: 0
        });

        emit Events.PlayerRegistered(msg.sender, _username);
    }

    function createMatchPool(
        uint _roiYes,
        uint _roiNo,
        uint _deadline
    ) external onlyOwner {
        if (_roiYes == 0 || _roiNo == 0) {
            revert Errors.InvalidRoi();
        }
        if (_deadline == 0) {
            revert Errors.InvalidDeadline();
        }

        uint deadline = _deadline * 1 days + block.timestamp;

        totalPools++;
        MatchPool storage pool = matchPools[totalPools];
        pool.roiYes = _roiYes;
        pool.roiNo = _roiNo;
        pool.deadline = deadline;

        emit Events.MatchCreated(totalPools, _roiYes, _roiNo, deadline);
    }
}
