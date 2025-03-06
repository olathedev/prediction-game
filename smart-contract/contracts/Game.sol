// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

contract PredictionGame {
    address public owner;
    uint256 public constant QUESTIONS_PER_GAME = 10;
    uint256 public constant POINTS_PER_CORRECT_ANSWER = 100000;
    uint256 public constant POINTS_PER_WRONG_ANSWER = 20000;
    uint256 public constant STREAK_REWARD_POINTS = 50000;
    uint256 public constant STREAK_LENGTH = 3;
    uint256 public constant MIN_STAKE = 0.01 * 1e18;
    uint256 public currentGameId;

    struct Player {
        address playerAddress;
        string username;
        uint256 totalPoints;
        uint256 totalCorrect;
        uint256 currentStreak;
        uint256 stakedAmount;
        bool hasPlayed;
    }

    mapping(address => Player) public players;
    address[] public allPlayers;
    mapping(uint256 => mapping(address => uint256[QUESTIONS_PER_GAME]))
        public gamePredictions;
    mapping(uint256 => mapping(address => uint256[QUESTIONS_PER_GAME]))
        public gameAnswers;
    mapping(address => bool) public resultsGenerated;
    address[] public globalLeaderboard;

    event UsernameSet(address indexed player, string username);
    event PredictionsSubmitted(
        address indexed player,
        uint256[QUESTIONS_PER_GAME] answers
    );
    event ResultsGenerated(
        address indexed player,
        uint256[QUESTIONS_PER_GAME] correctAnswers
    );
    event PointsUpdated(
        address indexed player,
        uint256 totalCorrect,
        uint256 totalPoints
    );
    event GameFinished(uint256 gameId);

    constructor() {
        owner = msg.sender;
        currentGameId = 1;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this");
        _;
    }

    mapping(string => bool) public takenUsernames;

    function setUsername(string memory _username) external {
        require(bytes(_username).length > 0, "Username cannot be empty");
        require(!takenUsernames[_username], "Username already taken");

        Player storage player = players[msg.sender];

        if (bytes(player.username).length == 0) {
            player.playerAddress = msg.sender;
            allPlayers.push(msg.sender);
        }

        player.username = _username;
        takenUsernames[_username] = true;

        emit UsernameSet(msg.sender, _username);
    }

    function submitPredictions(
        uint256[QUESTIONS_PER_GAME] memory answers
    ) external payable {
        require(!players[msg.sender].hasPlayed, "Already played");
        require(msg.value >= MIN_STAKE, "Must stake at least 0.01 CORE");

        players[msg.sender].stakedAmount = msg.value;
        players[msg.sender].hasPlayed = true;
        gamePredictions[currentGameId][msg.sender] = answers;
        _generateCorrectAnswers(msg.sender);

        emit PredictionsSubmitted(msg.sender, answers);
    }

    function _generateCorrectAnswers(address player) internal {
        uint256[QUESTIONS_PER_GAME] memory generatedAnswers;
        for (uint i = 0; i < QUESTIONS_PER_GAME; i++) {
            generatedAnswers[i] =
                uint256(
                    keccak256(
                        abi.encodePacked(
                            block.timestamp,
                            block.prevrandao,
                            player,
                            i
                        )
                    )
                ) %
                2;
        }
        gameAnswers[currentGameId][player] = generatedAnswers;
        resultsGenerated[player] = true;

        _calculateScore(player);
        emit ResultsGenerated(player, generatedAnswers);
    }

    function _calculateScore(address player) internal {
        require(resultsGenerated[player], "Results not generated");

        Player storage p = players[player];
        uint256 correctCount = 0;
        uint256[QUESTIONS_PER_GAME] memory userAnswers = gamePredictions[
            currentGameId
        ][player];
        uint256[QUESTIONS_PER_GAME] memory correctAnswers = gameAnswers[
            currentGameId
        ][player];

        for (uint i = 0; i < QUESTIONS_PER_GAME; i++) {
            if (userAnswers[i] == correctAnswers[i]) {
                correctCount++;
                p.totalPoints += POINTS_PER_CORRECT_ANSWER;
                p.currentStreak++;
                if (p.currentStreak % STREAK_LENGTH == 0) {
                    p.totalPoints += STREAK_REWARD_POINTS;
                }
            } else {
                p.totalPoints -= POINTS_PER_WRONG_ANSWER;
                p.currentStreak = 0;
            }
        }
        p.totalCorrect += correctCount;

        if (!_isPlayerInLeaderboard(player)) {
            globalLeaderboard.push(player);
        }
        emit PointsUpdated(player, correctCount, p.totalPoints);
    }

    function _isPlayerInLeaderboard(
        address player
    ) internal view returns (bool) {
        for (uint i = 0; i < globalLeaderboard.length; i++) {
            if (globalLeaderboard[i] == player) {
                return true;
            }
        }
        return false;
    }

    function finishGame() external onlyOwner {
        currentGameId++;
        emit GameFinished(currentGameId);
    }

    function getGlobalLeaderboard() external view returns (address[] memory) {
        return globalLeaderboard;
    }

    function getPlayerDetails(
        address player
    ) public view returns (Player memory) {
        return players[player];
    }
}
