import { useState } from 'react'
import { Link } from 'react-router-dom'
import '../styles/gameConfig.css'

export default function BoardSelector() {

    let boardSize = 0
    function sendChoice() {
        fetch(`http://localhost:3000/boardChoice/${boardSize}`)
    }

    return (
        <div className='homeHolder'>
            <h1 className='pageHeader'>Select your board size</h1>
            <div className='sizeHolder'>
                <Link to='/gameBoard'>
                    <div className='boardChoice' onMouseOver={() => boardSize = 7} onClick={sendChoice}>7x7</div>
                </Link>
                <Link to='/gameBoard'>
                    <div className='boardChoice' onMouseOver={() => boardSize = 8} onClick={sendChoice}>8x8</div>
                </Link>
                <Link to='/gameBoard'>
                    <div className='boardChoice' onMouseOver={() => boardSize = 9} onClick={sendChoice}>9x9</div>
                </Link>
            </div>
        </div>
    )
}