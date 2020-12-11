<template>
  <div class="grid-item-users">
    <h2>Users</h2>
    <ul id="users">
      <li v-for="player in playerList" :key="player._id">
        <div v-if="!player.gameReady">
           {{ player.name }} <span>&#10006;</span>
        </div>
        <div v-if="player.gameReady">
           {{ player.name }} <span>&#10004;</span>
        </div>
      </li>
    </ul>
     <p><button class="isActive" v-if="!myPlayer.gameReady" v-on:click="ready()">ready</button></p>
    <p><button class="isInActive" v-if="myPlayer.gameReady" v-on:click="ready()">unready</button></p>

    <div v-if="myPlayer.roomCreator">
      <p><button v-on:click="start()">Start</button></p>
    </div>
      </div>
</template>

<script>
module.exports = {
  name: "userlistcomponent",
  mounted() {
    //this.$socket.open();
    console.log("Userlist component added");
    this.$socket.emit("whoAmI");
    console.log(localStorage.getItem("gameCode"));
    this.$socket.emit("playerListInit", localStorage.getItem("gameCode"));
  },
  data: function () {
    return {
      me: [],
      gameState: 0,
      playerList: [],
    };
  },
  created: function () {
      this.sockets.subscribe("playerListUpdate", (data) => {
          console.log(JSON.stringify(data));
          this.gameState = data.gameState;
          this.playerList = data.playerList;
      });
      this.sockets.subscribe("accountUserInfo", (data) => {
          this.me = data;
      });
  },
  methods: {
    // SOCKET IO EMITTERS
    ready: function () {
      this.$socket.emit("playerListReady", localStorage.getItem("gameCode"));
    },
    start: function () {
      this.$socket.emit("playerListStart", localStorage.getItem("gameCode"));
    },
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
.isActive {
  background-color: green;
}
.isInActive {
  background-color: red;
}
</style>
      