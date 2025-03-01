// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "./lib/Errors.sol";
import "./lib/Events.sol";
import "./ContextMixin.sol";

contract PredictionGame {
    address public owner;
    uint256 public constant QUESTIONS_PER_GAME = 10;
    uint256 public constant MAX_OPTIONS = 4;

    // Player structure with enhanced tracking
    struct Player {
        address playerAddress;
        string username;
        uint256 totalPoints;
        uint256 totalCorrect;
        uint256 currentStreak;
        Prediction[] predictionHistory;
    }

    // Question structure with multiple options
    struct Question {
        string text;
        string[MAX_OPTIONS] options;
        uint256 correctAnswer; // 1-4 (index+1)
        uint256 createdAt;
        uint256 deadline;
        bool resolved;
        uint256 totalStakes;
        mapping(address => uint256) stakes;
        mapping(address => uint256) answers; // Stores player answers (1-4)
        address[] participants;
    }

    // Reward tier structure
    struct RewardTier {
        uint256 minCorrect;
        uint256 multiplier;
        string tierName;
    }

    // Prediction history tracking
    struct Prediction {
        uint256 questionId;
        uint256 answer;
        bool correct;
        uint256 timestamp;
    }

    RewardTier[] public rewardTiers;
    mapping(uint256 => Question) public questions;
    mapping(address => Player) public players;
    address[] public allPlayers;
    uint256 public currentQuestionId;

    // Leaderboard tracking
    address[] public leaderboard;
    uint256 public lastLeaderboardUpdate;

    constructor() {
        owner = msg.sender;
        currentQuestionId = 1;
        
        // Initialize reward tiers
        rewardTiers.push(RewardTier(9, 300, "Grandmaster"));
        rewardTiers.push(RewardTier(7, 200, "Master"));
        rewardTiers.push(RewardTier(5, 150, "Expert"));
        rewardTiers.push(RewardTier(3, 100, "Intermediate"));
        rewardTiers.push(RewardTier(1, 50, "Novice"));
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Game: only owner can call this function");
        _;
    }

    modifier validQuestion(uint256 questionId) {
        require(questionId > 0 && questionId <= currentQuestionId, "Invalid question ID");
        _;
    }

    /// @notice Creates a new prediction question with multiple choices
    /// @param text The question text
    /// @param options Array of possible answers (2-4 options)
    /// @param duration Duration in hours for predictions
    function createQuestion(
        string memory text,
        string[MAX_OPTIONS] memory options,
        uint256 duration
    ) external onlyOwner {
        require(bytes(text).length > 0, "Question text required");
        require(duration > 0, "Duration must be positive");
        
        Question storage q = questions[currentQuestionId];
        q.text = text;
        q.options = options;
        q.createdAt = block.timestamp;
        q.deadline = block.timestamp + (duration * 1 hours);
        
        emit Events.QuestionCreated(currentQuestionId, text, duration);
        currentQuestionId++;
    }

    /// @notice Submit prediction for a question
    /// @param questionId ID of the question to predict
    /// @param answer The selected answer (1-4)
    function predict(uint256 questionId, uint256 answer) external payable validQuestion(questionId) {
        Question storage q = questions[questionId];
        require(block.timestamp < q.deadline, "Prediction period ended");
        require(answer > 0 && answer <= MAX_OPTIONS, "Invalid answer");
        require(q.answers[msg.sender] == 0, "Already predicted");
        require(msg.value > 0, "Stake required");

        // Initialize player if new
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

    /// @notice Resolve question with random answer (AI simulation)
    /// @param questionId ID of the question to resolve
    function resolveQuestion(uint256 questionId) external onlyOwner validQuestion(questionId) {
        Question storage q = questions[questionId];
        require(block.timestamp >= q.deadline, "Deadline not reached");
        require(!q.resolved, "Already resolved");

        // Generate pseudo-random answer (For prototype only - use oracle in production)
        bytes32 random = keccak256(abi.encodePacked(blockhash(block.number-1), questionId));
        q.correctAnswer = (uint256(random) % MAX_OPTIONS) + 1;
        q.resolved = true;

        // Update player stats and leaderboard
        _updateScores(questionId);
        _updateLeaderboard();

        emit Events.QuestionResolved(questionId, q.correctAnswer);
    }

    /// @notice Get detailed player information
    /// @param playerAddress Address to look up
    function getPlayerDetails(address playerAddress) public view returns (Player memory) {
        return players[playerAddress];
    }

    /// @notice Get current leaderboard
    function getLeaderboard() public view returns (address[] memory, uint256[] memory) {
        address[] memory sorted = new address[](leaderboard.length);
        uint256[] memory scores = new uint256[](leaderboard.length);
        
        for (uint i = 0; i < leaderboard.length; i++) {
            sorted[i] = leaderboard[i];
            scores[i] = players[leaderboard[i]].totalPoints;
        }
        
        return (sorted, scores);
    }

    // Internal function to update scores and rewards
    function _updateScores(uint256 questionId) internal {
        Question storage q = questions[questionId];
        uint256 totalCorrect;
        
        // First pass to count correct answers
        for (uint i = 0; i < q.participants.length; i++) {
            address participant = q.participants[i];
            if (q.answers[participant] == q.correctAnswer) {
                totalCorrect++;
            }
        }

        // Second pass to distribute rewards
        for (uint i = 0; i < q.participants.length; i++) {
            address participant = q.participants[i];
            
            if (q.answers[participant] == q.correctAnswer) {
                Player storage p = players[participant];
                uint256 baseReward = q.stakes[participant];
                uint256 tierMultiplier = _getTierMultiplier(p.totalCorrect);
                uint256 reward = baseReward * tierMultiplier / 100;

                p.totalCorrect++;
                p.currentStreak++;
                p.totalPoints += reward;
                p.predictionHistory.push(Prediction({
                    questionId: questionId,
                    answer: q.answers[participant],
                    correct: true,
                    timestamp: block.timestamp
                }));

                // Send back stake plus reward
                payable(participant).transfer(q.stakes[participant] + reward);
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

    // Internal function to determine reward tier
    function _getTierMultiplier(uint256 totalCorrect) internal view returns (uint256) {
        for (uint i = 0; i < rewardTiers.length; i++) {
            if (totalCorrect >= rewardTiers[i].minCorrect) {
                return rewardTiers[i].multiplier;
            }
        }
        return 50; // Default novice tier
    }

    // Internal function to update leaderboard
    function _updateLeaderboard() internal {
        // Simple bubble sort for demonstration (optimize for production)
        for (uint i = 0; i < allPlayers.length; i++) {
            for (uint j = i+1; j < allPlayers.length; j++) {
                if (players[allPlayers[i]].totalPoints < players[allPlayers[j]].totalPoints) {
                    address temp = allPlayers[i];
                    allPlayers[i] = allPlayers[j];
                    allPlayers[j] = temp;
                }
            }
        }
        
        // Keep top 100 players
        if (allPlayers.length > 100) {
            for (uint i = 100; i < allPlayers.length; i++) {
                delete allPlayers[i];
            }
        }
        
        leaderboard = allPlayers;
        lastLeaderboardUpdate = block.timestamp;
    }

    /// @notice Get question details
    /// @param questionId ID of the question to query
    function getQuestionDetails(uint256 questionId) public view validQuestion(questionId) 
        returns (
            string memory text,
            string[MAX_OPTIONS] memory options,
            uint256 deadline,
            uint256 totalStakes,
            bool resolved
        )
    {
        Question storage q = questions[questionId];
        return (q.text, q.options, q.deadline, q.totalStakes, q.resolved);
    }
}