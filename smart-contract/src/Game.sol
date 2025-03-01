// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "./lib/Errors.sol";
import "./lib/Events.sol";
import "./ContextMixin.sol";

contract Game {
    uint constant BONUS_MULTIPLIER = 500;

    struct Player {
        address playerAddress;
        string username;
        uint256 totalPoints;
        uint256 correctPredictions;
        uint256 totalPredictions;
    }

    mapping(address => Player) public players;
    address public owner;

    enum Answer { None, Yes, No }

    struct PredictPool {
        uint totalAmount;
        uint deadline;
        Answer correctAnswer;
        mapping(address => uint) stakes;
        mapping(address => Answer) answer;
        address[] participants;
    }

    uint public totalPools;
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

    function createMatchPool(uint _deadline) external onlyOwner {
        if (_deadline <= 0) {
            revert Errors.InvalidDeadline();
        }
        uint deadline = block.timestamp + (_deadline * 1 days);
        totalPools++;
        PredictPool storage pool = matchPools[totalPools];
        pool.deadline = deadline;
        pool.correctAnswer = Answer.None;
        pool.totalAmount = 0;
        emit Events.MatchCreated(totalPools, deadline);
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

    function predict(uint _poolId, Answer _answer) external payable onlyPlayer {
        if (_poolId == 0 || _poolId > totalPools) {
            revert Errors.InvalidPoolId();
        }
        PredictPool storage pool = matchPools[_poolId];
        if (block.timestamp > pool.deadline) {
            revert Errors.InvalidDeadline();
        }
        if (_answer == Answer.None) {
            revert Errors.InvalidAnswer();
        }
        if (msg.value == 0) {
            revert Errors.InvalidStake();
        }
        if (pool.answer[msg.sender] != Answer.None) {
            revert Errors.AlreadyPredicted();
        }
        pool.stakes[msg.sender] = msg.value;
        pool.answer[msg.sender] = _answer;
        pool.totalAmount += msg.value;
        pool.participants.push(msg.sender);
        players[msg.sender].totalPredictions++;
    }

    function getPlayerDetails(address _playerAddress) external view returns (Player memory) {
        return players[_playerAddress];
    }

    function updateCorrectAnswer(uint _poolId, Answer _answer) external onlyOwner {
        if (_poolId == 0 || _poolId > totalPools) {
            revert Errors.InvalidPoolId();
        }
        PredictPool storage pool = matchPools[_poolId];
        if (_answer == Answer.None) {
            revert Errors.InvalidAnswer();
        }
        pool.correctAnswer = _answer;
        emit Events.AnswerSet(_poolId, uint(_answer));
    }

    function distributeRewards(uint _poolId) external onlyOwner {
        if (_poolId == 0 || _poolId > totalPools) {
            revert Errors.InvalidPoolId();
        }
        PredictPool storage pool = matchPools[_poolId];
        if (pool.correctAnswer == Answer.None) {
            revert Errors.AnswerNotSet();
        }
        if (pool.totalAmount == 0) {
            revert Errors.NoFundsInPool();
        }
        uint bonusPool = pool.totalAmount * BONUS_MULTIPLIER;
        for (uint i = 0; i < pool.participants.length; i++) {
            address participant = pool.participants[i];
            uint stake = pool.stakes[participant];
            (bool sent, ) = payable(participant).call{value: stake}("");
            require(sent, "Transfer failed");
            if (pool.answer[participant] == pool.correctAnswer) {
                uint bonusPoints = (stake * bonusPool) / pool.totalAmount;
                players[participant].totalPoints += bonusPoints;
                players[participant].correctPredictions++;
            }
        }
    }

    function getPoolDetails(uint _poolId)
        external
        view
        returns (uint totalAmount, uint deadline, Answer correctAnswer)
    {
        if (_poolId == 0 || _poolId > totalPools) {
            revert Errors.InvalidPoolId();
        }
        PredictPool storage pool = matchPools[_poolId];
        return (pool.totalAmount, pool.deadline, pool.correctAnswer);
    }
}
