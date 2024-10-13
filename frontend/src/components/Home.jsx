import '../styles/gameConfig.css'
import { Link } from 'react-router-dom'

export default function Home() {

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
            </div>

        </div>
    )
}