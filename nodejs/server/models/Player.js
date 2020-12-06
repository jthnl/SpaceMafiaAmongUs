module.exports = class Player {
    // TODO: ADD GAME FROM vincedelaroca-patch-1/game.js
    constructor(id, username) {
        this.id = id;
        this.username = username;
        this.role = null;
        this.is_captain = false;
        this.on_quest = false;
        this.quest_voting_enabled = false;
    }
    
    get_player_status() {
    
    }
}