import React, { useState, useEffect } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import Cell from './Cell';
import { Button, Grid, Typography, Box, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import './Game.css';
import { PLAYER_COLORS, PLAYER_NAMES } from './const';

const Game = () => {
    const { players: playerCount } = useParams();
    const players = parseInt(playerCount, 10);

    const [currentPlayer, setCurrentPlayer] = useState(0);
    const [board, setBoard] = useState([]);
    const [gameOver, setGameOver] = useState(false);
    const [winningPlayer, setWinningPlayer] = useState(null);
    const [placedCounters, setPlacedCounters] = useState(new Array(players).fill(0)); // Track placed counters for each player
    const [initialTurnComplete, setInitialTurnComplete] = useState(false); // Track if initial turns are complete
    const [isAnimating, setIsAnimating] = useState(false); // Track if animations are in progress

    const gridSize = players === 2 ? 5 : 7;

    const directions = [
        [0, 1, 'right'], // Right
        [0, -1, 'left'],  // Left
        [1, 0, 'down'],   // Down
        [-1, 0, 'up'],    // Up
    ];

    useEffect(() => {
        setBoard(
            Array(gridSize).fill().map(() => Array(gridSize).fill({ count: 0, color: null, explodeDirection: null, disabled: false }))
        );
        setGameOver(false);
        setWinningPlayer(null);
        setPlacedCounters(new Array(players).fill(0));
        setInitialTurnComplete(false); // Reset the initial turn flag
        setIsAnimating(false); // Reset animation state
    }, [players]);

    const handleClick = (row, col) => {
        if (gameOver || isAnimating) return; // Block user input during animations

        const cell = board[row][col];
        const currentColor = PLAYER_COLORS[currentPlayer];

        // Check if it's the first move (free placement)
        if (placedCounters[currentPlayer] < 1) {
            // Allow placing on an empty cell or their own cell
            if (cell.disabled || (cell.color && cell.color !== currentColor)) return; // Prevent placing on another player's cell
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

                // Enable all cells again
                newBoard.forEach(row => {
                    row.forEach(cell => {
                        cell.disabled = false;
                    });
                });
            } else {
                // Disable adjacent cells until end of first round
                directions.forEach(([dRow, dCol]) => {
                    const newRow = row + dRow;
                    const newCol = col + dCol;

                    if (newRow >= 0 && newRow < gridSize && newCol >= 0 && newCol < gridSize) {
                        newBoard[newRow][newCol].disabled = true;
                    }
                });
            }

            setCurrentPlayer((currentPlayer + 1) % players);
        } else {
            // Only allow adding to a cell that already holds their counter
            if (cell.color !== currentColor) return;

            const newBoard = JSON.parse(JSON.stringify(board));
            newBoard[row][col].count++;
            newBoard[row][col].explodeDirection = null;

            const endOfRound = () => {
                checkGameOver(newBoard);
                setBoard(newBoard);

                const playerCounters = getCountersCount(newBoard);
                let nextPlayer = (currentPlayer + 1) % players;

                while (playerCounters[nextPlayer] === 0) {
                    nextPlayer = (nextPlayer + 1) % players;
                }

                setCurrentPlayer(nextPlayer);
            }

            if (newBoard[row][col].count >= 4) {
                // Start the explosion animation sequence
                setIsAnimating(true); // Block further user input
                explode(newBoard, row, col, currentColor, () => {
                    setIsAnimating(false); // Enable user input after all explosions finish
                    endOfRound();
                });
            } else {
                endOfRound();
                // setTimeout(endOfRound, 500);
            }
        }
    };

    // Modified explode function with animation and queueing logic
    const explode = (board, row, col, color, onComplete) => {
        board[row][col].count = 0;
        board[row][col].color = null;

        const explosionQueue = [];

        let moves = [];

        // Collect all neighboring cells to explode into
        directions.forEach(([dx, dy, direction]) => {
            const newRow = row + dx;
            const newCol = col + dy;
            if (newRow >= 0 && newRow < gridSize && newCol >= 0 && newCol < gridSize) {
                moves.push([newRow, newCol, direction]);
            }
        });
        explosionQueue.push(moves);

        // Sequentially handle each explosion with animation
        const processExplosion = (index) => {
            console.log(explosionQueue);
            if (index >= explosionQueue.length) {
                onComplete(); // Call completion callback after all explosions are done
                return;
            }
            let moves = explosionQueue[index];
            for (let i = 0; i < moves.length; i++) {

                const [newRow, newCol, direction] = moves[i];
                board[newRow][newCol].count++;
                board[newRow][newCol].color = color;
                board[newRow][newCol].explodeDirection = direction;
                setBoard([...board]); // Trigger re-render to update explosion

                setTimeout(() => {
                    if (board[newRow][newCol].count >= 4) {
                        explode(board, newRow, newCol, color, () => processExplosion(index + 1));
                    } else {
                        processExplosion(index + 1);
                    }
                }, 550); // Delay to sync with the animation (500ms)

            }

        };

        processExplosion(0); // Start the explosion sequence
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

    // Check if game is over
    const checkGameOver = (board) => {
        if (!initialTurnComplete) return false;

        const playerCounters = getCountersCount(board);

        if (playerCounters.filter(c => c === 0).length === playerCounters.length - 1) {
            setGameOver(true);
            setWinningPlayer(PLAYER_NAMES[playerCounters.findIndex(c => c > 0)]);
        }
    };

    const handleRestart = () => {
        setBoard(
            Array(gridSize).fill().map(() => Array(gridSize).fill({ count: 0, color: null, explodeDirection: null }))
        );
        setGameOver(false);
        setWinningPlayer(null);
        setCurrentPlayer(0);
        setPlacedCounters(new Array(players).fill(0));
        setInitialTurnComplete(false);
        setIsAnimating(false);
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
    };

    const playerLocationPath = () => {
        const pathname = useLocation().pathname;
        return pathname.substring(0, pathname.lastIndexOf('/', pathname.lastIndexOf('/') - 1));
    }

    return (
        <>
            <Box
                sx={{
                    width: '100%',
                    height: '100vh',
                    backgroundColor: darkenHex(PLAYER_COLORS[currentPlayer], 0.25),
                    transition: 'background-color 0.5s ease',
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    zIndex: -1000,
                }}
            />
            <Box sx={{ padding: 3 }} className="center-container">
                <Grid container spacing={1} justifyContent="center" className="grid">
                    {board.map((row, rowIndex) => (
                        <Grid container item key={rowIndex} spacing={1} justifyContent="center">
                            {row.map((cell, colIndex) => (
                                <Grid item key={`${rowIndex}-${colIndex}`}>
                                    <Cell
                                        count={cell.count}
                                        color={cell.color}
                                        explodeDirection={cell.explodeDirection}
                                        initialTurnComplete={initialTurnComplete}
                                        disabled={cell.disabled}
                                        gridSize={gridSize}
                                        onClick={() => handleClick(rowIndex, colIndex)}
                                    />
                                </Grid>
                            ))}
                        </Grid>
                    ))}
                </Grid>

                <Dialog open={gameOver} onClose={() => handleRestart()}>
                    <DialogTitle>{winningPlayer} wins!</DialogTitle>
                    <DialogContent>
                        <Typography variant="body1" color="textSecondary">
                            Thanks for playing!
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <Link to={playerLocationPath()}>
                            <Button color="info">
                                Change Players
                            </Button>
                        </Link>
                        <Button onClick={() => {
                            handleRestart();
                        }} color="primary">
                            Restart Game
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </>
    );
};

export default Game;
