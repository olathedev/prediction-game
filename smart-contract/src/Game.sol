// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "./lib/Errors.sol";
import "./lib/Events.sol";
import "./ContextMixin.sol";

contract PredictionGame {
    address public owner;
    uint256 public constant QUESTIONS_PER_GAME = 10;
    uint256 public constant MAX_OPTIONS = 4;

    struct Player {
        address playerAddress;
        string username;
        uint256 totalPoints;
        uint256 totalCorrect;
        uint256 currentStreak;
        Prediction[] predictionHistory;
    }

    struct Question {
        string text;
        string[MAX_OPTIONS] options;
        uint256 correctAnswer;
        uint256 createdAt;
        uint256 deadline;
        uint256 resolveBy;
        bool resolved;
        uint256 totalStakes;
        mapping(address => uint256) stakes;
        mapping(address => uint256) answers;
        address[] participants;
    }

    struct Prediction {
        uint256 questionId;
        uint256 answer;
        bool correct;
        uint256 timestamp;
    }

    mapping(uint256 => Question) public questions;
    mapping(address => Player) public players;
    address[] public allPlayers;
    uint256 public currentQuestionId;
    address[] public leaderboard;
    uint256 public lastLeaderboardUpdate;

    constructor() {
        owner = msg.sender;
        currentQuestionId = 1;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Game: only owner can call this function");
        _;
    }

    modifier validQuestion(uint256 questionId) {
        require(questionId > 0 && questionId <= currentQuestionId, "Invalid question ID");
        _;
    }

    function createQuestion(
        string memory text,
        string[MAX_OPTIONS] memory options,
        uint256 duration,
        uint256 resolutionWindow
    ) external onlyOwner {
         if (bytes(text).length == 0) revert Errors.EmptyQuestionText();
        if (duration == 0) revert Errors.InvalidDuration();
        if (resolutionWindow == 0) revert Errors.InvalidResolutionWindow();
        
        Question storage q = questions[currentQuestionId];
        q.text = text;
        q.options = options;
        q.createdAt = block.timestamp;
        q.deadline = block.timestamp + (duration * 1 hours);
        q.resolveBy = q.deadline + (resolutionWindow * 1 hours);
        
        emit Events.QuestionCreated(currentQuestionId, text, duration, resolutionWindow);
        currentQuestionId++;
    }

    function predict(uint256 questionId, uint256 answer) external payable validQuestion(questionId) {
               Question storage q = questions[questionId];
        if (block.timestamp >= q.deadline) revert Errors.PredictionPeriodEnded();
        if (answer == 0 || answer > MAX_OPTIONS) revert Errors.InvalidAnswer();
        if (q.answers[msg.sender] != 0) revert Errors.AlreadyPredicted();
        if (msg.value == 0) revert Errors.InvalidStake();

        if (players[msg.sender].playerAddress == address(0)) {
            players[msg.sender].playerAddress = msg.sender;
            allPlayers.push(msg.sender);
        }

        q.answers[msg.sender] = answer;
        q.stakes[msg.sender] = msg.value;
        q.totalStakes += msg.value;
        q.participants.push(msg.sender);

        emit Events.PredictionSubmitted(msg.sender, questionId, answer);
    }

    function resolveQuestion(uint256 questionId, uint256 correctAnswer) external onlyOwner validQuestion(questionId) {
     Question storage q = questions[questionId];
        if (block.timestamp < q.deadline) revert Errors.DeadlineNotReached();
        if (block.timestamp > q.resolveBy) revert Errors.ResolutionWindowExpired();
        if (q.resolved) revert Errors.ResultAlreadySet();
        if (correctAnswer == 0 || correctAnswer > MAX_OPTIONS) revert Errors.InvalidAnswer();

        q.correctAnswer = correctAnswer;
        q.resolved = true;

        _updateScores(questionId);
        _updateLeaderboard();

        emit Events.QuestionResolved(questionId, correctAnswer);
    }

    function getPlayerDetails(address playerAddress) public view returns (Player memory) {
        return players[playerAddress];
    }

    function getLeaderboard() public view returns (address[] memory, uint256[] memory) {
        address[] memory sorted = new address[](leaderboard.length);
        uint256[] memory scores = new uint256[](leaderboard.length);
        
        for (uint i = 0; i < leaderboard.length; i++) {
            sorted[i] = leaderboard[i];
            scores[i] = players[leaderboard[i]].totalPoints;
        }
        
        return (sorted, scores);
    }

    function _updateScores(uint256 questionId) internal {
        Question storage q = questions[questionId];
        uint256 totalCorrect;
        uint256 totalCorrectStakes;

        for (uint i = 0; i < q.participants.length; i++) {
            address participant = q.participants[i];
            if (q.answers[participant] == q.correctAnswer) {
                totalCorrect++;
                totalCorrectStakes += q.stakes[participant];
            }
        }

        if (totalCorrect == 0) return;

        for (uint i = 0; i < q.participants.length; i++) {
            address participant = q.participants[i];
            
            if (q.answers[participant] == q.correctAnswer) {
                Player storage p = players[participant];
                uint256 stake = q.stakes[participant];
                uint256 reward = (stake * q.totalStakes) / totalCorrectStakes;

                p.totalCorrect++;
                p.currentStreak++;
                p.totalPoints += reward;
                p.predictionHistory.push(Prediction({
                    questionId: questionId,
                    answer: q.answers[participant],
                    correct: true,
                    timestamp: block.timestamp
                }));

                payable(participant).transfer(reward);
            } else {
                players[participant].currentStreak = 0;
                players[participant].predictionHistory.push(Prediction({
                    questionId: questionId,
                    answer: q.answers[participant],
                    correct: false,
                    timestamp: block.timestamp
                }));
            }
        }
    }

    function _updateLeaderboard() internal {
        for (uint i = 0; i < allPlayers.length; i++) {
            for (uint j = i+1; j < allPlayers.length; j++) {
                if (players[allPlayers[i]].totalPoints < players[allPlayers[j]].totalPoints) {
                    address temp = allPlayers[i];
                    allPlayers[i] = allPlayers[j];
                    allPlayers[j] = temp;
                }
            }
        }
        
        if (allPlayers.length > 100) {
            for (uint i = 100; i < allPlayers.length; i++) {
                delete allPlayers[i];
            }
        }
        
        leaderboard = allPlayers;
        lastLeaderboardUpdate = block.timestamp;
    }

    function getQuestionDetails(uint256 questionId) public view validQuestion(questionId) 
        returns (
            string memory text,
            string[MAX_OPTIONS] memory options,
            uint256 deadline,
            uint256 resolveBy,
            uint256 totalStakes,
            bool resolved
        )
    {
        Question storage q = questions[questionId];
        return (q.text, q.options, q.deadline, q.resolveBy, q.totalStakes, q.resolved);
    }
}