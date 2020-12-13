// A quest in Space Mafia Among Us.
module.exports = class Quest {
    constructor(number_of_quest_players, round) {
        this.quest_round = round;
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
            console.log('Maximum number of quest players reached!');
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
            console.log('Maximum number of quest votes reached!');
        }

        if (player.quest_voting_enabled == false) {
            console.log('Player has already voted for quest or is not part of the quest!');
        }

        if (vote == true) {
            this.number_of_quest_succeses++;
        } else {
            this.number_of_quest_fails++;
        }

        // Disable quest voting
        player.quest_voting_enabled = false;

        // check if everyone has voted
        for (let i = 0; i < this.number_of_quest_players; i++) {
            if (this.quest_players[i].quest_voting_enabled == true) {
                return false;
            }
        }
        return true;
    }

    reset() {
        this.number_of_quest_succeses = 0;
        this.number_of_quest_fails = 0;
        this.quest_players = [];
    }
}