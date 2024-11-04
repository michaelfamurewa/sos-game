// SPDX-License-Identifier: MIT

pragma solidity ^0.8.27;

contract SOS {
    struct completedGame {
        address player1;
        address player2;
        address winner;
        string[][] finalBoard;
        uint256 timeStamp;
    }

    address[] public leaderBoard;
    completedGame[] public history;

    function finishGame(
        address p1,
        address p2,
        address winner,
        string[][] calldata finalBoard,
        uint256 time
    ) public {
        completedGame memory complete = completedGame(
            p1,
            p2,
            winner,
            finalBoard,
            time
        );
        history.push(complete);
    }
}
