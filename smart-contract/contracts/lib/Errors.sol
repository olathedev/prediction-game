// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

library Errors {
    error OnlyOwner();
    error InvalidQuestionID();
    error UsernameEmpty();
    error UsernameTaken();
    error MaxQuestionsReached();
    error TimeLimitInvalid();
    error PredictionPeriodEnded();
    error TimeLimitExpired();
    error InvalidAnswer();
    error AlreadyPredicted();
    error InvalidStakeAmount();
    error DeadlineNotReached();
    error ResolutionWindowExpired();
    error ResultAlreadySet();
    error InvalidCorrectAnswer();
    error CoreTransferFailed();
}