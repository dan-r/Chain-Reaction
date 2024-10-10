import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button, Grid, Typography, Box } from '@mui/material';
import { PLAYER_COLORS } from './const';

const PlayerSelection = () => {
    const [color, setColor] = useState(PLAYER_COLORS[0]);

    useEffect(() => {
        const interval = setInterval(() => {
            // Change color every 2 seconds
            const nextColor = PLAYER_COLORS[Math.floor(Math.random() * PLAYER_COLORS.length)];
            setColor(nextColor);
        }, 2000); // Change color every 2 seconds

        return () => clearInterval(interval); // Clean up on unmount
    }, []);

    return (
        <>
            <Box
                sx={{
                    width: '100%',
                    height: '100%',
                    backgroundColor: color,
                    transition: 'background-color 0.5s ease', // Smooth transition effect
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

                    <Grid item>
                        <Typography variant="h6" gutterBottom>
                            Select number of players
                        </Typography>
                        {/* Creating buttons for player selection */}
                        <Grid container direction="column" spacing={2} alignItems="center">
                            {[2, 3, 4].map((numPlayers) => (
                                <Grid item key={numPlayers}>
                                    <Link to={`./game/${numPlayers}`} style={{ textDecoration: 'none' }}>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            sx={{ width: '150px' }} // Uniform button width for aesthetics
                                        >
                                            {numPlayers} Player{numPlayers > 1 ? 's' : ''}
                                        </Button>
                                    </Link>
                                </Grid>
                            ))}
                        </Grid>
                    </Grid>
                </Grid>
            </Box>
        </>
    );
};

export default PlayerSelection;
