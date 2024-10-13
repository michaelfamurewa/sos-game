const { GameBoard } = require('./utils.js')


// AI-generated tests below

describe('Make Board', () => {
    it('should create a 9x9 game board', () => {
        const size = 9;
        const expectedBoard = Array.from({ length: size }, () => Array(size).fill(null));

        const result = new GameBoard(size, '').board;

        expect(result).toEqual(expectedBoard);
        expect(result.length).toBe(size); // Check the number of rows
        result.forEach(row => {
            expect(row.length).toBe(size); // Check each row length
        });
    });

    it('should create a 5x5 game board', () => {
        const size = 5;
        const expectedBoard = Array.from({ length: size }, () => Array(size).fill(null));

        const result = new GameBoard(size, '').board;

        expect(result).toEqual(expectedBoard);
        expect(result.length).toBe(size);
        result.forEach(row => {
            expect(row.length).toBe(size);
        });
    });

    it('should create a 1x1 game board', () => {
        const size = 1;
        const expectedBoard = [[null]];

        const result = new GameBoard(size, '').board;

        expect(result).toEqual(expectedBoard);
        expect(result.length).toBe(size);
        expect(result[0].length).toBe(size);
    });
});


describe('Make Move', () => {
    let gameBoard;

    beforeEach(() => {
        gameBoard = new GameBoard(3, ''); // Create a 3x3 game board for testing
    });

    it('should place a move on the board', () => {
        const row = 1;
        const col = 1;
        const playerSymbol = 'S';

        gameBoard.playerMove(row, col, playerSymbol);

        expect(gameBoard.board[row][col]).toBe(playerSymbol);
    });

    it('should not place a move on an occupied cell', () => {
        const playerSymbol1 = 'S';
        const playerSymbol2 = 'O';
        const row = 0;
        const col = 0;

        gameBoard.playerMove(row, col, playerSymbol1); // First move
        gameBoard.playerMove(row, col, playerSymbol2); // Second move attempt

        expect(gameBoard.board[row][col]).toBe(playerSymbol1); // The cell should still contain the first player's symbol
    });

    it('should not crash when trying to place a move outside the board', () => {
        const playerSymbol = 'S';

        // Try to place a move outside the board (assuming size is 3)
        const invalidRow = 3;
        const invalidCol = 3;

        expect(() => gameBoard.playerMove(invalidRow, invalidCol, playerSymbol)).not.toThrow();
        // Ensure no change to the board
        expect(gameBoard.board[invalidRow]).toBeUndefined();
    });
});

// End of AI-generated tests