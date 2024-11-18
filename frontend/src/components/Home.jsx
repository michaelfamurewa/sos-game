import '../styles/gameConfig.css'
import { Link } from 'react-router-dom'
import { ethers } from 'ethers'
import { useState } from 'react'

export default function Home() {

    const [address, setAddress] = useState(null)

    async function connectWallet() {
        if (window.ethereum) {
            try {
                const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
                fetch(`http://localhost:3000/address/${accounts[0]}`)
            }
            catch (err) {
                console.log(err)
            }
        }
        else {
            alert('Please install MetaMask')
        }
    }

    let gameChoice = ''
    function sendChoice() {
        fetch(`http://localhost:3000/gameChoice/${gameChoice}`)
    }

    return (
        <div className="homeHolder">
            <h2>Welcome To</h2>
            <h1 className="gameTitle">SOS</h1>
            <div className='choices'>
                <Link to='/chooseBoard'>
                    <button className="simpleButton" onMouseOver={() => gameChoice = 'simple'} onClick={sendChoice}>Simple Game</button>
                </Link>
                <Link to='/chooseBoard'>
                    <button className="generalButton" onMouseOver={() => gameChoice = 'general'} onClick={sendChoice}>General Game</button>
                </Link>
                <Link to='/playOnline'>
                    <button className="onlineButton" onClick={connectWallet}>Play Online</button>
                </Link>
            </div>

        </div>
    )
}