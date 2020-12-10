
const GAME_STATE_PENDING = 0;
const GAME_STATE_TEAMBUILD = 1;
const GAME_STATE_TEAMVOTE = 2;
const GAME_STATE_QUEST = 3;
const GAME_STATE_END = 4;

const Game = require('./Game');

module.exports = class GameManager {

    constructor(playerManager) {
        this.playerManager = playerManager;
        this.game = new Game(this.playerManager);
        this.state = GAME_STATE_PENDING;
    }

    nextGameState() {
        switch (this.state) {
            case GAME_STATE_PENDING:
                console.log("\n\n\nINITIALIZE GAME\n\n\n");
                console.log(this.playerManager.getPlayerCount());
                this.game.init();
                console.log("\n 1 ");
                this.game.assign_roles();
                console.log("\n 2");
                this.state = GAME_STATE_TEAMBUILD;
                console.log("\n 3");
                break;
            case GAME_STATE_TEAMBUILD:
                console.log("\n\n GAME_STATE_TEAMBUILD -> GAME_STATE_TEAMVOTE \n\n");
                this.game.enable_team_voting();
                this.state = GAME_STATE_TEAMVOTE;
                break;
            case GAME_STATE_TEAMVOTE:
                let questStarted = this.game.try_to_start_quest();
                if(questStarted){
                    this.game.current_quest.enable_quest_voting();
                    this.state = GAME_STATE_QUEST;
                    console.log("\n\n GAME_STATE_TEAMVOTE -> GAME_STATE_QUEST \n\n");
                }else{
                    this.state = GAME_STATE_TEAMBUILD;
                    console.log("\n\n GAME_STATE_TEAMVOTE -> GAME_STATE_TEAMBUILD \n\n");
                }
                break;
            case GAME_STATE_QUEST:
                console.log("\n\n GAME_STATE_QUEST \n\n");
                this.game.resolve_quest();
                let gameDone = this.game.check_win();
                if(gameDone){
                    console.log("\n\n GAME_STATE_QUEST -> GAME_STATE_END \n\n");
                    this.state = GAME_STATE_END;
                }else{
                    console.log("\n\n GAME_STATE_QUEST -> GAME_STATE_TEAMBUILD \n\n");
                    this.state = GAME_STATE_TEAMBUILD;
                }
                break;
            case GAME_STATE_END:
                break;
            default:
                console.log("someone messed up, the game should not be in this state.");
        }
    }
}