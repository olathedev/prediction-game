// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

contract PredictionGame {
    // State Variables
    address public owner;
    uint256 public constant QUESTIONS_PER_GAME = 10; // Max questions per game session
    uint256 public constant MAX_OPTIONS = 4; // Max options per question
    uint256 public constant POINTS_PER_CORRECT_ANSWER = 10; // Points for each correct prediction
    uint256 public constant STREAK_REWARD_POINTS = 50; // Points awarded for a streak
    uint256 public constant STREAK_LENGTH = 3; // Number of correct answers needed for a streak

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
        uint256 timeLimit; // Time limit for predictions (e.g., 10 seconds)
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

    // Events
    event QuestionCreated(uint256 questionId, string text, uint256 duration, uint256 resolutionWindow, uint256 timeLimit);
    event PredictionSubmitted(address player, uint256 questionId, uint256 answer, uint256 stakeAmount);
    event QuestionResolved(uint256 questionId, uint256 correctAnswer);
    event UsernameSet(address player, string username);
    event StreakReward(address player, uint256 streakLength, uint256 rewardPoints);
    event RewardDistributed(address player, uint256 rewardAmount);

    constructor() {
        owner = msg.sender;
        currentQuestionId = 1;
    }

    // Modifiers
    modifier onlyOwner() {
        require(msg.sender == owner, "Game: only owner can call this function");
        _;
    }

    modifier validQuestion(uint256 questionId) {
        require(questionId > 0 && questionId <= currentQuestionId, "Invalid question ID");
        _;
    }

    // Function to set username
    function setUsername(string memory _username) external {
        require(bytes(_username).length > 0, "Game: Username cannot be empty");

        // Ensure the username is unique
        for (uint i = 0; i < allPlayers.length; i++) {
            if (keccak256(bytes(players[allPlayers[i]].username)) == keccak256(bytes(_username))) {
                revert("Game: Username already taken");
            }
        }

        // Register player if new
        if (players[msg.sender].playerAddress == address(0)) {
            players[msg.sender].playerAddress = msg.sender;
            allPlayers.push(msg.sender);
        }

        // Set the username
        players[msg.sender].username = _username;
        emit UsernameSet(msg.sender, _username);
    }

    // Function to create a question (called by backend)
    function createQuestion(
        string memory text,
        string[MAX_OPTIONS] memory options,
        uint256 duration,
        uint256 resolutionWindow,
        uint256 timeLimit // Time limit for predictions (e.g., 10 seconds)
    ) external onlyOwner {
        require(currentQuestionId <= QUESTIONS_PER_GAME, "Game: Maximum questions reached");
        require(timeLimit > 0, "Game: Time limit must be greater than 0");

        Question storage q = questions[currentQuestionId];
        q.text = text;
        q.options = options;
        q.createdAt = block.timestamp;
        q.deadline = block.timestamp + (duration * 1 hours);
        q.resolveBy = q.deadline + (resolutionWindow * 1 hours);
        q.timeLimit = timeLimit;

        emit QuestionCreated(currentQuestionId, text, duration, resolutionWindow, timeLimit);
        currentQuestionId++;
    }

    // Function to predict (stake CORE tokens)
    function predict(uint256 questionId, uint256 answer) external payable validQuestion(questionId) {
        Question storage q = questions[questionId];
        require(block.timestamp < q.deadline, "Game: Prediction period ended");
        require(block.timestamp <= q.createdAt + q.timeLimit, "Game: Time limit for prediction expired");
        require(answer > 0 && answer <= MAX_OPTIONS, "Game: Invalid answer");
        require(q.answers[msg.sender] == 0, "Game: Already predicted");
        require(msg.value > 0, "Game: Invalid stake amount");

        // Register player if new
        if (players[msg.sender].playerAddress == address(0)) {
            players[msg.sender].playerAddress = msg.sender;
            allPlayers.push(msg.sender);
        }

        // Record prediction
        q.answers[msg.sender] = answer;
        q.stakes[msg.sender] = msg.value;
        q.totalStakes += msg.value;
        q.participants.push(msg.sender);

        emit PredictionSubmitted(msg.sender, questionId, answer, msg.value);
    }

    // Function to resolve a question (called by backend)
    function resolveQuestion(uint256 questionId, uint256 correctAnswer) external onlyOwner validQuestion(questionId) {
        Question storage q = questions[questionId];
        require(block.timestamp >= q.deadline, "Game: Deadline not reached");
        require(block.timestamp <= q.resolveBy, "Game: Resolution window expired");
        require(!q.resolved, "Game: Result already set");
        require(correctAnswer > 0 && correctAnswer <= MAX_OPTIONS, "Game: Invalid correct answer");

        q.correctAnswer = correctAnswer;
        q.resolved = true;

        _updateScores(questionId);
        _updateLeaderboard();

        emit QuestionResolved(questionId, correctAnswer);
    }

    // Internal function to update scores
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
            Player storage p = players[participant];

            if (q.answers[participant] == q.correctAnswer) {
                uint256 stake = q.stakes[participant];
                uint256 reward = (stake * q.totalStakes) / totalCorrectStakes;

                p.totalCorrect++;
                p.currentStreak++;

                // Award points for correct prediction
                p.totalPoints += POINTS_PER_CORRECT_ANSWER;

                // Check for streak reward
                if (p.currentStreak % STREAK_LENGTH == 0) {
                    p.totalPoints += STREAK_REWARD_POINTS;
                    emit StreakReward(participant, p.currentStreak, STREAK_REWARD_POINTS);
                }

                p.totalPoints += reward;
                p.predictionHistory.push(Prediction({
                    questionId: questionId,
                    answer: q.answers[participant],
                    correct: true,
                    timestamp: block.timestamp
                }));

                // Transfer reward in CORE tokens
                (bool success, ) = participant.call{value: reward}("");
                require(success, "Game: CORE transfer failed");
                emit RewardDistributed(participant, reward);
            } else {
                p.currentStreak = 0;
                p.predictionHistory.push(Prediction({
                    questionId: questionId,
                    answer: q.answers[participant],
                    correct: false,
                    timestamp: block.timestamp
                }));
            }
        }
    }

    // Internal function to update leaderboard
    function _updateLeaderboard() internal {
        // Sort players by points
        for (uint i = 0; i < allPlayers.length; i++) {
            for (uint j = i + 1; j < allPlayers.length; j++) {
                if (players[allPlayers[i]].totalPoints < players[allPlayers[j]].totalPoints) {
                    address temp = allPlayers[i];
                    allPlayers[i] = allPlayers[j];
                    allPlayers[j] = temp;
                }
            }
        }

        // Trim leaderboard to top 100
        if (allPlayers.length > 100) {
            for (uint i = 100; i < allPlayers.length; i++) {
                delete allPlayers[i];
            }
        }

        leaderboard = allPlayers;
        lastLeaderboardUpdate = block.timestamp;
    }

    // Function to get player details
    function getPlayerDetails(address playerAddress) public view returns (Player memory) {
        return players[playerAddress];
    }

    // Function to get leaderboard
    function getLeaderboard() public view returns (address[] memory, string[] memory, uint256[] memory) {
        address[] memory sorted = new address[](leaderboard.length);
        string[] memory usernames = new string[](leaderboard.length);
        uint256[] memory scores = new uint256[](leaderboard.length);

        for (uint i = 0; i < leaderboard.length; i++) {
            sorted[i] = leaderboard[i];
            usernames[i] = players[leaderboard[i]].username;
            scores[i] = players[leaderboard[i]].totalPoints;
        }

        return (sorted, usernames, scores);
    }
}