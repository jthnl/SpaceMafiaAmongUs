module.exports = class Player {
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