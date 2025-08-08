import React from 'react'
import ChessEngine from './components/ChessEngine'
import './App.css'

function App() {
  return (
    <div className="App">
      <h1 className="text-3xl font-bold mb-4 text-center">Welcome to Chess Game</h1>
      <ChessEngine />
    </div>
  )
}

export default App
