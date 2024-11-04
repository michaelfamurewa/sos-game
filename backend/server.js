const express = require('express')
const cors = require('cors')
const utils = require('./utils.js')
const app = express()


let n
let mode
let board

app.use(cors())

app.get('/gameChoice/:choice', (req, res) => {
    let { choice } = req.params
    mode = choice
})

app.get('/boardChoice/:choice', (req, res) => {
    let { choice } = req.params
    n = Number(choice)
})

app.get('/playerMove/:move', (req, res) => {
    let { move } = req.params
    let { row, col, val } = JSON.parse(move)
    board.playerMove(row, col, val)
    res.send(board.Check(row, col))
})

app.get('/configs', (req, res) => {

    if (mode === 'simple') {
        board = new utils.SimpleGame(n)
    } else {
        board = new utils.GeneralGame(n)
    }

    const configs = {
        board: board.board,
        mode: mode
    }
    res.send(configs)
})

app.get('/reset', (req, res) => {
    board.reset()
    const configs = {
        board: board.board,
        mode: mode
    }
    res.send(configs)
})

app.get('/gameMode', (req, res) => {
    res.send({ mode: gameMode })
})

app.listen(3000, () => {
    console.log('Server is running on port 3000')
})