/**
 * PlayerManager manages a list of Player objects
 * Player Object - represents a user
 */

module.exports = class PlayerManager {

    constructor() {
        this.playerList = [];
    }

    addPlayer(user) {
        this.playerList.push(new Player(user._id, user.username, user.name));
    }

    removePlayer(player_id) {
        this.playerList = this.userlist.filter(user => user._id !== player_id);
    }

    getPlayerCount(){
        return this.playerList.length;
    }

    getPlayer(player_id) {
        let usr = this.playerList.find((user) => {
            return JSON.stringify(player_id) === JSON.stringify(user._id);
        });
        if (usr) {
            return usr;
        }
        return null;
    }

    playersReady(){
        let players = this.playerList.filter(user => user.roomCreator !== true);
        // not enough players
        if(players.length < 5){
            return false;
        }
        // else, check if everyone else is ready
        let allReady = true;
        for(let i = 0; i < players.length; i++){
            if(players[i].gameReady === false){
                allReady = false;
            }
        }
        return allReady;
    }

    printList() {
        console.log(JSON.stringify(this.playerList, null, 1));
    }
}

class Player {
    constructor(_id, username, name) {
        this._id = _id;
        this.username = username;
        this.name = name;
        this.roomCreator = false;
        this.gameReady = false;
        this.role = null;
        this.is_captain = false;
        this.on_team = false;
        this.team_voting_enabled = false; // Vote to approve/refuse a team
        this.quest_voting_enabled = false; // Vote to succeed/fail a quest
    }
}