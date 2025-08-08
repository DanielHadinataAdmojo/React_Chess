import React, { useState } from 'react';
import ChessBoard from './ChessBoard';

// Standard chess starting position
const initialBoard = [
  ['bR', 'bN', 'bB', 'bQ', 'bK', 'bB', 'bN', 'bR'],
  ['bP', 'bP', 'bP', 'bP', 'bP', 'bP', 'bP', 'bP'],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  ['wP', 'wP', 'wP', 'wP', 'wP', 'wP', 'wP', 'wP'],
  ['wR', 'wN', 'wB', 'wQ', 'wK', 'wB', 'wN', 'wR'],
];

const ChessGame = () => {
  const [board, setBoard] = useState(initialBoard);
  const [selected, setSelected] = useState(null);

  const getPossibleMoves = (row, col) => {
    // Placeholder: allow moves to any empty square or capture adjacent squares (1 step in any direction)
    const moves = [];
    const piece = board[row][col];
    if (!piece) return moves;

    const directions = [
      [-1, 0], [1, 0], [0, -1], [0, 1],
      [-1, -1], [-1, 1], [1, -1], [1, 1]
    ];

    directions.forEach(([dr, dc]) => {
      const r = row + dr;
      const c = col + dc;
      if (r >= 0 && r < 8 && c >= 0 && c < 8) {
        const target = board[r][c];
        if (!target || target[0] !== piece[0]) {
          moves.push([r, c]);
        }
      }
    });

    return moves;
  };

  const onSquareClick = (row, col) => {
    if (selected) {
      // Move piece if valid
      const [selRow, selCol] = selected;
      const possibleMoves = getPossibleMoves(selRow, selCol);
      const isValidMove = possibleMoves.some(([r, c]) => r === row && c === col);
      if (selRow === row && selCol === col) {
        // Deselect if same square clicked
        setSelected(null);
        return;
      }
      if (isValidMove) {
        const piece = board[selRow][selCol];
        if (piece) {
          const newBoard = board.map(r => r.slice());
          newBoard[row][col] = piece;
          newBoard[selRow][selCol] = null;
          setBoard(newBoard);
          setSelected(null);
        }
      } else {
        // If clicked on another piece of same color, change selection
        const clickedPiece = board[row][col];
        if (clickedPiece && clickedPiece[0] === board[selRow][selCol][0]) {
          setSelected([row, col]);
        } else {
          // Invalid move, do nothing or deselect
          setSelected(null);
        }
      }
    } else {
      // Select piece if present
      if (board[row][col]) {
        setSelected([row, col]);
      }
    }
  };
  
  const possibleMoves = selected ? getPossibleMoves(selected[0], selected[1]) : [];

  return (
    <div>
      <ChessBoard board={board} onSquareClick={onSquareClick} highlightedSquares={possibleMoves} />
      {selected && (
        <div style={{ marginTop: '10px', textAlign: 'center' }}>
          Selected piece at row {selected[0] + 1}, column {selected[1] + 1}
        </div>
      )}
    </div>
  );
};

export default ChessGame;
