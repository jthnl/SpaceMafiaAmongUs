
/**
 * GameManager manages the transition between game states
 * 
 * States:
 * 
 * GAME_STATE_PENDING 
 * - waiting for players to join and room creator to start the game
 * 
 * GAME_STATE_TEAMBUILD
 * - waiting for the current captain to pick players for the quest
 *  
 * GAME_STATE_TEAMVOTE
 * - waiting for the team to vote to 'approve' or 'reject' the quest
 * 
 * GAME_STATE_QUEST
 * - waiting for the quest members to 'success' or 'fail' the quest
 * 
 * GAME_STATE_END
 * - game has ended
 */

const GAME_STATE_PENDING = 0;
const GAME_STATE_TEAMBUILD = 1;
const GAME_STATE_TEAMVOTE = 2;
const GAME_STATE_QUEST = 3;
const GAME_STATE_END = 4;

const Game = require('./Game');

// Turn off game engine logging
// console.log = function() {}

module.exports = class GameManager {

    constructor(playerManager) {
        this.playerManager = playerManager;             // playerManager from the room
        this.game = new Game(this.playerManager);       // create a new Game Object
        this.state = GAME_STATE_PENDING;                // set initial game state
        this.failedVotes = 0;                           // counts for 5 successive fails, immediete fail
    }

    // progresses to the next game state, depending on game conditions
    nextGameState() {
        switch (this.state) {
            case GAME_STATE_PENDING:
                // initialize game
                this.game.init();
                this.game.assign_roles();
                this.printStateDebug(GAME_STATE_PENDING, GAME_STATE_TEAMBUILD);
                this.state = GAME_STATE_TEAMBUILD;
                break;


            case GAME_STATE_TEAMBUILD:
                this.game.enable_team_voting();
                this.printStateDebug(GAME_STATE_TEAMBUILD, GAME_STATE_TEAMVOTE);
                this.state = GAME_STATE_TEAMVOTE;
                break;


            case GAME_STATE_TEAMVOTE:
                let questStarted = this.game.try_to_start_quest();
                if (questStarted) {
                    // quest successfully started - enough votes
                    this.game.current_quest.enable_quest_voting();
                    this.printStateDebug(GAME_STATE_TEAMVOTE, GAME_STATE_QUEST);
                    this.state = GAME_STATE_QUEST;
                } else {
                    // quest failed - not enough votes
                    this.failedVotes++;

                    if (this.failedVotes >= 5) {
                        // 5 consecutive fails, innocents lose
                        this.printStateDebug(GAME_STATE_TEAMVOTE, GAME_STATE_END);
                        this.state = GAME_STATE_END;
                    } else {
                        // try to team build again
                        this.printStateDebug(GAME_STATE_TEAMVOTE, GAME_STATE_TEAMBUILD);
                        this.state = GAME_STATE_TEAMBUILD;
                    }
                }
                break;


            case GAME_STATE_QUEST:
                this.game.resolve_quest();
                let gameDone = this.game.check_win();
                if (gameDone) {
                    // either team has won
                    this.printStateDebug(GAME_STATE_QUEST, GAME_STATE_END);
                    this.state = GAME_STATE_END;
                } else {
                    // game is still ongoing
                    this.printStateDebug(GAME_STATE_QUEST, GAME_STATE_TEAMBUILD);
                    this.state = GAME_STATE_TEAMBUILD;
                }
                break;


            case GAME_STATE_END:
                    // TODO: reset game
                break;

            default:
                console.log("someone messed up, the game should not be in this state.");
        }
    }

    // debug printing
    printStateDebug(fromState, toState) {
        console.log("\n " + fromState + " -> " + toState + " \n");
    }
}