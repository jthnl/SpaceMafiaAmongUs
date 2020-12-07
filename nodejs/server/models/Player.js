module.exports = class Player {
    // TODO: ADD GAME FROM vincedelaroca-patch-1/game.js
    constructor(_id, username) {
        this._id = _id;
        this.username = username;
        this.role = null;
        this.is_captain = false;
        this.on_quest = false;
        this.quest_voting_enabled = false;
    }
    
    get_player_status() {
    
    }
}