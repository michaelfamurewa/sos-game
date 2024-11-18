// SPDX-License-Identifier: MIT

pragma solidity ^0.8.27;

contract SOS {
    address[] public leaderBoard;
    string[] public matchHistory;

    function finishGame(string memory gameLog) public {
        matchHistory.push(gameLog);
    }

    function retrieve() public view returns (string[] memory) {
        return matchHistory;
    }
}
