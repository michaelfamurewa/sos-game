const { GameBoard, GeneralGame } = require('./utils.js')

// Sprint 2 tests
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


// Sprint 3 tests
describe('GameBoard', () => {
    let gameBoard;

    beforeEach(() => {
        gameBoard = new GeneralGame(3);
    });

    test('should detect an SOS sequence horizontally', () => {
        gameBoard.playerMove(0, 0, 'S');
        gameBoard.playerMove(0, 1, 'O');
        gameBoard.playerMove(0, 2, 'S');

        const result = gameBoard.Check(0, 1); // Check at the middle position
        expect(result).toEqual([
            {
                l: { row: 0, col: 0 },
                m: { row: 0, col: 1 },
                r: { row: 0, col: 2 },
            }
        ]);
    });

    test('should detect an SOS sequence vertically', () => {
        gameBoard.playerMove(0, 0, 'S');
        gameBoard.playerMove(1, 0, 'O');
        gameBoard.playerMove(2, 0, 'S');

        const result = gameBoard.Check(1, 0); // Check at the middle position
        expect(result).toEqual([
            {
                l: { row: 0, col: 0 },
                m: { row: 1, col: 0 },
                r: { row: 2, col: 0 },
            }
        ]);
    });

    test('should detect an SOS sequence diagonally', () => {
        gameBoard.playerMove(0, 0, 'S');
        gameBoard.playerMove(1, 1, 'O');
        gameBoard.playerMove(2, 2, 'S');

        const result = gameBoard.Check(1, 1); // Check at the middle position
        expect(result).toEqual([
            {
                l: { row: 0, col: 0 },
                m: { row: 1, col: 1 },
                r: { row: 2, col: 2 },
            }
        ]);
    });

    test('should not detect a sequence if it is incomplete', () => {
        gameBoard.playerMove(0, 0, 'S');
        gameBoard.playerMove(0, 1, 'O');

        const result = gameBoard.Check(0, 1); // Check at the middle position
        expect(result).toEqual(['none']); // No SOS sequences detected
    });

    test('should return ["full"] when the board is full', () => {
        // Fill the board completely (example scenario)
        const moves = [
            ['S', 'O', 'S'],
            ['O', 'S', 'O'],
            ['S', 'O', 'S']
        ];
        moves.forEach((row, r) => {
            row.forEach((val, c) => {
                gameBoard.playerMove(r, c, val);
            });
        });

        const result = gameBoard.Check(1, 1); // Check at the middle position
        expect(result[0]).toEqual('full');
    });
});

// Sprint 4 tests
describe('Computer opponent', () => {
    let gameBoard;

    // Set up a fresh game board before each test
    beforeEach(() => {
        gameBoard = new GameBoard(3);
    });

    test('computerMove should return a valid move (row, col, val)', () => {
        const move = gameBoard.computerMove();
        expect(move).toHaveProperty('row');
        expect(move).toHaveProperty('col');
        expect(move).toHaveProperty('val');
    });

    test('computerMove should not overwrite an existing move', () => {
        // Occupy a few spots
        gameBoard.playerMove(0, 0, 'S');
        gameBoard.playerMove(0, 1, 'O');
        gameBoard.playerMove(1, 1, 'S');

        // Make a computer move
        const move = gameBoard.computerMove();

        // Ensure the computer doesn't overwrite an existing spot
        expect(gameBoard.board[move.row][move.col]).toBe(move.val);
        expect(gameBoard.board[0][0]).toBe('S');
        expect(gameBoard.board[0][1]).toBe('O');
        expect(gameBoard.board[1][1]).toBe('S');
    });

});