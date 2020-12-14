
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
        this.gameActive = false;                        // game currently ongoing
    }

    // progresses to the next game state, depending on game conditions
    nextGameState() {
        switch (this.state) {
            case GAME_STATE_PENDING:
                // initialize game
                this.gameActive = true;
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
                    this.game.failed_votes++;

                    let gameDone = this.game.check_win();
                    if (gameDone) {
                        // either team has won
                        this.gameActive = false;
                        this.printStateDebug(GAME_STATE_TEAMVOTE, GAME_STATE_END);
                        this.state = GAME_STATE_END;
                    } else {
                        // game is still ongoing
                        this.printStateDebug(GAME_STATE_TEAMVOTE, GAME_STATE_TEAMBUILD);
                        this.state = GAME_STATE_TEAMBUILD;
                    }
                }
                break;


            case GAME_STATE_QUEST:
                this.game.failed_votes = 0;
                this.game.resolve_quest();
                let gameDone = this.game.check_win();
                if (gameDone) {
                    // either team has won
                    this.gameActive = false;
                    this.printStateDebug(GAME_STATE_QUEST, GAME_STATE_END);
                    this.state = GAME_STATE_END;
                } else {
                    // game is still ongoing
                    this.printStateDebug(GAME_STATE_QUEST, GAME_STATE_TEAMBUILD);
                    this.state = GAME_STATE_TEAMBUILD;
                }
                break;


            case GAME_STATE_END:
                this.printStateDebug(GAME_STATE_END, GAME_STATE_PENDING);
                this.state = GAME_STATE_PENDING;
                break;

            default:
                console.log("someone messed up, the game should not be in this state.");
        }
    }

    // returns game state
    getState(){
        return this.state;
    }

    // captain picks player for the quest
    addPlayerToTeam(pick_id){
        return this.game.add_player_to_team(pick_id);;
    }

    // player approves or rejects the quest
    voteForTeam(player, vote){
        if(player.team_voting_enabled){
            return this.game.vote_for_team(player, vote);
        }
    }

    // quest member succeeds or fails the quest
    voteForQuest(player, vote){
        if(player.quest_voting_enabled){
            return this.game.current_quest.vote_for_quest(player, vote);
        }
    }

    // returns quest history
    getQuestHistory(){
        let gameHistory = {
            currentQuest: this.game.current_quest,
            questHistory: this.game.quests,
            votesFailed: this.game.failed_votes
        }
        return gameHistory;
    }

    // returns the winner of the game
    getWinner(){
        if(this.state === GAME_STATE_END){
            return this.game.get_winner();
        } else {
            return "Undetermined";
        }
    }

    // debug printing
    printStateDebug(fromState, toState) {
        console.log("\n " + fromState + " -> " + toState + " \n");
    }
}