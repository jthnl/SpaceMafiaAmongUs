<template>
  <div class="grid-container account">
    <div class="grid-item-title div-centered">
      <div id="title">
        <h1><router-link to="/">Space Mafia Among Us</router-link></h1>
      </div>
    </div>
    <div class="grid-item-page div-centered">
      <div id="account">
        <h2>My Account</h2>
      </div>
    </div>
    <div class="grid-item-account">
      <div class="account-info">
        <h2>My Account</h2>
        <p>Name: {{ me.name }}</p>
        <p>Username: {{ me.username }}</p>
      </div>
      <div class="account-info">
        <h2>Stats</h2>
        <p>Games Played:</p>
        <p>Wins:</p>
        <p>Losses:</p>
      </div>
      <div>
        <p>
          <input class="input" v-model="gameCode" placeholder="Enter Code" />
        </p>
        <p><button v-on:click="joinGame()">Join Game</button></p>
        <p><button v-on:click="createGame()">Create Game</button></p>
      </div>
    </div>
    <div class="grid-item-instructions">
      <h2>Instructions</h2>
    </div>
  </div>
</template>

<script>
module.exports = {
  name: "login",
  mounted() {
    console.log("Account Page loaded");
    console.log("opening socket");
    this.$socket.open();
    this.$socket.emit("whoAmI");
  },
  data: function () {
    return {
      me: [],
      gameCode: "",
    };
  },
  created: function () {
    // add socket listeners
    this.sockets.subscribe("accountUserInfo", (data) => {
      this.me = data;
    });
  },
  methods: {
    joinGame: function () {
      this.$socket.emit("joinGame", this.gameCode);
      this.gameCode = "";
      this.$router.push("/room");
    },
    createGame: function () {
      this.$socket.emit("createGame");
      this.$router.push("/room");
    },
  },
};
</script>

<style></style>
