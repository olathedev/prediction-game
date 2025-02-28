// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

library Errors {
    error UsernameCannotBeEmpty();
    error InvalidRoi();
    error InvalidDeadline();
    error InvalidAnswer();
    error InvalidStake();
    error InvalidPoolId();
    error DeadlineNotReached();
    error ResultAlreadySet();
}