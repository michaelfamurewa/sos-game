import { useEffect, useState } from 'react'
import '../styles/gameBoard.css'


export default function GameBoard() {

    const [configs, setConfigs] = useState({ mode: '', board: [] })
    const [letter, setLetter] = useState('S')
    const [turn, setTurn] = useState("one")
    const [p1, setp1] = useState(0)
    const [p2, setp2] = useState(0)


    function PointsDisplay() {
        return (
            <div className='pointsDisplay'>
                <span className='p1'> P1: {p1}</span>
                <span className='p2'> P2: {p2}</span>
            </div>
        )
    }

    async function getConfigs() {
        let configs = await fetch('http://localhost:3000/configs')
        configs = await configs.json()
        setConfigs(configs)
    }

    // Initialize the game board at first render
    useEffect(() => {
        getConfigs()
    }, [])

    async function resetBoard() {
        let update = await fetch('http://localhost:3000/reset')
        update = await update.json()
        setConfigs(update)
    }

    function changeLetter() {
        if (letter === 'S') {
            setLetter('O')
        }
        else {
            setLetter('S')
        }
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
        if (configs.mode === 'simple') {
            switch (res[0]) {
                case 'none':
                    break
                case 'draw':
                    alert('GAME OVER: DRAW')
                    resetBoard()
                    break
                default:
                    highlightSequence(res)
                    alert(`GAME OVER: Player ${turn} wins!`)
                    resetBoard()
            }
        }
        else {
            switch (res[0]) {
                case 'full':
                    if (p1 === p2) {
                        let msg = `GAME OVER: DRAW`
                        alert(msg)
                        resetBoard()
                    }
                    else {
                        let winner = p1 > p2 ? 'ONE' : 'TWO'
                        let msg = `GAME OVER: PLAYER ${winner} WINS`
                        alert(msg)
                        resetBoard()
                    }
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
    }

    return (
        <>
            <div className='letterSelector'>Current letter: {letter}
                <button onClick={changeLetter}>change</button>
                <h1 className='turnDisplay'>Player {turn}'s turn</h1>
            </div>
            {configs.mode === 'simple' ? null : <PointsDisplay />}
            <div className='gameBoard'>{configs.board.map((rows, rowIndex) => {
                return (
                    // Creating game board by mapping each row which maps each column within that row
                    <div className='row' key={rowIndex}>{rows.map((col, colIndex) => {
                        return (
                            <div key={colIndex} className='block' onClick={async () => {
                                if (configs.board[rowIndex][colIndex] === null) {
                                    // Update the game board UI by adding the players letter in the cell
                                    setConfigs((old) => {
                                        let upd = { ...old }
                                        upd.board[rowIndex][colIndex] = letter
                                        return upd
                                    })
                                    // Send move to backend and get response of points scored for player
                                    let msg = { row: rowIndex, col: colIndex, val: letter }
                                    let resp = await fetch(`http://localhost:3000/playerMove/${JSON.stringify(msg)}`)
                                    resp = await resp.json()
                                    handleResponse(resp)

                                    // Notify change of turn
                                    let change = turn === 'one' ? 'two' : 'one'
                                    setTurn(change)
                                }
                            }}>{configs.board[rowIndex][colIndex] === null ? null : configs.board[rowIndex][colIndex]}</div>
                        )
                    })}</div>
                )
            })}</div>
        </>
    )
}