// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

library Events {
    event QuestionCreated(uint256 questionId, string text, uint256 duration, uint256 resolutionWindow, uint256 timeLimit);
    event PredictionSubmitted(address player, uint256 questionId, uint256 answer, uint256 stakeAmount);
    event QuestionResolved(uint256 questionId, uint256 correctAnswer);
    event UsernameSet(address player, string username);
    event StreakReward(address player, uint256 streakLength, uint256 rewardPoints);
    event RewardDistributed(address player, uint256 rewardAmount);

}