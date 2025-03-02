// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

library Events {
    event QuestionCreated(uint256 indexed questionId, string text, uint256 duration, uint256 resolutionWindow);
    event PredictionSubmitted(address indexed player, uint256 indexed questionId, uint256 answer);
    event QuestionResolved(uint256 indexed questionId, uint256 correctAnswer);
}