import React, { useEffect, useRef, useState } from 'react';
import { Paper } from '@mui/material';
import './Cell.css';

const diceDots = (count) => {
    let dots = [];
    for (let i = 0; i < count; i++) {
        dots.push(<span key={i} className="dot" />);
    }
    return dots;
};

const Cell = ({ count, color, explodeDirection, initialTurnComplete, disabled, gridSize, onClick }) => {
    const cellRefSprite = useRef(null); // Ref to the cell DOM element
    const cellRefTop = useRef(null);

    const [delayedColor, setDelayedColor] = useState('#f0f0f0');
    const [delayedCount, setDelayedCount] = useState(0);

    useEffect(() => {
        // When explodeDirection changes, trigger the animation
        if (explodeDirection) {
            // Add the direction-specific animation class
            const cellElement = cellRefSprite.current;
            if (cellElement) {
                cellElement.classList.add(`explode-${explodeDirection}`);
            }

            // Remove the animation class after it completes
            setTimeout(() => {
                // Set the colour of the currently hidden cells
                setDelayedColor(color);
                setDelayedCount(count);
                
                // Reveal the hidden cell
                if (cellElement) {
                    cellElement.classList.remove(`explode-${explodeDirection}`);
                }
            }, 500);
        }
    }, [explodeDirection]);

    useEffect(() => {
        if (!explodeDirection) {
            setDelayedColor(color);
            setDelayedCount(count);
        }
    }, [count]);

    return (
        <div className={`cell-container-${gridSize}`}>
            {/* Bottom element/sprite (slide animated) */}
            <Paper
                elevation={4}
                ref={cellRefSprite}
                className={`cell cell-${gridSize}`}
                style={{
                    backgroundColor: color ? color : '#f0f0f0'
                }}
                onClick={onClick}
            >
                {count > 0 && <div className="dice-face">{diceDots(count)}</div>}
            </Paper>
            
            {/* Top element (colour animated) */}
            <Paper
                elevation={0}
                ref={cellRefTop}
                // Animate colour changes only for the first turn and for when we are going 4 -> 0 
                className={`cell cell-${gridSize} ${!initialTurnComplete || delayedCount == 0 ? "cell-animated" : ""}`}
                style={{
                    backgroundColor: disabled ? "rgb(185, 185, 185)" : delayedColor ? delayedColor : '#f0f0f0',
                    transform: "translateY(-100%)",
                    zIndex: "10"
                }}
                onClick={onClick}
            >
                {delayedCount > 0 && <div className="dice-face">{diceDots(delayedCount)}</div>}
            </Paper>
        </div>
    );
};

export default Cell;
