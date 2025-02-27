// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

contract Game {
    address public owner;

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Game: only owner can call this function");
        _;  
    }


}
