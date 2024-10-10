import React from 'react';
import { Paper } from '@mui/material';
import './Cell.css';

const diceDots = (count) => {
  let dots = [];
  for (let i = 0; i < count; i++) {
    dots.push(<span key={i} className="dot" />);
  }
  return dots;
};

const Cell = ({ count, color, onClick }) => {
  const styles = {
    backgroundColor: color ? color : '#f0f0f0',
    borderRadius: '12px', // Rounded corners
    transition: 'background-color 0.3s, transform 0.3s',
    // transform: count > 0 ? `scale(${1 + count * 0.1})` : 'scale(1)',
  };

  return (
    <Paper
      elevation={4}
      className="cell"
      style={styles}
      onClick={onClick}
      square
    >
      {count > 0 && <div className="dice-face">{diceDots(count)}</div>}
    </Paper>
  );
};

export default Cell;
