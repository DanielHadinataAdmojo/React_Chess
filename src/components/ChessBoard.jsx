import React from 'react';

// Import piece images
import wPawn from '../assets/ChessAssets/w_Pawn.png';
import wRook from '../assets/ChessAssets/w_Rook.png';
import wKnight from '../assets/ChessAssets/w_Knight.png';
import wBishop from '../assets/ChessAssets/w_Bishop.png';
import wQueen from '../assets/ChessAssets/w_Queen.png';
import wKing from '../assets/ChessAssets/w_King.png';

import bPawn from '../assets/ChessAssets/b_Pawn.png';
import bRook from '../assets/ChessAssets/b_Rook.png';
import bKnight from '../assets/ChessAssets/b_Knight.png';
import bBishop from '../assets/ChessAssets/b_Bishop.png';
import bQueen from '../assets/ChessAssets/b_Queen.png';
import bKing from '../assets/ChessAssets/b_King.png';

const pieceImages = {
  'wP': wPawn,
  'wR': wRook,
  'wN': wKnight,
  'wB': wBishop,
  'wQ': wQueen,
  'wK': wKing,
  'bP': bPawn,
  'bR': bRook,
  'bN': bKnight,
  'bB': bBishop,
  'bQ': bQueen,
  'bK': bKing,
};

const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];

const ChessBoard = ({ board, onSquareClick, highlightedSquares = [], kingInCheckPos = null }) => {
  const isHighlighted = (row, col) => {
    return highlightedSquares.some(
      ([r, c]) => r === row && c === col
    );
  };

  return (
    <div className="inline-block border-2 border-gray-800 box-content relative select-none">
      {board.map((row, rowIndex) => (
        <div key={rowIndex} className="flex">
          {row.map((piece, colIndex) => {
            const isLightSquare = (rowIndex + colIndex) % 2 === 0;
            const squareColor = isLightSquare ? 'bg-[#f0d9b5]' : 'bg-[#b58863]';
            const highlightClass = isHighlighted(rowIndex, colIndex) ? 'shadow-[inset_0_0_0_4px_rgba(255,255,0,0.7)] cursor-pointer' : '';
            const checkHighlightClass = (kingInCheckPos && kingInCheckPos[0] === rowIndex && kingInCheckPos[1] === colIndex)
              ? 'ring-8 ring-red-600 ring-inset animate-pulse'
              : '';
            return (
              <div
                key={colIndex}
                className={`w-[128px] h-[128px] flex justify-center items-center relative ${squareColor} ${highlightClass} ${checkHighlightClass}`}
                onClick={() => onSquareClick(rowIndex, colIndex)}
              >
                {/* Notation label */}
                <div className="absolute top-1 left-1 text-xs font-bold text-gray-700 select-none pointer-events-none">
                  {files[colIndex]}{ranks[rowIndex]}
                </div>
                {piece && <img src={pieceImages[piece]} alt={piece} className="w-[110px] h-[110px] select-none pointer-events-none" />}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default ChessBoard;
