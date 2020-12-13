<template>
    <div class="grid-item-game-component grid-container-game-component">
      <div class="grid-item-game">
        <h2>Game</h2>

        <!-- Temporary - should change to selectable user list -->
        <!-- <input id="message" autocomplete="off" placeholder="username" v-model="pickChoice"/>
        <p><button v-on:click="pick()">pick</button></p> -->

        <div v-if="gameState === 1 && myPlayer.is_captain">
          <h3>Team Building</h3>
          <div v-for="player in playerList" :key="player._id">
            <p v-if="!player.on_team"><button v-on:click="pick(player._id)">{{player.username}}</button></p>
          </div>
        </div>

        <div v-if="gameState === 2 && myPlayer.team_voting_enabled">
          <h3>Team Voting</h3>
          <p><button v-on:click="approve()">Approve</button></p>
          <p><button v-on:click="reject()">Reject</button></p>
        </div>

        <div v-if="gameState === 3 && myPlayer.on_team && myPlayer.quest_voting_enabled">
          <h3>Quest Voting</h3>
          <p><button v-on:click="success()">Success</button></p>
          <p><button v-on:click="fail()">Fail</button></p>
        </div>

        <div v-if="gameState === 4 && myPlayer.roomCreator">
          <p><button v-on:click="newGame()">New Game</button></p>
        </div>
      </div>
      <div class="grid-item-rounds">
        <h2>Rounds</h2>
      </div>
    </div>

</template>

<script>
module.exports = {
  name: "gamecomponent",
  mounted() {
    //this.$socket.open();
    console.log("Game component added");
    this.$socket.emit("whoAmI");
    this.gameCode = localStorage.getItem("gameCode")
    this.$socket.emit("gameInit", localStorage.getItem("gameCode"));
  },
  data: function () {
    return {
        me: [],
        gameCode: "",
        gameState: 0,
        playerList: [],
        gameHistory: [],
    };
  },
  created: function () {
    //    SOCKET IO LISTENERS
    this.sockets.subscribe("accountUserInfo", (data) => {
        this.me = data;
    });
    this.sockets.subscribe("gameUpdate", (data) => {
      this.messageList = data.messageList;
      this.playerList = data.playerList;
      this.gameState = data.gameState;
      // this.gameHistory = data.gameHistory;   // Not implemented yet
    });
  },
  methods: {
    pick: function (chosen_id) {
        console.log("pick");
        this.$socket.emit("pick", this.gameCode, chosen_id);
    },
    approve: function () {
        console.log("approve");
        this.$socket.emit("approve", this.gameCode);
    },
    reject: function () {
        console.log("reject");
        this.$socket.emit("reject", this.gameCode);
    },
    success: function () {
        console.log("success");
        this.$socket.emit("success", this.gameCode);
    },
    fail: function(){
        console.log("fail");
        this.$socket.emit("fail", this.gameCode);
    },
    newGame: function(){
        console.log("newGame");
        this.$socket.emit("newGame", this.gameCode);
    }
  },
  computed: {
    myPlayer: function () {
      let foundPlayer = this.playerList.find(player => player._id === this.me._id);
      console.log(JSON.stringify(foundPlayer));
      return foundPlayer;
    }
  }
};
</script>


<style scoped>
.grid-item-messages {
  position: relative;
}

.force-bottom {
  position: absolute;
  left: 10px;
  right: 10px;
  bottom: 10px;
}
</style>