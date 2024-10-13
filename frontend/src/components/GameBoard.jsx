import { useEffect, useState } from 'react'
import '../styles/gameBoard.css'


export default function GameBoard() {

    const [configs, setConfigs] = useState({ mode: '', board: [] })
    const [letter, setLetter] = useState('S')

    async function getConfigs() {
        let configs = await fetch('http://localhost:3000/configs')
        configs = await configs.json()
        setConfigs(configs)
    }

    // Initialize the game board at first render
    useEffect(() => {
        getConfigs()
    }, [])

    function changeLetter() {
        if (letter === 'S') {
            setLetter('O')
        }
        else {
            setLetter('S')
        }
    }

    return (
        <>
            <div className='letterSelector'>Current letter: {letter} <button onClick={changeLetter}>change</button></div>
            <div className='gameBoard'>{configs.board.map((rows, rowIndex) => {
                return (
                    // Creating game board by mapping each row which maps each column within that row
                    <div className='row' key={rowIndex}>{rows.map((col, colIndex) => {
                        return (
                            <div key={colIndex} className='block' onClick={(evt) => {
                                if (configs.board[rowIndex][colIndex] === null) {
                                    setConfigs((old) => {
                                        let upd = { ...old }
                                        upd.board[rowIndex][colIndex] = letter
                                        return upd
                                    })
                                    let msg = {
                                        row: rowIndex,
                                        col: colIndex,
                                        val: letter
                                    }
                                    fetch(`http://localhost:3000/playerMove/${JSON.stringify(msg)}`)
                                }
                            }}>{configs.board[rowIndex][colIndex] === null ? null : configs.board[rowIndex][colIndex]}</div>
                        )
                    })}</div>
                )
            })}</div>
        </>
    )
}