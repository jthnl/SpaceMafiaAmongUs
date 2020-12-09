module.exports = class PlayerManager {
    constructor() {
        this.playerList = [];
    }

    addPlayer(user) {
        this.playerList.push(new Player(user._id, user.username, user.name));
    }

    removePlayer(user) {
        this.userlist.filter(_id => _id === user._id);
    }

    getPlayerCount(){
        return this.playerList.length;
    }

    getPlayer(value) {
        let usr = this.playerList.find((user) => {
            return user._id === value;
        });
        if (usr) {
            return usr;
        }
        return null;
    }

    printList() {
        console.log(JSON.stringify(this.playerList));
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