/**
 * PlayerManager manages a list of Player objects
 * Player Object - represents a user
 */

const Player = require('./Player');

module.exports = class PlayerManager {

    constructor() {
        this.playerList = [];
    }

    addPlayer(user) {
        if (this.getPlayer(user._id) === null) {
            this.playerList.push(new Player(user._id, user.username, user.name));
        }
    }

    removePlayer(player_id) {
        this.playerList = this.userlist.filter(user => user._id !== player_id);
    }

    getPlayerCount() {
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

    playersReady() {
        let players = this.playerList;
        // not enough players
        if (players.length < 5) {
            return false;
        }
        // else, check if everyone else is ready
        let allReady = true;
        for (let i = 0; i < players.length; i++) {
            if (players[i].gameReady === false) {
                allReady = false;
            }
        }
        return allReady;
    }

    printList() {
        console.log(JSON.stringify(this.playerList, null, 1));
    }
}

