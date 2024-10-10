import React from 'react';
import { Box, Typography } from '@mui/material';
import { PLAYER_COLORS } from './const';

const CounterDisplay = ({ playerCounters, players }) => {
    return (
        <Box
            sx={{
                position: 'fixed',
                top: 70,
                left: '50%',
                transform: 'translateX(-50%)',
                display: 'flex',
                justifyContent: 'center',
                gap: 2,
                zIndex: 1000,
            }}
        >
            {[...Array(players)].map((color, index) => (
                <Box
                    key={index}
                    sx={{
                        backgroundColor: PLAYER_COLORS[index],
                        color: "white",
                        border: '1px solid #ccc',
                        borderRadius: 2,
                        padding: 2,
                        textAlign: 'center',
                        boxShadow: 1,
                        minWidth: 50,
                    }}
                >
                    <Typography variant="h6">{playerCounters[index]}</Typography>
                </Box>
            ))}
        </Box>
    );
};

export default CounterDisplay;
