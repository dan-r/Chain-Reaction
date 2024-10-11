import Easy from './Easy';

const getAIMove = (board, gridSize, placedCounters, difficulty) => {
    const difficulties = [
        Easy
    ]
    return difficulties[difficulty](board, gridSize, placedCounters);
}

export { getAIMove }
