pragma solidity ^0.8.13;

library Events {
    event PlayerRegistered(address indexed player, string username);
      event MatchCreated(
        uint indexed poolId,
        uint roiYes,
        uint roiNo,
        uint deadline
    );
    event AnswerSet(
        uint indexed poolId,
        uint answer
    );   
}
