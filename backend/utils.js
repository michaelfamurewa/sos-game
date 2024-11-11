class GameBoard {
    constructor(n) {
        // Initialize nxn matrix
        this.size = n
        this.board = Array.from({ length: n }, () => Array(n).fill(null))
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
    reset() {
        this.board = Array.from({ length: this.size }, () => Array(this.size).fill(null))
    }
    inBounds(cell) {
        if (cell.row >= this.size || cell.row < 0) {
            return false
        }
        else if (cell.col >= this.size || cell.col < 0) {
            return false
        }
        return true
    }
    check(row, col) {

        let successes = []
        let selected = { row: row, col: col } // Represents the cell in game board that was selected

        const checkSequence = (l, m, r) => {
            if (this.board[l.row][l.col] + this.board[m.row][m.col] + this.board[r.row][r.col] === 'SOS') {
                // Add the sequence locations in the matrix to array for use on frontend
                successes.push({ l: l, m: m, r: r })
            }
        }

        const horizontalCheck = () => {
            // Case 1: cell is left-most of SOS sequence
            let right = { row: row, col: col + 1 }
            let rightRight = { row: row, col: col + 2 }

            if (this.inBounds(rightRight)) {
                checkSequence(selected, right, rightRight)
            }

            // Case 2: cell is in middle of SOS
            let left = { row: row, col: col - 1 }
            if (this.inBounds(left) && this.inBounds(right)) {
                checkSequence(left, selected, right)
            }

            // Case 3: cell is right-most of SOS
            let leftLeft = { row: row, col: col - 2 }
            if (this.inBounds(leftLeft)) {
                checkSequence(leftLeft, left, selected)
            }
        }

        const verticalCheck = () => {
            // Case 1: cell is up-most of SOS
            let bottom = { row: row + 1, col: col }
            let bottomBottom = { row: row + 2, col: col }
            if (this.inBounds(bottomBottom)) {
                checkSequence(selected, bottom, bottomBottom)
            }

            // Case 2: cell is middle of SOS
            let top = { row: row - 1, col: col }
            if (this.inBounds(top) && this.inBounds(bottom)) {
                checkSequence(top, selected, bottom)
            }

            // Case 3: cell is bottom of SOS
            let topTop = { row: row - 2, col: col }
            if (this.inBounds(topTop)) {
                checkSequence(topTop, top, selected)
            }

        }

        const leftDiagCheck = () => {
            // Case 1: cell is top leftest
            let br = { row: row + 1, col: col + 1 } // bottom-right of cell
            let brbr = { row: row + 2, col: col + 2 } // bottom-right's bottom-right
            if (this.inBounds(brbr)) {
                checkSequence(selected, br, brbr)
            }

            // Case 2: cell is middle of diag
            let tl = { row: row - 1, col: col - 1 }
            if (this.inBounds(br) && this.inBounds(tl)) {
                checkSequence(tl, selected, br)
            }

            // Case 3: cell is bottom-right of SOS
            let tll = { row: row - 2, col: col - 2 }
            if (this.inBounds(tll)) {
                checkSequence(tll, tl, selected)
            }
        }

        const rightDiagCheck = () => {
            // Case 1: cell is right-most of SOS diag
            let bl = { row: row + 1, col: col - 1 }
            let blbl = { row: row + 2, col: col - 2 }
            if (this.inBounds(blbl)) {
                checkSequence(selected, bl, blbl)
            }

            // Case 2: cell is middle of diag
            let tr = { row: row - 1, col: col + 1 }
            if (this.inBounds(tr) && this.inBounds(bl)) {
                checkSequence(tr, selected, bl)
            }

            // Case 3: cell is left-most of SOS diag
            let trtr = { row: row - 2, col: col + 2 }
            if (this.inBounds(trtr)) {
                checkSequence(trtr, tr, selected)
            }

        }


        horizontalCheck()
        verticalCheck()
        rightDiagCheck()
        leftDiagCheck()

        return successes
    }
    computerMove() {
        let letter = Math.floor(Math.random() * 2)
        letter = letter === 1 ? 'S' : 'O'
        let row = Math.floor(Math.random() * this.size)
        let col = Math.floor(Math.random() * this.size)

        // Make sure spot is not taken already
        while (this.board[row][col] !== null) {
            letter = Math.floor(Math.random() * 2)
            letter = letter === 1 ? 'S' : 'O'
            row = Math.floor(Math.random() * this.size)
            col = Math.floor(Math.random() * this.size)
        }
        this.playerMove(row, col, letter)

        return { row: row, col: col, val: letter }
    }
}

class SimpleGame extends GameBoard {
    Check(row, col) {

        let win = this.check(row, col)

        if (win.length > 0) {
            return win
        }

        let filled = 0

        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                if (this.board[i][j] === 'S' || this.board[i][j] === 'O') {
                    filled += 1
                }
            }
        }

        if (filled == this.size * this.size) {
            return ['draw']
        }

        return ['none']

    }
}

class GeneralGame extends GameBoard {
    Check(row, col) {

        let win = this.check(row, col)

        let filled = 0

        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                if (this.board[i][j] === 'S' || this.board[i][j] === 'O') {
                    filled += 1
                }
            }
        }

        if (filled == this.size * this.size) {
            return ['full', win]
        }
        else if (win.length > 0) {
            return win
        }

        return ['none']

    }
}

module.exports = {
    GameBoard,
    SimpleGame,
    GeneralGame
}