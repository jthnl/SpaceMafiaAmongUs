/* TO-DO:
* No Voting Phase atm
* Convert this into a working game engine i.e. little-to-no global variables, etc. 
* Incorporate setting how many tasks per round
* What happens when there are 2 more valid tasks to be done? And how do we properly allocate them to players? Can players have no tasks for a round?
* Figure out how to balance kill rate vs task completion rate, considering multiple kills as well
* Other things I can't think of right now
*/

endgame = false;
let taskbar = 0;
let round = 0;
let taskWorth = 0; // % Worth
let tasks = []; // Selected tasks
let tasklist = []; // Tasks in tasks.txt
let taskCount = []; // Task limit check
let traitors = []; // Traitor list
let players = ['Paru','Rainer','Vince','Evan','Jath', 'Juan'];




/* Loads the tasks.txt into tasklist */
function loadTasks() {
	let fs = require('fs');
	tasklist = fs.readFileSync('tasks.txt').toString().split("\n");
	console.log("Tasks Loaded");
}

function init(ntasks, nplayers, ntraitors, tasklimit) {
	endgame = false;
	taskbar = 0;
	this.ntasks = ntasks;
	this.nplayers = players.length; 
	this.ntraitors = ntraitors;
	this.tasklimit = tasklimit;
	
	loadTasks(); 
	traitors = chooseTraitors(players,ntraitors); // Generate traitors list
	tasks = chooseInnocentTasks(tasklist,ntasks); // Generate tasks list (=/ not task mount)
	
	taskCount = new Array(tasks.length); // [0,0,0,0] means no tasks are done. [5,5,5,5] means no tasks left (assuming 4 tasks) so 4 task * 5 tasklimit = 20 tasks in total.
	taskCount.fill(0); // Initialize task counter
	
	taskWorth = (100 / (ntasks * tasklimit)) // Each task is worth this amount
	
	console.log("Each task is worth " +taskWorth+"% when completed.");
	console.log("Traitors are: " + traitors);
	console.log(tasks);
}

/* Randomly chooses the traitors based on ntraitors */
function chooseTraitors(players,ntraitors) {
    let result = new Array(ntraitors);
        len = players.length;
        taken = new Array(len);
    if (ntraitors > len)
        throw new RangeError("chooseTraitors: more elements taken than available");
    while (ntraitors--) {
        let x = Math.floor(Math.random() * len);
        result[ntraitors] = players[x in taken ? taken[x] : x];
        taken[x] = --len in taken ? taken[len] : len;
    }
    return result; // Stored in result[0], result[1] ... 
}

/* Randomly chooses the match tasks based on ntasks */
function chooseInnocentTasks(tasklist,ntasks) {
	    let result = new Array(ntasks);
        len = tasklist.length;
        taken = new Array(len);
    if (ntasks > len)
        throw new RangeError("chooseInnocentTasks: more elements taken than available");
    while (ntasks--) {
        let x = Math.floor(Math.random() * len);
        result[ntasks] = tasklist[x in taken ? taken[x] : x];
        taken[x] = --len in taken ? taken[len] : len;
    }
    return result; // Stored in result[0], result[1] ... 
}

/* Choose random task from available tasks */
function randomTask() {
	let t = tasks[Math.floor(Math.random() * tasks.length)];
	return t;
}

/* Kill player */
function killPlayer(target) {
	for(let i = 0; i < players.length; i++){ 
        if( players[i] === target) {    
            players.splice(i, 1); // Remove player from player list

			if(!traitors.includes(target)) {
				adjustTaskWorth() // If player is not a traitor, adjust the taskbar worth
				console.log("Killed player: " +target+ "(Innocent)");	
			} else {
				console.log("Killed player: " +target+ "(Traitor)");	
			}
			
        }
    }
}

/* Allocate task worth to each player. */
function adjustTaskWorth(index) {
	taskWorth = taskWorth + (taskWorth / (players.length-1)) 
	console.log("Each task is now worth: " +taskWorth);	
}

/* Logic is kinda/pretty broken. h e l p*/
function simulateRound() {
	if (endgame === false) {
		round++;
		console.log("=========Round " +round+"=========\n");
		
		// Has every player do a task
		for (let i in players) {
			console.log("*******"+players[i]+"'s turn!*******");
			let j = 0;
			let t = randomTask(); // Picks a random task
			while (j < tasks.length) {
				// If t matches the random task, increment taskCount for t
				if(tasks[j] === t && taskCount[j] < tasklimit && !checkWin()) {
					taskCount[j] = taskCount[j] + 1; 
					taskbar = taskbar + taskWorth; // Increase taskbar
					console.log(players[i] + " received task: " + tasks[j]);
					console.log("Taskbar is at " +taskbar+"%");
					break;
					
				} else if (checkWin()){
					break;
					
				} else {
					j++;
				}
			}
			console.log("Task Count: " +taskCount + "\n");
			if(checkWin()) break;
		}
	} else {
		console.log("Tried to simulate new round but failed because the game has ended. Initialize new game.");
	}
}

/* Checks for win condition */
function checkWin() {
	if(players.length === traitors.length) { // If number of traitors = players
		console.log("Traitors Win");
		endgame = true;
		return true;
	} else if (traitors.length === 0) { // If no more traitors
		console.log("Innocents Win");
		endgame = true;
		return true;
	} else if (taskbar > 99) { // If tasks are all completed
		console.log("Innocents Win");
		endgame = true;
		return true;
	} else {
		return false;
	}
}

/* CALLABLES HERE */

init(4,6,2,5); // 4 tasks from tasks.txt, 6 players, 2 traitors, 5 of the seven tasks are valid
console.log(players);

simulateRound();
simulateRound();
killPlayer('Vince');
killPlayer('Evan');
simulateRound();
simulateRound();
simulateRound();
simulateRound();
