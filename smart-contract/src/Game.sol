// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "./lib/Errors.sol";
import "./lib/Events.sol";

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

    function createPlayer(string memory _username) external {
        if (bytes(_username).length == 0) {
            revert Errors.UsernameCannotBeEmpty();
        }
        players[msg.sender] = Player({
            playerAddress: msg.sender,
            username: _username,
            totalPoints: 0,
            correctPredictions: 0,
            totalPredictions: 0
        });

        emit Events.PlayerRegistered(msg.sender, _username);
    }

    
}
