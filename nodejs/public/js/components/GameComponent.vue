<template>
    <div class="grid-item-info">
        <h2>Game</h2>

        <!-- Temporary - should change to selectable user list -->
        <!-- <input id="message" autocomplete="off" placeholder="username" v-model="pickChoice"/>
        <p><button v-on:click="pick()">pick</button></p> -->
        
        <div v-for="player in otherPlayers" :key="player._id">
          <p><button v-on:click="pick(player._id)">{{player.username}}</button></p>
        </div>

        
        <p><button v-on:click="approve()">approve</button></p>
        <p><button v-on:click="reject()">reject</button></p>
        <p><button v-on:click="success()">success</button></p>
        <p><button v-on:click="fail()">fail</button></p>
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
    }
  },
  computed: {
    otherPlayers() {
      return this.playerList.filter(
        player => {return player._id != this.me._id}
      );
    },
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