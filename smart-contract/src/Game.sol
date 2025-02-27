// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

contract Game {
    struct Player {
        address playerAddress;
        string username;
        uint256 totalPoints;
        uint256 correctPredictions;
        uint256 totalPredictions;
    }

    mapping(address => Player) public players;

    address public owner;

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Game: only owner can call this function");
        _;
    }

    function createPlayer(string memory _username) external {}
}
