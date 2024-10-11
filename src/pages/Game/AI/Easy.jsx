import { PLAYER_COLORS, DIRECTIONS } from "@const";
import { getDistanceFromPlayer } from './utils';

const getAIMove = (board, gridSize, placedCounters) => {
    const aiColor = PLAYER_COLORS[1]; // Assuming AI is player 2
    const playerColor = PLAYER_COLORS[0]; // Assuming the opponent is player 1
    const validMoves = [];
    let bestMove = null;
    let highestPriority = -1;

    const isFirstRound = placedCounters[1] === 0; // If AI hasn't placed any counters yet

    // Iterate through the board to find valid moves and prioritize them
    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
            const cell = board[row][col];

            // In the first round, AI should place its counter far from the opponent, avoiding edges
            const isValidMoveFirstRound = isFirstRound && cell.color === null && row > 0 && row < gridSize - 1 && col > 0 && col < gridSize - 1;

            // After the first round, AI can only place on cells it owns
            const isValidMove = !isFirstRound && cell.color === aiColor;

            if (isValidMoveFirstRound || isValidMove) {
                let priority = 0;

                if (isFirstRound) {
                    // For the first move, prioritize cells far from the opponent and not on the edge
                    priority = getDistanceFromPlayer(row, col, board, gridSize, playerColor);  // Higher distance gets higher priority
                } else {
                    // Assign priority based on how close the cell is to exploding
                    priority = cell.count;

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
                }

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
    return bestMove;
};

export default getAIMove;
