<<<<<<< HEAD
// SPDX-License-Identifier: MIT
=======
// SPDX-License-Identifier: UNLICENSED
>>>>>>> 51d541c1e725458e72ba596b31fe6e74437ccd94
pragma solidity ^0.8.13;

library Events {
    event PlayerRegistered(address indexed player, string username);
    event MatchCreated(
        uint indexed poolId,
        uint deadline
    );
    event AnswerSet(uint indexed poolId, uint answer);
    event MatchCreated(uint indexed poolId, uint deadline);
}
