import { PLAYER_COLORS, DIRECTIONS } from "@const";

const makeAIMove = (board, gridSize, placedCounters) => {
    const aiColor = PLAYER_COLORS[1]; // Assuming AI is player 2
    const validMoves = [];
    let bestMove = null;
    let highestPriority = -1;

    const isFirstRound = placedCounters[1] === 0; // If AI hasn't placed any counters yet

    // Iterate through the board to find valid moves and prioritize them
    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
            const cell = board[row][col];

            // In the first round, AI can place on any empty cell
            const isValidMoveFirstRound = isFirstRound && cell.color === null;

            // After the first round, AI can only place on cells it owns
            const isValidMove = !isFirstRound && cell.color === aiColor;

            if (isValidMoveFirstRound || isValidMove) {
                let priority = 0;

                // Assign priority based on how close the cell is to exploding
                if (cell.count === 3) {
                    priority = 3;  // Highest priority: Exploding next turn
                } else if (cell.count === 2) {
                    priority = 2;  // Medium priority: Can get close to exploding
                } else if (cell.count === 1) {
                    priority = 1;  // Low priority: Basic move
                }

                // Check if this move creates a chain reaction
                DIRECTIONS.forEach(([dx, dy]) => {
                    const newRow = row + dx;
                    const newCol = col + dy;
                    if (newRow >= 0 && newRow < gridSize && newCol >= 0 && newCol < gridSize) {
                        const neighbor = board[newRow][newCol];
                        if (neighbor.color === aiColor && neighbor.count === 3) {
                            priority += 1; // Extra priority for potential chain reaction
                        }
                    }
                });

                validMoves.push({ row, col, priority });

                // Keep track of the highest priority move
                if (priority > highestPriority) {
                    highestPriority = priority;
                    bestMove = { row, col };
                }
            }
        }
    }

    // Return the best move (highest priority)
    return bestMove ? bestMove : null;
};

export { makeAIMove };
