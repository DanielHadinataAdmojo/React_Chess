import React, { useState, useEffect } from 'react';
import ChessBoard from './ChessBoard';
import { coordsToNotation, notationToCoords } from '../utils/notation';


// Initial board setup
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

const directions = {
  rook: [
    [-1, 0], [1, 0], [0, -1], [0, 1]
  ],
  bishop: [
    [-1, -1], [-1, 1], [1, -1], [1, 1]
  ],
  knight: [
    [-2, -1], [-2, 1], [-1, -2], [-1, 2],
    [1, -2], [1, 2], [2, -1], [2, 1]
  ],
  king: [
    [-1, -1], [-1, 0], [-1, 1],
    [0, -1],           [0, 1],
    [1, -1],  [1, 0],  [1, 1]
  ]
};

const ChessEngine = () => {
  const [board, setBoard] = useState(initialBoard);
  const [selected, setSelected] = useState(null);
  const [turn, setTurn] = useState('w'); // 'w' for white, 'b' for black
  const [possibleMoves, setPossibleMoves] = useState([]);
  const [gameStatus, setGameStatus] = useState('ongoing'); // ongoing, checkmate, stalemate, draw
  const [inCheck, setInCheck] = useState(false);

  // New state to hold king's position when in check for highlighting
  const [kingInCheckPos, setKingInCheckPos] = useState(null);

  // Track if king and rooks have moved for castling rights
  // Also track last double pawn move for en passant
  const [movedPieces, setMovedPieces] = useState({
    wK: false,
    wRLeft: false,
    wRRight: false,
    bK: false,
    bRLeft: false,
    bRRight: false,
  });
  const [lastDoublePawnMove, setLastDoublePawnMove] = useState(null); // {row, col} of pawn that moved two squares last turn

  // New state for pawn promotion
  const [promotionPending, setPromotionPending] = useState(false);
  const [promotionPosition, setPromotionPosition] = useState(null);
  const [promotionColor, setPromotionColor] = useState(null);

  // Function to handle promotion choice
  const handlePromotionChoice = (pieceType) => {
    if (!promotionPosition || !promotionColor) return;
    const newBoard = board.map(row => row.slice());
    const [row, col] = promotionPosition;
    // Remove pawn from previous position before promotion
    // Find the pawn's original position (one rank behind promotion row)
    const pawnRow = promotionColor === 'w' ? row + 1 : row - 1;
    for (let c = 0; c < 8; c++) {
      if (newBoard[pawnRow][c] === promotionColor + 'P') {
        newBoard[pawnRow][c] = null;
        break;
      }
    }
    newBoard[row][col] = promotionColor + pieceType;
    setBoard(newBoard);
    setPromotionPending(false);
    setPromotionPosition(null);
    setPromotionColor(null);
    setTurn(promotionColor === 'w' ? 'b' : 'w');
  };

  const isInBounds = (r, c) => r >= 0 && r < 8 && c >= 0 && c < 8;

  // Find king position for given color
  const findKing = (board, color) => {
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        if (board[r][c] === color + 'K') {
          return [r, c];
        }
      }
    }
    return null;
  };

  // Check if square is attacked by opponent
  const isSquareAttacked = (board, row, col, attackerColor) => {
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const piece = board[r][c];
        if (piece && piece[0] === attackerColor) {
          const moves = calculateRawMoves(board, r, c, true);
          for (const [mr, mc] of moves) {
            if (mr === row && mc === col) {
              return true;
            }
          }
        }
      }
    }
    return false;
  };

  // Helper to check if squares between two columns on a row are empty
  const areSquaresEmpty = (board, row, colStart, colEnd) => {
    for (let c = colStart; c <= colEnd; c++) {
      if (board[row][c]) return false;
    }
    return true;
  };

  // Helper to check if squares are attacked by opponent
  const areSquaresSafe = (board, row, cols, attackerColor) => {
    for (const c of cols) {
      if (isSquareAttacked(board, row, c, attackerColor)) return false;
    }
    return true;
  };

  // Calculate raw moves without check validation
  const calculateRawMoves = (board, row, col, ignoreCheck = false) => {
    const piece = board[row][col];
    if (!piece) return [];
    const color = piece[0];
    const type = piece[1];

    const moves = [];

    const addMove = (r, c) => {
      if (!isInBounds(r, c)) return false;
      const target = board[r][c];
      if (!target) {
        moves.push([r, c]);
        return true;
      } else if (target[0] !== color) {
        moves.push([r, c]);
        return false;
      } else {
        return false;
      }
    };

    switch (type) {
      case 'P': {
        const dir = color === 'w' ? -1 : 1;
        const startRow = color === 'w' ? 6 : 1;

        // Move forward
        if (isInBounds(row + dir, col) && !board[row + dir][col]) {
          moves.push([row + dir, col]);
          // First move can move two squares
          if (row === startRow && !board[row + 2 * dir][col]) {
            moves.push([row + 2 * dir, col]);
          }
        }
        // Capture diagonally
        for (const dc of [-1, 1]) {
          const r = row + dir;
          const c = col + dc;
          if (isInBounds(r, c) && board[r][c] && board[r][c][0] !== color) {
            moves.push([r, c]);
          }
        }

        // En Passant capture
        for (const dc of [-1, 1]) {
          const sideCol = col + dc;
          if (sideCol >= 0 && sideCol < 8) {
            if (lastDoublePawnMove &&
                lastDoublePawnMove.row === row &&
                lastDoublePawnMove.col === sideCol) {
              // The pawn to capture is adjacent and just moved two squares
              moves.push([row + dir, sideCol]);
            }
          }
        }
        break;
      }
      case 'R': {
        for (const [dr, dc] of directions.rook) {
          let r = row + dr;
          let c = col + dc;
          while (isInBounds(r, c)) {
            if (!board[r][c]) {
              moves.push([r, c]);
            } else {
              if (board[r][c][0] !== color) moves.push([r, c]);
              break;
            }
            r += dr;
            c += dc;
          }
        }
        break;
      }
      case 'B': {
        for (const [dr, dc] of directions.bishop) {
          let r = row + dr;
          let c = col + dc;
          while (isInBounds(r, c)) {
            if (!board[r][c]) {
              moves.push([r, c]);
            } else {
              if (board[r][c][0] !== color) moves.push([r, c]);
              break;
            }
            r += dr;
            c += dc;
          }
        }
        break;
      }
      case 'N': {
        for (const [dr, dc] of directions.knight) {
          const r = row + dr;
          const c = col + dc;
          if (isInBounds(r, c)) {
            if (!board[r][c] || board[r][c][0] !== color) {
              moves.push([r, c]);
            }
          }
        }
        break;
      }
      case 'Q': {
        for (const [dr, dc] of [...directions.rook, ...directions.bishop]) {
          let r = row + dr;
          let c = col + dc;
          while (isInBounds(r, c)) {
            if (!board[r][c]) {
              moves.push([r, c]);
            } else {
              if (board[r][c][0] !== color) moves.push([r, c]);
              break;
            }
            r += dr;
            c += dc;
          }
        }
        break;
      }
      case 'K': {
        for (const [dr, dc] of directions.king) {
          const r = row + dr;
          const c = col + dc;
          if (isInBounds(r, c)) {
            if (!board[r][c] || board[r][c][0] !== color) {
              moves.push([r, c]);
            }
          }
        }

        // Castling logic - only if not ignoreCheck to avoid recursion
        if (!ignoreCheck && !movedPieces[color + 'K'] && !inCheck) {
          const rowIndex = color === 'w' ? 7 : 0;
          const opponentColor = color === 'w' ? 'b' : 'w';

          // Kingside castling
          if (!movedPieces[color + 'RRight'] &&
              areSquaresEmpty(board, rowIndex, 5, 6) &&
              areSquaresSafe(board, rowIndex, [4, 5, 6], opponentColor)) {
            moves.push([rowIndex, 6]);
          }

          // Queenside castling
          if (!movedPieces[color + 'RLeft'] &&
              areSquaresEmpty(board, rowIndex, 1, 3) &&
              areSquaresSafe(board, rowIndex, [2, 3, 4], opponentColor)) {
            moves.push([rowIndex, 2]);
          }
        }
        break;
      }
      default:
        break;
    }

    return moves;
  };

  // Check if current player's king is in check
  const isKingInCheck = (board, color) => {
    const kingPos = findKing(board, color);
    if (!kingPos) return false;
    const opponentColor = color === 'w' ? 'b' : 'w';
    return isSquareAttacked(board, kingPos[0], kingPos[1], opponentColor);
  };

  // Filter moves that leave own king in check
  const filterLegalMoves = (board, row, col, moves) => {
    const color = board[row][col][0];
    return moves.filter(([r, c]) => {
      const newBoard = board.map(r => r.slice());
      newBoard[r][c] = newBoard[row][col];
      newBoard[row][col] = null;
      return !isKingInCheck(newBoard, color);
    });
  };

  // Get all legal moves for current player
  const getAllLegalMoves = (board, color) => {
    const allMoves = [];
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        if (board[r][c] && board[r][c][0] === color) {
          const rawMoves = calculateRawMoves(board, r, c);
          const legalMoves = filterLegalMoves(board, r, c, rawMoves);
          if (legalMoves.length > 0) {
            allMoves.push({ from: [r, c], to: legalMoves });
          }
        }
      }
    }
    return allMoves;
  };

  useEffect(() => {
    const check = isKingInCheck(board, turn);
    setInCheck(check);

    if (check) {
      const kingPos = findKing(board, turn);
      setKingInCheckPos(kingPos);
    } else {
      setKingInCheckPos(null);
    }

    const legalMoves = getAllLegalMoves(board, turn);
    if (legalMoves.length === 0) {
      if (check) {
        setGameStatus('checkmate');
      } else {
        setGameStatus('stalemate');
      }
    } else {
      setGameStatus('ongoing');
    }
  }, [board, turn]);

  const onSquareClick = (row, col) => {
    if (gameStatus !== 'ongoing') return;

    if (selected) {
      const validMoves = calculatePossibleMoves(selected[0], selected[1]);
      const isValidMove = validMoves.some(([r, c]) => r === row && c === col);

      if (selected[0] === row && selected[1] === col) {
        setSelected(null);
        setPossibleMoves([]);
        return;
      }

        if (isValidMove) {
          const newBoard = board.map(r => r.slice());

          // Check if castling move
          const piece = newBoard[selected[0]][selected[1]];
          const color = piece[0];
          const type = piece[1];

          // En Passant capture handling
          if (type === 'P' && lastDoublePawnMove) {
            const dir = color === 'w' ? -1 : 1;
            if (row === selected[0] + dir && col === lastDoublePawnMove.col && Math.abs(col - selected[1]) === 1) {
              // Remove the captured pawn
              newBoard[selected[0]][col] = null;
            }
          }

          if (type === 'K' && Math.abs(col - selected[1]) === 2) {
            const rowIndex = selected[0];
            // Kingside castling
            if (col === 6) {
              // Move king
              newBoard[rowIndex][6] = piece;
              newBoard[selected[0]][selected[1]] = null;
              // Move rook
              const rook = newBoard[rowIndex][7];
              newBoard[rowIndex][5] = rook;
              newBoard[rowIndex][7] = null;
            }
            // Queenside castling
            else if (col === 2) {
              // Move king
              newBoard[rowIndex][2] = piece;
              newBoard[selected[0]][selected[1]] = null;
              // Move rook
              const rook = newBoard[rowIndex][0];
              newBoard[rowIndex][3] = rook;
              newBoard[rowIndex][0] = null;
            }
            setBoard(newBoard);
            setSelected(null);
            setPossibleMoves([]);
            setTurn(turn === 'w' ? 'b' : 'w');

          // Update movedPieces state for king and rook
          setMovedPieces(prev => {
            const updated = {
              ...prev,
              [color + 'K']: true,
              [color + (col === 6 ? 'RRight' : 'RLeft')]: true,
            };
            console.log('Castling movedPieces updated:', updated);
            return updated;
          });
            return;
          }

          // Normal move
          // Delay board update if pawn promotion is pending
          if (type === 'P') {
            const promotionRow = color === 'w' ? 0 : 7;
            if (row === promotionRow) {
              // Pause game and show promotion UI
              setPromotionPending(true);
              setPromotionPosition([row, col]);
              setPromotionColor(color);
              setSelected(null);
              setPossibleMoves([]);
              // Do NOT update board here to avoid duplication
              return;
            }
          }

          newBoard[row][col] = newBoard[selected[0]][selected[1]];
          newBoard[selected[0]][selected[1]] = null;
          setBoard(newBoard);
          setSelected(null);
          setPossibleMoves([]);
          setTurn(turn === 'w' ? 'b' : 'w');

          // Update movedPieces state if king or rook moved
          if (type === 'K') {
            setMovedPieces(prev => {
              const updated = { ...prev, [color + 'K']: true };
              console.log('King movedPieces updated:', updated);
              return updated;
            });
          } else if (type === 'R') {
            if (selected[1] === 0) {
              setMovedPieces(prev => {
                const updated = { ...prev, [color + 'RLeft']: true };
                console.log('Rook left movedPieces updated:', updated);
                return updated;
              });
            } else if (selected[1] === 7) {
              setMovedPieces(prev => {
                const updated = { ...prev, [color + 'RRight']: true };
                console.log('Rook right movedPieces updated:', updated);
                return updated;
              });
            }
          }

          // Update lastDoublePawnMove state
          if (type === 'P' && Math.abs(row - selected[0]) === 2) {
            setLastDoublePawnMove({ row, col });
          } else {
            setLastDoublePawnMove(null);
          }
        } else {
          const clickedPiece = board[row][col];
          if (clickedPiece && clickedPiece[0] === turn) {
            setSelected([row, col]);
            setPossibleMoves(calculatePossibleMoves(row, col));
          } else {
            setSelected(null);
            setPossibleMoves([]);
          }
        }
      } else {
        const piece = board[row][col];
        if (piece && piece[0] === turn) {
          setSelected([row, col]);
          setPossibleMoves(calculatePossibleMoves(row, col));
        }
      }
    }

  // Calculate possible moves with check filtering
  const calculatePossibleMoves = (row, col) => {
    const rawMoves = calculateRawMoves(board, row, col);
    return filterLegalMoves(board, row, col, rawMoves);
  };

  const restartGame = () => {
    setBoard(initialBoard);
    setSelected(null);
    setTurn('w');
    setPossibleMoves([]);
    setGameStatus('ongoing');
    setInCheck(false);
    setMovedPieces({
      wK: false,
      wRLeft: false,
      wRRight: false,
      bK: false,
      bRLeft: false,
      bRRight: false,
    });
    setLastDoublePawnMove(null);
    setPromotionPending(false);
    setPromotionPosition(null);
    setPromotionColor(null);
  };

  return (
    <div>
      <div className="board-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
        <ChessBoard
          board={board}
          onSquareClick={promotionPending ? () => {} : onSquareClick}
          highlightedSquares={possibleMoves}
          kingInCheckPos={kingInCheckPos}
        />
        {promotionPending && (
          <div className="promotion-modal" style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'white',
            border: '2px solid black',
            padding: '1rem',
            zIndex: 1000,
            display: 'flex',
            gap: '1rem',
          }}>
            {[ 
              { type: 'Q', label: 'Queen' },
              { type: 'R', label: 'Rook' },
              { type: 'B', label: 'Bishop' },
              { type: 'N', label: 'Knight' }
            ].map(({ type, label }) => (
              <button
                key={type}
                onClick={() => handlePromotionChoice(type)}
                style={{ fontSize: '1.5rem', cursor: 'pointer' }}
              >
                {label}
              </button>
            ))}
          </div>
        )}
        <h2 className="turn-indicator" style={{ fontSize: '1.8rem', marginTop: '1rem', textAlign: 'center' }}>
          Turn: {turn === 'w' ? 'White' : 'Black'}{inCheck ? ' (Check)' : ''}
        </h2>
        {gameStatus === 'checkmate' && (
          <>
            {/* Removed black overlay div */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-8 rounded-lg shadow-lg z-60 flex flex-col items-center gap-4 min-w-[200px] animate-fadeIn transition-opacity duration-700" style={{ animationFillMode: 'forwards', animationDelay: '300ms', opacity: 1 }}>
              <h2 className="m-0 text-2xl text-red-700">Checkmate!</h2>
              <button
                onClick={restartGame}
                className="px-6 py-3 text-lg cursor-pointer text-white rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-green-500"
                style={{ backgroundColor: '#16a34a', transition: 'background-color 0.3s ease' }}
              >
                Restart
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ChessEngine;
