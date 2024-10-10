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

const Cell = ({ count, color, explodeDirection, initialTurnComplete, onClick }) => {
    const cellRefSprite = useRef(null); // Ref to the cell DOM element
    const cellRefTop = useRef(null);
    const [isAnimating, setIsAnimating] = useState(false); // Local state to track if animation is happening

    const [delayedColor, setDelayedColor] = useState('#f0f0f0');
    const [delayedCount, setDelayedCount] = useState(0);

    useEffect(() => {
        // When explodeDirection changes, trigger the animation
        if (explodeDirection) {
            setIsAnimating(true);

            // Add the direction-specific animation class
            const cellElement = cellRefSprite.current;
            if (cellElement) {
                cellElement.classList.add(`explode-${explodeDirection}`);
            }

            // Remove the animation class after it completes (assuming 500ms duration)
            const animationDuration = 510;
            setTimeout(() => {
                if (cellElement) {
                    cellElement.classList.remove(`explode-${explodeDirection}`);
                }
                setIsAnimating(false); // Reset animation state

            }, animationDuration);
        }
    }, [explodeDirection]);

    useEffect(() => {
        // cellRefTop.current.classList.remove(`cell-animated`);
        if (explodeDirection) {
            setTimeout(() => {
                setDelayedColor(color);
                setDelayedCount(count);
            // cellRefTop.current.classList.add(`cell-animated`);

            }, 500)
        } else {
            setDelayedColor(color);
            setDelayedCount(count);
            // cellRefTop.current.classList.add(`cell-animated`);
        }

    }, [count]);

    return (
        <div className={`cell-container`}>
            {/* Bottom element/sprite (slide animated) */}
            <Paper
                elevation={4}
                ref={cellRefSprite}
                className={`cell`}
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
                className={`cell ${!initialTurnComplete || delayedCount == 0 ? "cell-animated" : ""}`}
                style={{
                    backgroundColor: delayedColor ? delayedColor : '#f0f0f0',
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
