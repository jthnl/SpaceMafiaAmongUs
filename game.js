/**
 * The game engine for Space Mafia Among Us.
 */

"use strict";

// Turn off game engine logging
// console.log = function() {}

const NUMBER_OF_QUESTS = 5;
const NUMBER_OF_FAILS_REQUIRED_FOR_FAIL = 1;

const INNOCENT_ROLE = "INNOCENT";
const TRAITOR_ROLE = "TRAITOR";

// Allow only 2 numbers of players: 5 or 6
const MIN_NUMBER_OF_PLAYERS = 5;
const MAX_NUMBER_OF_PLAYERS = 6;

// Game setup for 5 players
const NUMBER_OF_PLAYERS_FOR_5 = 5;
const NUMBER_OF_INNOCENT_PLAYERS_FOR_5 = 3;
const NUMBER_OF_TRAITOR_PLAYERS_FOR_5 = 2;
const QUEST_1_SIZE_FOR_5 = 2;
const QUEST_2_SIZE_FOR_5 = 3;
const QUEST_3_SIZE_FOR_5 = 2;
const QUEST_4_SIZE_FOR_5 = 3;
const QUEST_5_SIZE_FOR_5 = 3;

// Game setup for 6 players
const NUMBER_OF_PLAYERS_FOR_6 = 6;
const NUMBER_OF_INNOCENT_PLAYERS_FOR_6 = 4;
const NUMBER_OF_TRAITOR_PLAYERS_FOR_6 = 2;
const QUEST_1_SIZE_FOR_6 = 2;
const QUEST_2_SIZE_FOR_6 = 3;
const QUEST_3_SIZE_FOR_6 = 4;
const QUEST_4_SIZE_FOR_6 = 3;
const QUEST_5_SIZE_FOR_6 = 4;

/**
 * A player of Space Mafia Among Us.
 */
class Player {
    constructor(name) {
        this.name = name;
        this.role = null;
        this.is_captain = false;
        this.on_quest = false;
    }

    get_player_status() {

    }
}

/**
 * A game of Space Mafia Among Us.
 */
class Game {
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
                break;
            case NUMBER_OF_PLAYERS_FOR_6:
                this.number_of_innocent_players = NUMBER_OF_INNOCENT_PLAYERS_FOR_6;
                this.number_of_traitor_players = NUMBER_OF_TRAITOR_PLAYERS_FOR_6;
                break;
            default:
                throw 'Invalid number of players!';
        }

        this.captain_index = -1;
        this.players = [];
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

    get_game_status() {

    }

    print_game_status(message) {
        console.log("****************************************");
        console.log(message);
        console.log(this);
    }
}

// Simulation

// Create a game
let game = new Game();

// Initialize with 6 players
game.init(6);

// Create players
let player_paru = new Player('Paru');
let player_juan = new Player('Juan');
let player_vince = new Player('Vince');
let player_rainer = new Player('Rainer');
let player_evan = new Player('Evan');
let player_jath = new Player('Jath');

game.print_game_status("Create players");

// Add players to game
game.add_player(player_paru);
game.add_player(player_juan);
game.add_player(player_vince);
game.add_player(player_rainer);
game.add_player(player_evan);
game.add_player(player_jath);

game.print_game_status("Add players to game");

// Assign roles
game.assign_roles();

game.print_game_status("Assign roles");

// Enter team building phase

// Enter quest phase

// /* TO-DO:
// * Voting System
// * Convert this into a working game engine i.e. little-to-no global variables, etc. 
// * Players can get duplicate tasks. I don't know any good sorting algorithm for that.
// * Combine with frontend
// */

// endgame = false;
// let taskbar = 0;
// let round = 0;
// let taskWorth = 0; // % Worth
// let tasks = []; // Selected tasks
// let tasklist = []; // Tasks in tasks.txt
// let PLAYERS = ['Paru','Rainer','Vince','Evan','Jath', 'Juan']; //PLACEHOLDER FOR REAL USERNAME ARRAY
// let room = {};



// /* ===ROOM CODE GENERATOR===
// * Function used by createRoom()
// * Generates random 4 digit code i.e. i < 4 in for loop
// */
// function generateRoomCode() {
//    let roomCode           = '';
//    let characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
//    let charactersLength = characters.length;
//    for (let i = 0; i < 4; i++ ) {
//       roomCode += characters.charAt(Math.floor(Math.random() * charactersLength));
//    }
//    return roomCode;
// }



// /* ===CREATES ROOM===
// * Called at init()
// * Creates the default JSON 'Room' Object with proper variables
// * This function assumes that no player has connected and just generates an empty room
// */
// function createRoom() {
// 	let roomCode = generateRoomCode();
// 	room = {
// 		"code":roomCode,
// 		"players": []
// 	};

// 	console.log("Room created with code: " +roomCode);
// }



// /* ===LOAD PLAYERS===
// * Called at init()
// * Fills the JSON 'Room' Object with all the player names and empty player info
// * name (nickname/username)
// * role (innocent/traitor)
// * status (dead/alive)
// * tasks [Task1Desc, Task2Desc, ...] -- will change every round. Could send this to the server to display
// */
// function loadPlayers() {
// 	/* TO-DO: 
// 	* Store all names of actual connected users in the room, in an array
// 	* For now the 'PLAYERS' array is the placeholder array i.e. [Paru, Rainer, etc.]
// 	* Change 'PLAYERS' in the loop to the actual working array in the future.
// 	*/

// 	let temp = '';
// 	for (let j in PLAYERS) {
// 		temp = PLAYERS[j];
// 		room.players.push({"name":temp, "role":"Innocent", "status":"Alive", "tasks":[]});
// 	}

// 	console.log("Players loaded.");
// }



// /* ===LOAD TASKS===
// * Called at init()
// * Reads the tasks.txt file and copies each onto 'tasklist' array
// * 'tasklist' is currently a global variable 
// */
// function loadTasks() {
// 	let fs = require('fs');
// 	tasklist = fs.readFileSync('tasks.txt').toString().split("\n");

// 	console.log("Tasks loaded.");
// }



// /* ===INITIALIZATION=== */
// function init(ntasks, nplayers, ntraitors, tasklimit, tasksPerRound) {
// 	endgame = false;
// 	taskbar = 0;
// 	this.ntasks = ntasks;
// 	this.nplayers = PLAYERS.length; 
// 	this.ntraitors = ntraitors;
// 	this.tasklimit = tasklimit;
// 	this.tasksPerRound = tasksPerRound;

// 	createRoom();
// 	loadPlayers();
// 	loadTasks(); 

// 	chooseTraitors(PLAYERS,ntraitors); // Generate traitors list
// 	tasks = chooseValidTasks(tasklist,ntasks); // Generate tasks list (=/ not task amount)
// 	tasks = taskSpread(tasks,tasklimit);

// 	taskWorth = (100 / (tasks.length)); // Each task is worth this amount

// 	console.log("Each task is worth " +taskWorth+"% when completed.");
// 	console.log(room);
// }



// /* ===CHOOSE TRAITORS=== 
// * Called at init()
// * Assigns "Traitor" to the JSON role of the specific people chosen
// * chooseTraitors([x,y,z],1) will choose one traitor from [x,y,z]
// * Traitors are temporarily stored in 'result' variable
// */
// function chooseTraitors(players,ntraitors) {
//     let result = new Array(ntraitors);
//         len = players.length;
//         taken = new Array(len);
//     if (ntraitors > len)
//         throw new RangeError("chooseTraitors: more elements taken than available");
//     while (ntraitors--) {
//         let x = Math.floor(Math.random() * len);
//         result[ntraitors] = players[x in taken ? taken[x] : x];
//         taken[x] = --len in taken ? taken[len] : len;
//     }

// 	// "Fills the names matching in 'result' with "Traitor"
// 	for (let i = 0; i < PLAYERS.length; i++) {
// 		for (j in result) {
// 			if (result[j] === room.players[i].name) room.players[i].role = "Traitor";	
// 		}
// 	}

// 	return result; // Stored in result[0], result[1] ... 
// }



// /* ===CHOOSE VALID TASKS=== 
// * Called at init()
// * Selects 'ntasks' from 'tasklist' (tasks.txt)
// * These are the tasks that will indicate whether a player is innocent or not
// */
// function chooseValidTasks(tasklist,ntasks) {
// 	    let result = new Array(ntasks);
//         len = tasklist.length;
//         taken = new Array(len);
//     if (ntasks > len)
//         throw new RangeError("chooseInnocentTasks: more elements taken than available");
//     while (ntasks--) {
//         let x = Math.floor(Math.random() * len);
//         result[ntasks] = tasklist[x in taken ? taken[x] : x];
//         taken[x] = --len in taken ? taken[len] : len;
//     }

//     return result; // Stored in result[0], result[1] ... 
// }



// /* ===SPREAD TASKS=== 
// * Called at init()
// * Takes valid tasks, multiplies them by the task limit and shuffles them
// * This new array will be distributed to the players
// */
// function taskSpread(validTasks,tasklimit) {
// 	let temp = validTasks
// 	for (let i = 1; i < tasklimit; i++) {
// 		validTasks = validTasks.concat(temp);
// 	}

// 	// Needs a better shuffle sort. Will allow duplicates beside each other
// 	validTasks.sort(() => Math.random() - 0.50);
// 	return validTasks;
// }



// /* ===KILL PLAYER===
// * Sets player status to 'Dead' based on the target player
// * Will adjust what tasks are worth after
// */
// function killPlayer(target) {
// 	for(let i = 0; i < PLAYERS.length; i++){ 
//         if( room.players[i].name === target) {    
// 			room.players[i].status = 'Dead'; 

// 			if(room.players[i].role === "Innocent") {
// 				adjustTaskWorth() // If player is not a traitor, adjust the taskbar worth
// 				console.log("Killed player: " +target+ "(Innocent)");	
// 			} else {
// 				console.log("Killed player: " +target+ "(Traitor)");	
// 			}

//         }
//     }
// }



// /* ===ADJUST TASK WORTH===
// * Function used by killPlayer()
// * Task worth is calculated by 100% / (n valid tasks * task limit)
// * When a player dies, we don't want the rest of the innocents to be at a disadvantage
// * So what we do is set a new taskWorth (currently a global variable)
// * The taskWorth left over by the player that died is split amongst everyone else
// */
// function adjustTaskWorth(index) {
// 	taskWorth = taskWorth + (taskWorth / (PLAYERS.length-1)) 
// 	console.log("Each task is now worth: " +taskWorth+"%");	
// }



// /* ===SIMULATE ROUND===
// * Simulates ONE round of doing tasks
// * Does not killPlayer(). You must call killPlayer() and then run simulateRound()
// * No voting system implemented
// */
// function simulateRound() {
// 	if (endgame === false) {
// 		round++;
// 		console.log("=========Round " +round+"=========\n");

// 		// Run through each player (simulates turn-based gameplay)
// 		for (let i in PLAYERS) {
// 			console.log("*******"+PLAYERS[i]+"'s turn!*******");

// 			// Makes sure to do n tasks based on tasksPerRound settings
// 			for (let j = 0; j < tasksPerRound; j++) {
// 				let t = tasks[tasks.length-1]; // Let t be the last index of tasks array (task will be popped)

// 				// If player is alive and innocent, do tasks
// 				if(room.players[i].role === "Innocent" && room.players[i].status === "Alive") {
// 					room.players[i].tasks.push(t); // Push tasks to player's JSON task information (could be sent to frontend for display)
// 					taskbar = taskbar + taskWorth; // Update task bar

// 					console.log(room.players[i].name + " received task: " + t);
// 					tasks.pop() // Task popped		
// 					console.log("Taskbar is at " +taskbar+"%");
// 					if(checkWin()) break;

// 				// If player is alive and traitor, give a random task (could be a 'fake' valid)
// 				} else if (room.players[i].role === "Traitor" && room.players[i].status === "Alive") {
// 					room.players[i].tasks.push(randomTask()); // Push tasks to player's JSON task information (could be sent to frontend for display)

// 					console.log(room.players[i].name + " (Traitor) received task: " + t);
// 					console.log("Taskbar is still at " +taskbar+"%");
// 					if(checkWin()) break;

// 				// Don't do anything for dead players
// 				} else {
// 					console.log(room.players[i].name + " is dead and cannot perform tasks.");
// 				}
// 			}
// 			if(checkWin()) break;
// 		}

// 	// When the game has ended ('endgame' = true), do not continue the game
// 	} else {
// 			console.log("Tried to simulate new round but failed because the game has ended. Initialize new game.");
// 	}

// 	console.log(room);
// 	clearPlayerTasks(); // Clear all player's tasks to be filled next round (assuming all tasks have been sent to frontend for display)
// 	console.log(room);
// }



// /* ===CLEAR PLAYER TASKS=== 
// * Called in simulateRound()
// * After a round is finished, clear the JSON task info for each player
// */
// function clearPlayerTasks() {
// 	for(let i = 0; i < room.players.length; i++) {
// 		for(let j = 0; j <= room.players[i].tasks.length; j++) {
// 			room.players[i].tasks.pop();
// 		}
// 	}
// }

// /* ===WIN/LOSE CHECK=== 
// * Called in simulateRound()
// * Different win conditions
// */
// function checkWin() {

// 	// Counts alive traitors/innocents
// 	let traitorsalive, innocentsalive = 0;
// 	for(let i = 0; i < PLAYERS.length; i++){
// 		if(room.players[i].role === "Traitors" && room.players[i].status === "Alive") traitorsalive++;
// 		if(room.players[i].role === "Innocent" && room.players[i].status === "Alive") innocentsalive++;
// 	}

// 	if(innocentsalive === traitorsalive) { // If number of traitors = players
// 		console.log("Traitors Win");
// 		endgame = true;
// 		return true;
// 	} else if (traitorsalive === 0) { // If no more traitors
// 		console.log("Innocents Win");
// 		endgame = true;
// 		return true;
// 	} else if (taskbar > 99) { // If tasks are all completed
// 		console.log("Innocents Win");
// 		endgame = true;
// 		return true;
// 	} else if (tasks.length === 0) { // Should not reach here but just for testing purposes
// 		console.log("Innocents Win Because No More Tasks");
// 		endgame = true;
// 		return true;
// 	} else {
// 		return false;
// 	}
// }



// /* ===RANDOM TASK=== 
// * Called in simulateRound()
// * Mainly used for the killer to pull a random task from ALL tasks
// */
// function randomTask() {
// 	let t = tasklist[Math.floor(Math.random() * tasks.length)];
// 	return t;
// }



// /* === 'MAIN' === */

// init(6,6,2,5,2); // 4 tasks from tasks.txt, 6 players, 2 traitors, 5 of the seven tasks are valid, 2 tasks per round

// simulateRound();
// simulateRound();
// killPlayer("Vince");
// simulateRound();
// simulateRound();