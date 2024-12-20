import Home from './components/Home.jsx'
import BoardSelector from './components/BoardSelector.jsx'
import GameBoard from './components/GameBoard.jsx'
import MultiplayerBoard from './components/MultiplayerBoard.jsx'
import { Route, Routes } from 'react-router-dom'



export default function App() {
  return (
    <>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/chooseBoard' element={<BoardSelector />} />
        <Route path='/gameBoard' element={<GameBoard />} />
        <Route path='/playOnline' element={<MultiplayerBoard />} />
      </Routes>
    </>
  )
}
