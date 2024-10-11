const getDistanceFromPlayer = (row, col, board, gridSize, playerColor) => {
    let minDistance = Infinity;
    for (let r = 0; r < gridSize; r++) {
        for (let c = 0; c < gridSize; c++) {
            if (board[r][c].color === playerColor) {
                const distance = Math.sqrt((r - row) ** 2 + (c - col) ** 2);
                if (distance < minDistance) {
                    minDistance = distance;
                }
            }
        }
    }
    return minDistance;
};

export { getDistanceFromPlayer };
