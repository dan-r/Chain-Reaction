import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Cell from './Cell';
import { Button, Grid, Typography, Box } from '@mui/material';
import './Game.css';

const PLAYER_COLORS = ['#ff5f58', '#00c1ef', '#76c93e', '#ffbf2f'];
const PLAYER_NAMES = ['Red', 'Blue', 'Green', 'Yellow'];

const Game = () => {
    const { players: playerCount } = useParams();
    const players = parseInt(playerCount, 10);

    const [currentPlayer, setCurrentPlayer] = useState(0);
    const [board, setBoard] = useState([]);
    const [gameOver, setGameOver] = useState(false);
    const [winningPlayer, setWinningPlayer] = useState(null);
    const [placedCounters, setPlacedCounters] = useState(new Array(players).fill(0)); // Track placed counters for each player
    const [initialTurnComplete, setInitialTurnComplete] = useState(false); // Track if initial turns are complete

    const rows = players === 2 ? 5 : 7;
    const cols = players === 2 ? 5 : 7;

    useEffect(() => {
        setBoard(
            Array(rows).fill().map(() => Array(cols).fill({ count: 0, color: null }))
        );
        setGameOver(false);
        setWinningPlayer(null);
        setPlacedCounters(new Array(players).fill(0));
        setInitialTurnComplete(false); // Reset the initial turn flag
    }, [players]);

    const handleClick = (row, col) => {
        if (gameOver) return;

        const cell = board[row][col];
        const currentColor = PLAYER_COLORS[currentPlayer];

        // Check if it's the first move (free placement)
        if (placedCounters[currentPlayer] < 1) {
            // Allow placing on an empty cell or their own cell
            if (cell.color && cell.color !== currentColor) return; // Prevent placing on another player's cell
            const newBoard = JSON.parse(JSON.stringify(board)); // Deep copy of the board
            newBoard[row][col].count = 3;
            newBoard[row][col].color = currentColor;

            // Update the counter placement tracking
            const updatedPlacedCounters = [...placedCounters];
            updatedPlacedCounters[currentPlayer] += 1;
            setPlacedCounters(updatedPlacedCounters);

            setBoard(newBoard);

            // Check if both players have placed their first counters
            if (updatedPlacedCounters.every(count => count > 0)) {
                setInitialTurnComplete(true); // Both players have played
            }

            setCurrentPlayer((currentPlayer + 1) % players);
        } else {
            // Only allow adding to a cell that already holds their counter
            if (cell.color !== currentColor) return;

            const newBoard = JSON.parse(JSON.stringify(board));
            newBoard[row][col].count++;

            if (newBoard[row][col].count >= 4) {
                explode(newBoard, row, col, currentColor);
            }

            setBoard(newBoard);
            checkGameOver(newBoard); // Check win condition after placing a counter

            const playerCounters = getCountersCount(newBoard);
            let nextPlayer = (currentPlayer + 1) % players; // Get next player

            while (playerCounters[nextPlayer] == 0) { // If player has no cells, skip
                nextPlayer = (nextPlayer + 1) % players;
            }

            setCurrentPlayer(nextPlayer);
        }
    };


    const explode = (board, row, col, color) => {
        board[row][col].count = 0;
        board[row][col].color = null;

        const directions = [
            [0, 1], [0, -1], [1, 0], [-1, 0]
        ];

        directions.forEach(([dx, dy]) => {
            const newRow = row + dx;
            const newCol = col + dy;

            if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols) {
                board[newRow][newCol].count++;
                board[newRow][newCol].color = color;

                if (board[newRow][newCol].count >= 4) {
                    explode(board, newRow, newCol, color);
                }
            }
        });
    };

    // Return array of number of counters held by each player
    const getCountersCount = (board) => {
        const playerCounters = new Array(players).fill(0);

        board.forEach(row =>
            row.forEach(cell => {
                if (cell.color) {
                    const playerIndex = PLAYER_COLORS.indexOf(cell.color);
                    if (playerIndex !== -1) {
                        playerCounters[playerIndex]++;
                    }
                }
            })
        );

        return playerCounters;
    };

    // Check if game over: all players have 0 squares except one
    const checkGameOver = (board) => {
        if (!initialTurnComplete) return false;

        const playerCounters = getCountersCount(board);

        if (playerCounters.filter(c => c == 0).length == playerCounters.length - 1) {
            setGameOver(true);
            setWinningPlayer(PLAYER_NAMES[playerCounters.findIndex(c => c > 0)]);
        }
    };

    const handleRestart = () => {
        setBoard(
            Array(rows).fill().map(() => Array(cols).fill({ count: 0, color: null }))
        );
        setGameOver(false);
        setWinningPlayer(null);
        setCurrentPlayer(0);
        setPlacedCounters(new Array(players).fill(0));
        setInitialTurnComplete(false); // Reset the initial turn flag
    };

    const darkenHex = (hex, factor) => {
        // Ensure hex is in the correct format
        hex = hex.replace('#', '');
        
        // Convert hex to RGB
        let r = parseInt(hex.substring(0, 2), 16);
        let g = parseInt(hex.substring(2, 4), 16);
        let b = parseInt(hex.substring(4, 6), 16);
    
        // Darken the color by reducing the RGB values
        r = Math.floor(r * (1 - factor));
        g = Math.floor(g * (1 - factor));
        b = Math.floor(b * (1 - factor));
    
        // Convert RGB back to hex
        const newHex = '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
        
        return newHex;
    }

    return (
        <>
        <Box
            sx={{
                width: '100%',
                height: '2000px',
                backgroundColor: darkenHex(PLAYER_COLORS[currentPlayer], 0.25),
                transition: 'background-color 0.5s ease', // Smooth transition effect
                position: 'fixed',
                top: 0,
                left: 0,
                zIndex: -1000,
            }}
        />
            <Box sx={{ padding: 3 }}>
                {/* <Typography variant="h5" gutterBottom>
                    Current Player: {PLAYER_NAMES[currentPlayer]}
                </Typography> */}

                <Grid container spacing={1} justifyContent="center" style={{ marginTop: '20px' }}>
                    {board.map((row, rowIndex) => (
                        <Grid container item key={rowIndex} spacing={1} justifyContent="center">
                            {row.map((cell, colIndex) => (
                                <Grid item key={`${rowIndex}-${colIndex}`}>
                                    <Cell
                                        count={cell.count}
                                        color={cell.color}
                                        onClick={() => handleClick(rowIndex, colIndex)}
                                    />
                                </Grid>
                            ))}
                        </Grid>
                    ))}
                </Grid>

                {gameOver && (
                    <Box sx={{ marginTop: '20px', textAlign: 'center' }}>
                        <Typography variant="h6" color="error">
                            {winningPlayer} wins!
                        </Typography>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleRestart}
                            style={{ marginTop: '20px' }}
                        >
                            Restart Game
                        </Button>
                    </Box>
                )}
            </Box>
        </>
    );
};

export default Game;
