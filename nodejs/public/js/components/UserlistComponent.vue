<template>
  <div class="grid-item-users">
    <h2>Users</h2>
    <ul id="users">
      <li v-for="player in playerList" :key="player._id">
        {{ player.username }}
      </li>
    </ul>
  </div>
</template>

<script>
module.exports = {
  mounted() {
    console.log("Userlist component added");
  },
  data: function () {
    return {
      playerList: [],
    };
  },
  created: function () {
    console.log("ULISTREFRESH:A");

    //    SOCKET IO LISTENERS
    this.sockets.subscribe("playerListUpdate", (data) => {
      this.playerList = data;
      console.log(
        "playerListUpdate initialized:" + JSON.stringify(this.playerList)
      );
    });

    this.$socket.emit("roomPlayerList", localStorage.getItem("gameCode"));
  },
};
</script>

<style scoped>
</style>
      