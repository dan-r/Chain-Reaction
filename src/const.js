const BASE_PATH = "/cr/";
const PLAYER_COLORS = ['#ff5f58', '#00c1ef', '#76c93e', '#ffbf2f'];
const PLAYER_NAMES = ['Red', 'Blue', 'Green', 'Yellow'];
const GAME_MODES = {
    COMPUTER: {
        maxPlayers: 2
    },
    LOCAL: {
        maxPlayers: 4

    },
    ONLINE: {
        maxPlayers: 4
    }
}

export { BASE_PATH, PLAYER_COLORS, PLAYER_NAMES, GAME_MODES };
