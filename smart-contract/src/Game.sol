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

    struct PredictPool {
        uint roiYes;
        uint roiNo;
        uint totalAmount;
        uint deadline;
        Answer correctAnswer;
        mapping(address => uint) stakes;
        mapping(address => Answer) answer;
    }

    uint totalPools;

    mapping(uint => PredictPool) public matchPools;

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Game: only owner can call this function");
        _;
    }

    modifier onlyPlayer() {
        require(
            players[msg.sender].playerAddress == msg.sender,
            "Game: only player can call this function"
        );
        _;
    }

    function createPlayer(string memory _username) external {
        if (bytes(_username).length == 0) {
            revert Errors.UsernameCannotBeEmpty();
        }
        // verify that username does not exist
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
        PredictPool storage pool = matchPools[totalPools];
        pool.roiYes = _roiYes;
        pool.roiNo = _roiNo;
        pool.deadline = deadline;

        emit Events.MatchCreated(totalPools, _roiYes, _roiNo, deadline);
    }

    function predict(uint _poolId, Answer _answer) external payable onlyPlayer() {
        PredictPool storage pool = matchPools[_poolId];
        if (pool.deadline < block.timestamp) {
            revert Errors.InvalidDeadline();
        }
        if (_answer == Answer.None) {
            revert Errors.InvalidAnswer();
        }
        if (msg.value == 0) {
            revert Errors.InvalidStake();
        }
        if (_poolId == 0 || _poolId > totalPools) {
            revert Errors.InvalidPoolId();
        }

        pool.stakes[msg.sender] += msg.value;
        pool.totalAmount += msg.value;
        pool.answer[msg.sender] = _answer;
        players[msg.sender].totalPredictions++;
    }

    function getPlayerDetails(address _playerAddress)
        external
        view
        returns (Player memory)
    {
        return players[_playerAddress];
    }
    function updateCorrectAnswer(
        uint _poolId,
        Answer _answer
    ) external onlyOwner {
        PredictPool storage pool = matchPools[_poolId];
        if (_answer == Answer.None) {
            revert Errors.InvalidAnswer();
        }
        pool.correctAnswer = _answer;

        emit Events.AnswerSet(_poolId, uint(_answer));
    }

    function getPoolDetails(
        uint _poolId
    )
        external
        view
        returns (
            uint roiYes,
            uint roiNo,
            uint totalAmount,
            uint deadline,
            Answer correctAnswer
        )
    {
        PredictPool storage pool = matchPools[_poolId];
        return (
            pool.roiYes,
            pool.roiNo,
            pool.totalAmount,
            pool.deadline,
            pool.correctAnswer
        );
    }
}
