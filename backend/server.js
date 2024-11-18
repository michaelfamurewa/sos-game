const express = require('express')
const cors = require('cors')
const utils = require('./utils.js')
const http = require('http')
const { Server } = require('socket.io')
const ethers = require('ethers')
const fs = require("fs")
const path = require("path")




const app = express()
const server = http.createServer(app)
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:5173',
        methods: ['GET', 'POST']
    }
})

app.use(cors())

let n
let mode
let board

// Online multiplayer methods

board = new utils.GeneralGame(7)
let turn = 'one'
let addresses = []

io.on('connection', (socket) => {

    socket.on('playerMove', (data) => {
        socket.broadcast.emit('recieveMove', { row: data.row, col: data.col, val: data.val })
        board.playerMove(data.row, data.col, data.val)
        turn = turn === 'one' ? 'two' : 'one'
        socket.broadcast.emit('turnChange', { turn })
    })
})

app.get('/gameOver/:scores', (req, res) => {
    let { scores } = req.params

    let gameResults = {
        player1: addresses[0],
        player2: addresses[1],
        score: [scores[0], scores[2]],
        board: board.board
    }
    gameResults = JSON.stringify(gameResults)

    const provider = new ethers.JsonRpcProvider("http://localhost:8545"); // Point to your Hardhat node
    const contractJson = JSON.parse(fs.readFileSync('/Users/michaelfamurewa/Projects/sos_game/blockchain/artifacts/contracts/SOS.sol/SOS.json'));
    const contractABI = contractJson.abi;
    const contractAddress = "0x5fbdb2315678afecb367f032d93f642f64180aa3"
    const signer = new ethers.Wallet("0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80", provider);

    // Get the contract factory for SOS
    async function updateChain() {
        const contract = new ethers.Contract(contractAddress, contractABI, signer);
        const result = await contract.finishGame(gameResults)
    }

    updateChain()

})

app.get('/address/:addy', (req, res) => {
    let { addy } = req.params
    addresses.push(addy)
})

// HTTP methods below

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

app.get('/computerMove', (req, res) => {
    let move = board.computerMove()
    res.send(move)
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

server.listen(3000)
