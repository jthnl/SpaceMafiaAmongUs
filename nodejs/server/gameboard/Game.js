/**
 * The game engine for Space Mafia Among Us.
 */

"use strict";

// Turn off game engine logging
// console.log = function() {}

const NUMBER_OF_QUESTS = 5;
const NUMBER_OF_QUESTS_NEEDED_TO_WIN = 3;
const NUMBER_OF_FAILS_REQUIRED_FOR_FAIL = 1;

const INNOCENT_ROLE = "INNOCENT";
const TRAITOR_ROLE = "TRAITOR";

const SUCCESS_RESULT = "SUCCESS";
const FAIL_RESULT = "FAIL";

// Allow only 2 numbers of players: 5 or 6
const MIN_NUMBER_OF_PLAYERS = 5;
const MAX_NUMBER_OF_PLAYERS = 6;

// Game setup for 5 players
const NUMBER_OF_PLAYERS_FOR_5 = 5;
const NUMBER_OF_INNOCENT_PLAYERS_FOR_5 = 3;
const NUMBER_OF_TRAITOR_PLAYERS_FOR_5 = 2;
const QUEST_1_TEAM_SIZE_FOR_5 = 2;
const QUEST_2_TEAM_SIZE_FOR_5 = 3;
const QUEST_3_TEAM_SIZE_FOR_5 = 2;
const QUEST_4_TEAM_SIZE_FOR_5 = 3;
const QUEST_5_TEAM_SIZE_FOR_5 = 3;
const QUEST_TEAM_SIZES_FOR_5 = [
    QUEST_1_TEAM_SIZE_FOR_5,
    QUEST_2_TEAM_SIZE_FOR_5,
    QUEST_3_TEAM_SIZE_FOR_5,
    QUEST_4_TEAM_SIZE_FOR_5,
    QUEST_5_TEAM_SIZE_FOR_5
];

// Game setup for 6 players
const NUMBER_OF_PLAYERS_FOR_6 = 6;
const NUMBER_OF_INNOCENT_PLAYERS_FOR_6 = 4;
const NUMBER_OF_TRAITOR_PLAYERS_FOR_6 = 2;
const QUEST_1_TEAM_SIZE_FOR_6 = 2;
const QUEST_2_TEAM_SIZE_FOR_6 = 3;
const QUEST_3_TEAM_SIZE_FOR_6 = 4;
const QUEST_4_TEAM_SIZE_FOR_6 = 3;
const QUEST_5_TEAM_SIZE_FOR_6 = 4;
const QUEST_TEAM_SIZES_FOR_6 = [
    QUEST_1_TEAM_SIZE_FOR_6,
    QUEST_2_TEAM_SIZE_FOR_6,
    QUEST_3_TEAM_SIZE_FOR_6,
    QUEST_4_TEAM_SIZE_FOR_6,
    QUEST_5_TEAM_SIZE_FOR_6
];

module.exports = class Game {

    constructor() {
        // Start a game with 5 players by default
        this.init(NUMBER_OF_PLAYERS_FOR_5);
    }

    init(number_of_players) {
        if (number_of_players === undefined) {
            throw 'Undefined number of players!'
        }

        if (number_of_players < MIN_NUMBER_OF_PLAYERS || number_of_players > MAX_NUMBER_OF_PLAYERS) {
            throw 'Invalid number of players!';
        }

        this.number_of_players = number_of_players;

        switch (this.number_of_players) {
            case NUMBER_OF_PLAYERS_FOR_5:
                this.number_of_innocent_players = NUMBER_OF_INNOCENT_PLAYERS_FOR_5;
                this.number_of_traitor_players = NUMBER_OF_TRAITOR_PLAYERS_FOR_5;
                this.quest_team_sizes = QUEST_TEAM_SIZES_FOR_5;
                break;
            case NUMBER_OF_PLAYERS_FOR_6:
                this.number_of_innocent_players = NUMBER_OF_INNOCENT_PLAYERS_FOR_6;
                this.number_of_traitor_players = NUMBER_OF_TRAITOR_PLAYERS_FOR_6;
                this.quest_team_sizes = QUEST_TEAM_SIZES_FOR_6;
                break;
            default:
                throw 'Invalid number of players!';
        }

        this.game_complete = false;
        this.captain_index = -1;
        this.quest_team_size_index = 0;
        this.quest_in_progress = false;

        // Team-related variables
        this.number_of_team_players = 0;
        this.number_of_team_approval = 0;
        this.number_of_team_refusal = 0;

        // Quest-related variables
        this.innocent_wins = 0;
        this.traitor_wins = 0;
        this.current_quest = null;

        // List variables
        this.players = [];
        this.quests = [];

        this.create_quests();
    }

    create_quests() {
        for (let i = 0; i < this.quest_team_sizes.length; i++) {
            this.quests.push(new Quest(this.quest_team_sizes[i]));
        }

        this.current_quest = this.quests[0];
    }

    add_player(player) {
        if (this.players.length >= this.number_of_players) {
            throw 'Maximum number of players reached!';
        }

        this.players.push(player);
    }

    assign_roles() {
        let number_of_innocent_roles_assigned = 0;
        let number_of_traitor_roles_assigned = 0;

        for (let i = 0; i < this.players.length; i++) {
            // If there are no more traitor roles to assign, assign innocent role
            if (number_of_traitor_roles_assigned >= this.number_of_traitor_players) {
                this.players[i].role = INNOCENT_ROLE;
                continue;
            }

            // If there are no more innocent roles to assign, assign traitor role
            if (number_of_innocent_roles_assigned >= this.number_of_innocent_players) {
                this.players[i].role = TRAITOR_ROLE;
                continue;
            }

            // If randomly generated number is in range [0, 0.5), assign innocent role
            if (Math.random() < 0.5) {
                this.players[i].role = INNOCENT_ROLE;
                number_of_innocent_roles_assigned++;
            }
            // If randomly generated number is in range [0.5, 1], assign traitor role
            else {
                this.players[i].role = TRAITOR_ROLE;
                number_of_traitor_roles_assigned++;
            }
        }

        // Choose a random captain
        this.captain_index = Math.floor(Math.random() * this.number_of_players);
        this.players[this.captain_index].is_captain = true;
    }

    add_player_to_team(player) {
        if (this.number_of_team_players >= this.quest_team_sizes[this.quest_team_size_index]) {
            throw 'Maximum number of team players reached!';
        }

        this.players.find(p => p === player).on_team = true;
        this.number_of_team_players++;
        this.quests[this.quest_team_size_index].add_player_to_quest(player);
    }

    enable_team_voting() {
        for (let i = 0; i < this.players.length; i++) {
            this.players[i].team_voting_enabled = true;
        }
    }

    vote_for_team(player, vote) {
        if (this.number_of_team_approval + this.number_of_team_refusal > this.number_of_players) {
            throw 'Maximum number of team votes reached!';
        }

        if (player.team_voting_enabled == false) {
            throw 'Player has already voted for team!';
        }

        if (vote == true) {
            this.number_of_team_approval++;
        } else {
            this.number_of_team_refusal++;
        }

        // Disable team voting
        player.team_voting_enabled = false;
    }

    try_to_start_quest() {
        // If team is approved by a majority of players, start quest
        if (this.number_of_team_approval > this.number_of_team_refusal) {
            this.quest_team_size_index++; // Move on to the next quest team size (i.e., for next round)
            this.quest_in_progress = true;
        }
        // If team is refused by a majority of players, remove everyone on_team
        else {
            for (let i = 0; i < this.players.length; i++) {
                this.players[i].on_team = false;
            }

            this.current_quest.reset();
        }

        // Reset all team-related variables
        this.number_of_team_players = 0;
        this.number_of_team_approval = 0;
        this.number_of_team_refusal = 0;

        this.players[this.captain_index].is_captain = false;

        // Increment captain index, but loop back to the beginning of the array if we reach the end
        let new_captain_index = this.captain_index + 1;
        this.captain_index = new_captain_index < this.number_of_players ? new_captain_index : 0;

        this.players[this.captain_index].is_captain = true;
    }

    resolve_quest() {
        // If we reach the required number of fails to fail, increment traitor wins
        if (this.current_quest.number_of_quest_fails >= NUMBER_OF_FAILS_REQUIRED_FOR_FAIL) {
            this.traitor_wins++;
            this.current_quest.quest_result = FAIL_RESULT;
        } else {
            this.innocent_wins++;
            this.current_quest.quest_result = SUCCESS_RESULT;
        }

        this.current_quest = this.quests[this.quest_team_size_index]; // Move on to next quest
        this.quest_in_progress = false;
    }

    check_win() {
        if (this.traitor_wins >= NUMBER_OF_QUESTS_NEEDED_TO_WIN ||
            this.innocent_wins >= NUMBER_OF_QUESTS_NEEDED_TO_WIN) {
            this.game_complete = true;

            console.log("Check win: game complete");
        }

        console.log("Check win: no winner yet");
    }

    print_game_status(message) {
        console.log("****************************************");
        console.log(message);
        console.log(this);
    }

}

// A quest in Space Mafia Among Us.
class Quest {
    constructor(number_of_quest_players) {
        this.number_of_quest_players = number_of_quest_players;
        this.number_of_quest_succeses = 0;
        this.number_of_quest_fails = 0;
        this.quest_result = null;
        this.quest_players = [];
    }

    get_quest_players() {
        return this.quest_players;
    }

    add_player_to_quest(player) {
        if (this.quest_players.length >= this.number_of_quest_players) {
            throw 'Maximum number of quest players reached!';
        }

        this.quest_players.push(player);
    }

    enable_quest_voting() {
        for (let i = 0; i < this.quest_players.length; i++) {
            this.quest_players[i].quest_voting_enabled = true;
        }
    }

    vote_for_quest(player, vote) {
        if (this.number_of_quest_succeses + this.number_of_quest_fails > this.number_of_quest_players) {
            throw 'Maximum number of quest votes reached!';
        }

        if (player.quest_voting_enabled == false) {
            throw 'Player has already voted for quest or is not part of the quest!';
        }

        if (vote == true) {
            this.number_of_quest_succeses++;
        } else {
            this.number_of_quest_fails++;
        }

        // Disable quest voting
        player.quest_voting_enabled = false;
    }

    reset() {
        this.number_of_quest_succeses = 0;
        this.number_of_quest_fails = 0;
        this.quest_players = [];
    }
}



// // Simulation

// // Create a game
// let game = new Game();

// // Initialize with 6 players
// game.init(NUMBER_OF_PLAYERS_FOR_6);

// // Create players
// let player_paru = new Player(0);
// let player_juan = new Player(1);
// let player_vince = new Player(2);
// let player_rainer = new Player(3);
// let player_evan = new Player(4);
// let player_jath = new Player(5);

// game.print_game_status("Create players");

// // Add players to game
// game.add_player(player_paru);
// game.add_player(player_juan);
// game.add_player(player_vince);
// game.add_player(player_rainer);
// game.add_player(player_evan);
// game.add_player(player_jath);

// game.print_game_status("Add players to game");

// // Assign roles
// game.assign_roles();

// game.print_game_status("Assign roles");

// // Enter team building phase

// // Add players to team (refused team example)
// game.add_player_to_team(player_paru);
// game.add_player_to_team(player_juan);

// game.print_game_status("Add players to team (refused team example)");

// // Enable team voting (refused team example)
// game.enable_team_voting();

// game.print_game_status("Enable team voting (refused team example)");

// // Vote for team (refused team example)
// game.vote_for_team(player_paru, true);
// game.vote_for_team(player_juan, true);
// game.vote_for_team(player_vince, true);
// game.vote_for_team(player_rainer, false);
// game.vote_for_team(player_evan, false);
// game.vote_for_team(player_jath, false);

// game.print_game_status("Vote for team (refused team example)");

// // Try to start quest 1 (refused team example)
// game.try_to_start_quest();

// game.print_game_status("Try to start quest 1 (refused team example)");

// // Add players to team (approved team example)
// game.add_player_to_team(player_vince);
// game.add_player_to_team(player_rainer);

// game.print_game_status("Add players to team (approved team example)");

// // Enable team voting (approved team example)
// game.enable_team_voting();

// game.print_game_status("Enable team voting (approved team example)");

// // Vote for team (approved team example)
// game.vote_for_team(player_paru, true);
// game.vote_for_team(player_juan, true);
// game.vote_for_team(player_vince, true);
// game.vote_for_team(player_rainer, true);
// game.vote_for_team(player_evan, false);
// game.vote_for_team(player_jath, false);

// game.print_game_status("Vote for team (approved team example)");

// // Try to start quest 1 (approved team example)
// game.try_to_start_quest();

// game.print_game_status("Try to start quest 1 (approved team example)");

// // Enter quest phase

// if (game.quest_in_progress) {

//     // Enable quest voting (failed quest example)
//     game.current_quest.enable_quest_voting();

//     game.print_game_status("Enable quest voting (failed quest example)");

//     // Vote for quest (failed quest example)
//     game.current_quest.vote_for_quest(player_vince, true);
//     game.current_quest.vote_for_quest(player_rainer, false);

//     game.print_game_status("Vote for quest (failed quest example)");

//     // Resolve quest (failed quest example)
//     game.resolve_quest();

//     game.print_game_status("Resolve quest (failed quest example)");
// }

// game.check_win();