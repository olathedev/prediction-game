// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

contract GuessGame {
    // Constants
    uint256 public constant QUESTIONS_PER_GAME = 10;
    uint256 public constant POINTS_PER_CORRECT_ANSWER = 10;
    uint256 public constant STREAK_REWARD_POINTS = 50;
    uint256 public constant STREAK_LENGTH = 3;

    // State Variables
    address public owner;
    uint256 public currentGameId;

    struct Player {
        address playerAddress;
        string username;
        uint256 totalPoints;
        uint256 totalCorrect;
        uint256 stakedAmount;
        bool hasStaked;
    }

    struct GameResult {
        uint256 gameId;
        address player;
        string username;
        uint256 correctAnswers;
        uint256 totalPoints;
        uint256[QUESTIONS_PER_GAME] correctAnswerArray;
        uint256[QUESTIONS_PER_GAME] userPredictions;
    }

    mapping(address => Player) public players;
    mapping(address => GameResult[]) public playerGameResults;
    mapping(address => uint256[QUESTIONS_PER_GAME]) public userPredictions;
    mapping(address => uint256[QUESTIONS_PER_GAME]) public correctAnswers;
    mapping(address => bool) public resultsGenerated;
    address[] public allPlayers;

    // Events
    event UsernameSet(address indexed player, string username);
    event PredictionsSubmitted(address indexed player, uint256[QUESTIONS_PER_GAME] answers, GameResult result);
    event StakeWithdrawn(address indexed player, uint256 amount);
    event Staked(address indexed player, uint256 amount);
    event OwnerWithdrawn(address indexed owner, uint256 amount);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not contract owner");
        _;
    }

    constructor() {
        owner = msg.sender;
        currentGameId = 1;
    }

    function setUsername(string memory _username) external {
        require(bytes(_username).length > 0, "Username cannot be empty");

        // Ensure username is unique
        for (uint256 i = 0; i < allPlayers.length; i++) {
            require(
                keccak256(bytes(players[allPlayers[i]].username)) != keccak256(bytes(_username)),
                "Username already taken"
            );
        }

        require(bytes(players[msg.sender].username).length == 0, "Username already set");

        if (players[msg.sender].playerAddress == address(0)) {
            players[msg.sender].playerAddress = msg.sender;
            allPlayers.push(msg.sender);
        }

        players[msg.sender].username = _username;
        emit UsernameSet(msg.sender, _username);
    }

    function stake() external payable {
        require(msg.value > 0, "Must stake some ETH");

        players[msg.sender].stakedAmount = msg.value;
        players[msg.sender].hasStaked = true;

        emit Staked(msg.sender, msg.value);
    }

    function submitPredictions(
        uint256[QUESTIONS_PER_GAME] memory answers,
        uint256[QUESTIONS_PER_GAME] memory _correctAnswers
    ) external returns (bool) {
        require(players[msg.sender].hasStaked, "Must stake before predicting");

        userPredictions[msg.sender] = answers;
        resultsGenerated[msg.sender] = true;
        correctAnswers[msg.sender] = _correctAnswers;
        players[msg.sender].hasStaked = true;

        currentGameId++;

        GameResult memory latestResult = _calculateScore(msg.sender);

        emit PredictionsSubmitted(msg.sender, answers, latestResult);

        _withdrawStake(msg.sender);

        return true;
    }

    function _calculateScore(address player) internal returns (GameResult memory) {
        require(resultsGenerated[player], "Results not generated");

        Player storage p = players[player];
        uint256 correctCount = 0;
        uint256[QUESTIONS_PER_GAME] memory userAnswers = userPredictions[player];
        uint256[QUESTIONS_PER_GAME] memory generatedAnswers = correctAnswers[player];

        for (uint256 i = 0; i < QUESTIONS_PER_GAME; i++) {
            if (userAnswers[i] == generatedAnswers[i]) {
                correctCount++;
            }
        }

        uint256 gamePoints = correctCount * POINTS_PER_CORRECT_ANSWER;

        if (correctCount >= STREAK_LENGTH) {
            gamePoints += STREAK_REWARD_POINTS;
        }

        p.totalCorrect += correctCount;
        p.totalPoints += gamePoints;

        GameResult memory result = GameResult({
            gameId: currentGameId,
            player: player,
            username: p.username,
            correctAnswers: correctCount,
            totalPoints: gamePoints,
            correctAnswerArray: generatedAnswers,
            userPredictions: userAnswers
        });

        playerGameResults[player].push(result);

        return result;
    }

    function getPlayerLatestGameResult(address player) external view returns (GameResult memory) {
        uint256 gamesPlayed = playerGameResults[player].length;
        require(gamesPlayed > 0, "No games played yet");
        return playerGameResults[player][gamesPlayed - 1];
    }

    function _withdrawStake(address player) internal {
        Player storage p = players[player];
        require(p.stakedAmount > 0, "No stake to withdraw");

        uint256 amount = p.stakedAmount;
        p.stakedAmount = 0;

        (bool success,) = payable(player).call{value: amount}("");
        require(success, "Transfer failed");

        emit StakeWithdrawn(player, amount);
    }

    function getPlayerDetails(address playerAddress) public view returns (Player memory) {
        return players[playerAddress];
    }

    function getGlobalLeaderboard() external view returns (Player[] memory) {
        uint256 playerCount = allPlayers.length;
        Player[] memory leaderboard = new Player[](playerCount);

        for (uint256 i = 0; i < playerCount; i++) {
            leaderboard[i] = players[allPlayers[i]];
        }

        // Sort players by totalPoints in descending order
        for (uint256 i = 0; i < playerCount; i++) {
            for (uint256 j = i + 1; j < playerCount; j++) {
                if (leaderboard[j].totalPoints > leaderboard[i].totalPoints) {
                    (leaderboard[i], leaderboard[j]) = (leaderboard[j], leaderboard[i]);
                }
            }
        }

        return leaderboard;
    }

    function getPlayerScores(address playerAddress) public view returns (uint256 totalPoints, uint256 totalCorrect) {
        Player memory player = players[playerAddress];
        return (player.totalPoints, player.totalCorrect);
    }

    function withdrawFromContract() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to withdraw");

        (bool success,) = payable(owner).call{value: balance}("");
        require(success, "Transfer failed");

        emit OwnerWithdrawn(owner, balance);
    }
}
