

class GameBoard {
    constructor(n, mode) {
        this.board = Array.from({ length: n }, () => Array(n).fill(null))
        this.mode = mode
    }
    playerMove(row, col, val) {
        try {
            if (this.board[row][col] === null) {
                this.board[row][col] = val
            }
        }
        catch (err) {
            console.log(err)
        }
    }
}


module.exports = {
    GameBoard
}