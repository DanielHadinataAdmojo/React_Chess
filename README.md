# React Chess Game

A modern, interactive chess game built with React and Vite. Play chess with a fully functional chess engine featuring complete chess rules, piece movement validation, and game state management.

## 🎯 Current Features

### ✅ Core Chess Engine
- **Complete Chess Rules Implementation**
  - All standard piece movements (pawn, rook, knight, bishop, queen, king)
  - Check and checkmate detection
  - Castling (kingside and queenside)
  - En passant captures
  - Pawn promotion with piece selection
  - Stalemate detection

### ✅ Interactive Chess Board
- **Visual Chess Board**: 8x8 grid with proper square coloring
- **Piece Images**: High-quality chess piece graphics for all pieces
- **Square Notation**: Algebraic notation displayed on each square
- **Move Highlighting**: Visual indicators for possible moves and selected pieces
- **Check Highlighting**: Special highlighting when king is in check

### ✅ Game State Management
- **Turn-based System**: Alternating white and black moves
- **Move Validation**: Only legal moves are allowed
- **Game Status Tracking**: Ongoing, checkmate, stalemate states
- **Piece Selection**: Click-to-select pieces and target squares
- **Game Restart**: Reset to initial position functionality

### ✅ Technical Features
- **React Components**: Modular, reusable component architecture
- **State Management**: React hooks for game state
- **Responsive Design**: Clean, modern UI
- **Performance Optimized**: Efficient move calculation and rendering

## 🏗️ Project Structure

```
src/
├── components/
│   ├── ChessBoard.jsx      # Visual chess board component
│   ├── ChessEngine.jsx     # Main chess game logic and state
│   ├── ChessGame.jsx       # Alternative game component (legacy)
│   └── ChessBoard.css      # Board styling
├── utils/
│   └── notation.js         # Chess notation utilities
├── assets/
│   └── ChessAssets/        # Chess piece images
├── App.jsx                 # Main application component
└── main.jsx               # Application entry point
```

## 🎮 How to Play

1. **Start the Game**: The board initializes in standard chess starting position
2. **Make Moves**: 
   - Click on a piece to select it (highlighted in yellow)
   - Click on a highlighted square to move the piece
   - Only legal moves are shown as highlighted squares
3. **Special Moves**:
   - **Castling**: Move king two squares toward rook for castling
   - **En Passant**: Capture opponent's pawn that moved two squares past yours
   - **Promotion**: When pawn reaches last rank, choose promotion piece
4. **Game End**: Game ends in checkmate or stalemate with appropriate notifications

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation
```bash
# Clone the repository
git clone [repository-url]

# Navigate to project directory
cd react-chess-game

# Install dependencies
npm install

# Start development server
npm run dev
```

### Build for Production
```bash
npm run build
```

## 🛠️ Development

### Available Scripts
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Technology Stack
- **React 18** - UI framework
- **Vite** - Build tool and development server
- **JavaScript ES6+** - Modern JavaScript features
- **CSS** - Styling with modern features

## 🎯 Roadmap

### Planned Features
- [ ] AI opponent with difficulty levels
- [ ] Move history and undo functionality
- [ ] Save/load game state
- [ ] Chess notation display (PGN format)
- [ ] Timer/clock functionality
- [ ] Sound effects
- [ ] Mobile responsive design improvements
- [ ] Multiplayer support (local/network)

### Technical Improvements
- [ ] TypeScript migration
- [ ] Performance optimizations for move calculation
- [ ] Unit tests for chess logic
- [ ] Component documentation
- [ ] Error handling improvements

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues and pull requests.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Chess piece images from open-source chess sets
- Built with modern web technologies for optimal performance
