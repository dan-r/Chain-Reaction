import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Grid, Typography, Box } from '@mui/material';

const PlayerSelection = () => {
    return (
        <Box sx={{ padding: 3, textAlign: 'center' }}>
            <Typography variant="h4" gutterBottom>
                Chain Reaction
            </Typography>
            <Grid container justifyContent="center" alignItems="center">
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
    );
};

export default PlayerSelection;
