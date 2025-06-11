import React, { useState } from 'react';
import './App.css';

function checkWinner(board) {
  const lines = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6],
  ];
  for (let [a,b,c] of lines) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }
  return null;
}

function App() {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [turn, setTurn] = useState('X');
  const [winner, setWinner] = useState(null);

  const handleClick = async (i) => {
    if (board[i] || turn !== 'X' || winner) return;

    const newBoard = [...board];
    newBoard[i] = 'X';
    setBoard(newBoard);

    const newWinner = checkWinner(newBoard);
    if (newWinner) {
      setWinner(newWinner);
      return;
    }

    setTurn('O');

    const state = newBoard.map(cell => cell || '-').join('');

    try {
      const res = await fetch('http://127.0.0.1:5000/api/next-move', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ state })
      });

      if (!res.ok) {
        setTurn('X');
        return;
      }

      const data = await res.json();
      if (data.move !== undefined) {
        newBoard[data.move] = 'O';
        setBoard([...newBoard]);

        const finalWinner = checkWinner(newBoard);
        if (finalWinner) {
          setWinner(finalWinner);
        } else {
          setTurn('X');
        }
      }
    } catch (err) {
      alert("Server error. Try again.");
      setTurn('X');
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setTurn('X');
    setWinner(null);
  };

  return (
    <div className="App">
      <h1>Tic-Tac-Toe</h1>
      {winner ? (
        <h2>{winner} wins!</h2>
      ) : (
        <h2>Turn: {turn}</h2>
      )}
      <div className="board">
        {board.map((cell, i) => (
          <button
            key={i}
            onClick={() => handleClick(i)}
            disabled={cell || winner}
          >
            {cell}
          </button>
        ))}
      </div>
      <button className="restart-button" onClick={resetGame}>
        Restart
      </button>
    </div>
  );
}

export default App;
