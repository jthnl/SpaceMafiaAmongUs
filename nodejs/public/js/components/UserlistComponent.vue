<template>
  <div class="grid-item-users">
    <h2>Users</h2>
    <ul id="users">
      <li v-for="player in playerList" :key="player._id">
        {{ player.username }}
      </li>
    </ul>
    <p><button v-on:click="ready()">Ready</button></p>
  </div>
</template>

<script>
module.exports = {
  name: "userlistcomponent",
  mounted() {
    //this.$socket.open();
    console.log("Userlist component added");
    this.$socket.emit("roomPlayerList", localStorage.getItem("gameCode"));
  },
  data: function () {
    return {
      playerList: [],
    };
  },
  created: function () {
    //    SOCKET IO LISTENERS
    this.sockets.subscribe("playerListUpdate", (data) => {
      this.playerList = data;
    });
  },
  methods: {
    // SOCKET IO EMITTERS
    ready: function () {
      console.log("Not implemented yet");
    },
  },
};
</script>

<style scoped>
</style>
      