import { useEffect, useState } from 'react'
import { io } from 'socket.io-client'
import '../styles/gameBoard.css'

const socket = io.connect('http://localhost:3000')

export default function MultiplayerBoard() {

    const [board, setBoard] = useState(Array.from({ length: 7 }, () => Array(7).fill(null)))
    const [letter, setLetter] = useState('S')
    const [turn, setTurn] = useState("one")
    const [p1, setp1] = useState(0)
    const [p2, setp2] = useState(0)


    useEffect(() => {
        socket.on('recieveMove', async (data) => {
            let upd = [...board]
            upd[data.row][data.col] = data.val
            setBoard(upd)

            let msg = { row: data.row, col: data.col, val: data.val }
            let resp = await fetch(`http://localhost:3000/playerMove/${JSON.stringify(msg)}`)
            resp = await resp.json()
            handleResponse(resp)
        })

        socket.on('turnChange', (data) => {
            setTurn(data.turn)
        })
    }, [socket])

    function PointsDisplay() {
        return (
            <div className='pointsDisplay'>
                <span className='p1'> P1: {p1}</span>
                <span className='p2'> P2: {p2}</span>
            </div>
        )
    }

    function changeLetter() {
        if (letter === 'S') {
            setLetter('O')
        }
        else {
            setLetter('S')
        }
    }

    async function makeMove(row, col) {
        let upd = [...board]
        upd[row][col] = letter
        setBoard(upd)
        socket.emit('playerMove', { row: row, col: col, val: letter })

        let msg = { row: row, col: col, val: letter }
        let resp = await fetch(`http://localhost:3000/playerMove/${JSON.stringify(msg)}`)
        resp = await resp.json()
        handleResponse(resp)

        // Notify change of turn
        let change = turn === 'one' ? 'two' : 'one'
        setTurn(change)
    }

    function highlightSequence(seqs) {
        for (let i = 0; i < seqs.length; i++) {
            let l = document.getElementsByClassName('row')[seqs[i].l.row].getElementsByClassName('block')[seqs[i].l.col]
            let m = document.getElementsByClassName('row')[seqs[i].m.row].getElementsByClassName('block')[seqs[i].m.col]
            let r = document.getElementsByClassName('row')[seqs[i].r.row].getElementsByClassName('block')[seqs[i].r.col]

            let col = turn === 'one' ? 'red' : 'blue'
            l.style.color = col
            m.style.color = col
            r.style.color = col
        }
    }

    function handleResponse(res) {
        switch (res[0]) {
            case 'full':
                if (res[1].length > 0) {
                    highlightSequence(res[1])
                    if (turn === 'one') {
                        setp1(p1 + res.length)
                    }
                    else {
                        setp2(p2 + res.length)
                    }
                }
                if (p1 === p2) {
                    let msg = `GAME OVER: DRAW`
                    alert(msg)
                }
                else {
                    let winner = p1 > p2 ? 'ONE' : 'TWO'
                    let msg = `GAME OVER: PLAYER ${winner} WINS`
                    alert(msg)
                }
                fetch(`http://localhost:3000/gameOver/${[p1, p2]}`)
                break
            case 'none':
                break
            default:
                highlightSequence(res)
                if (turn === 'one') {
                    setp1(p1 + res.length)
                }
                else {
                    setp2(p2 + res.length)
                }
        }
    }

    return (
        <>
            <div className='letterSelector'>Current letter: {letter}
                <button onClick={changeLetter}>change</button>
                <h1 className='turnDisplay'>Player {turn}'s turn</h1>
            </div>
            <div className='container'>
                <div className='gameBoard'>{board.map((rows, rowIndex) => {
                    return (
                        // Creating game board by mapping each row which maps each column within that row
                        <div className='row' key={rowIndex}>{rows.map((col, colIndex) => {
                            return (
                                <div key={colIndex} className='block' onClick={async () => {
                                    if (board[rowIndex][colIndex] === null) {
                                        makeMove(rowIndex, colIndex)
                                    }
                                }}>{board[rowIndex][colIndex] === null ? null : board[rowIndex][colIndex]}</div>
                            )
                        })}</div>
                    )
                })}</div>
                <PointsDisplay />
            </div>
        </>
    )
}