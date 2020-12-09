
const GAME_STATE_PENDING = 0;
const GAME_STATE_TEAMBUILD = 1;
const GAME_STATE_TEAMVOTE = 2;
const GAME_STATE_QUEST = 3;
const GAME_STATE_END = 4;

const Game = require('./Game');

module.exports = class GameManager {

    constructor(playerManager) {
        this.playerManager = playerManager;
        this.game = new Game();
        this.state = GAME_STATE_PENDING;
    }

    nextGameState() {
        switch (this.state) {
            case GAME_STATE_PENDING:
                console.log("\n\n\nINITIALIZE GAME\n\n\n");
                this.game.init(this.playerManager.getPlayerCount());
                break;
            case GAME_STATE_TEAMBUILD: 
                break;
            case GAME_STATE_TEAMVOTE:
                break;
            case GAME_STATE_QUEST:
                break;
            case GAME_STATE_END:
                break;
            default:
                console.log("someone messed up, the game should not be in this state.");
        }
    }
}