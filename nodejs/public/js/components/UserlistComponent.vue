<template>
  <div class="grid-item-users">
    <h2>Users</h2>
    <ul id="users">
      <li v-for="player in playerList" :key="player._id">
        {{ player.username }} + {{player.gameReady}}
      </li>
    </ul>
    <p><button v-on:click="ready()">Ready</button></p>
     <p><button v-on:click="start()">Start</button></p>
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
  }
 
};
</script>

<style scoped>
</style>
      