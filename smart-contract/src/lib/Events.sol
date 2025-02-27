// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

library Events { 
    event MatchCreated(
        uint indexed poolId,
        uint roiYes,
        uint roiNo,
        uint deadline
    );   
}