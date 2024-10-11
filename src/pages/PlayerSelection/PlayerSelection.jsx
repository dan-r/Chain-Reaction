import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button, Grid, Typography, Box } from '@mui/material';
import { PLAYER_COLORS } from '@const';
import PersonIcon from '@mui/icons-material/Person';

const PlayerSelection = () => {
    const [color, setColor] = useState(PLAYER_COLORS[0]);
    const [gameMode, setGameMode] = useState(null);

    useEffect(() => {
        const interval = setInterval(() => {
            const nextColor = PLAYER_COLORS[Math.floor(Math.random() * PLAYER_COLORS.length)];
            setColor(nextColor);
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    // Function to render the player selection buttons based on the selected game mode
    const renderPlayerSelection = () => {
        return (
            <Grid container direction="column" spacing={2} alignItems="center">
                {Array.from({ length: 3 }, (_, index) => index + 2).map((numPlayers) => (
                    <Grid item key={numPlayers}>
                        <Link
                            to={`./game/${gameMode}/${numPlayers}`}
                            style={{ textDecoration: 'none' }}
                            alt={numPlayers + " players"}
                        >
                            <Button
                                variant="contained"
                                color="primary"
                                sx={{ width: '150px' }}
                            >
                                {[...Array(numPlayers)].map((color, index) => (
                                    <PersonIcon />
                                ))}
                            </Button>
                        </Link>
                    </Grid>
                ))}
            </Grid>
        );
    };

    return (
        <>
            <Box
                sx={{
                    width: '100%',
                    height: '100%',
                    backgroundColor: color,
                    transition: 'background-color 0.5s ease',
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    zIndex: -1000,
                }}
            />
            <Box sx={{ padding: 3, textAlign: 'center' }} className={`center-container`}>
                <Grid container justifyContent="center" alignItems="center" direction="column">
                    <Grid item>
                        <Typography variant="h4" gutterBottom>
                            Chain Reaction
                        </Typography>
                    </Grid>

                    {/* Select Game Mode */}
                    {gameMode === null ? (
                        <>
                            <Grid item>
                                <Typography variant="h6" gutterBottom>
                                    Select Game Mode
                                </Typography>
                                <Grid container direction="column" spacing={2} alignItems="center">
                                    <Grid item>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            sx={{ width: '200px' }}
                                            onClick={() => setGameMode('local')}
                                        >
                                            Local Multiplayer
                                        </Button>
                                    </Grid>
                                    <Grid item>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            sx={{ width: '200px' }}
                                            onClick={() => setGameMode('online')}
                                        >
                                            Online Multiplayer
                                        </Button>
                                    </Grid>
                                    <Grid item>
                                        <Link
                                            to="./game/computer/2"
                                        >
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                sx={{ width: '200px' }}
                                            >
                                                Against Computer
                                            </Button>
                                        </Link>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </>
                    ) : (
                        <>
                            <Grid item>
                                <Typography variant="h6" gutterBottom>
                                    Select Number of Players
                                </Typography>
                                {renderPlayerSelection()}
                            </Grid>

                            {/* Go back button to reselect the game mode */}
                            <Grid item>
                                <Button
                                    variant="outlined"
                                    color="secondary"
                                    sx={{ marginTop: 2 }}
                                    onClick={() => setGameMode(null)}
                                >
                                    Back to Game Mode Selection
                                </Button>
                            </Grid>
                        </>
                    )}
                </Grid>
            </Box>
        </>
    );
};

export default PlayerSelection;
