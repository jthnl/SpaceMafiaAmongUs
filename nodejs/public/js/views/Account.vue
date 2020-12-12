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
        <p>Games Played: {{ myStats.gamesplayed }}</p>
        <p>Wins:  {{ myStats.wins }}</p>
        <p>Losses:  {{ myStats.losses }}</p>
      </div>
      <div>
        <p>
          <input class="input" v-model="gameCode" placeholder="Enter Code" />
        </p>
        <p><button v-on:click="joinGame()">Join Game</button></p>
        <p><button v-on:click="createGame()">Create Game</button></p>
        <!-- special option for admins only -->
        <p><button v-if="me.admin" v-on:click="admin()">Admin</button></p>
      </div>
    </div>
    <div class="grid-item-instructions">
      <h2>Instructions</h2>
    </div>
  </div>
</template>

<script>
module.exports = {
  name: "account",
  mounted() {
    console.log("Account.vue Loaded");
    // Setup Sockets
    this.$socket.open();
    this.$socket.emit("whoAmI");
  },
  data: function () {
    return {
      me: [],
      myStats: [],
      gameCode: "",
      errorMsg: ""
    };
  },
  created: function () {
    // SOCKET IO LISTENERS
    this.sockets.subscribe("accountUserInfo", (data) => {
      this.me = data;
    });

    this.sockets.subscribe("accountUserStats", (data) => {
      this.myStats = data;
    });

    this.sockets.subscribe("roomCode", (data) => {
      this.gameCode = data;
      localStorage.setItem("gameCode", this.gameCode);
      this.$router.push({ name: "room" });
      this.gameCode = "";
    });

    this.sockets.subscribe("accountErrorMessage", (data) => {
      this.errorMsg = data;
    });
  },
  methods: {
    // SOCKET IO EMITTERS
    joinGame: function () {
      this.$socket.emit("joinGame", this.gameCode);
      this.gameCode = "";
    },
    createGame: function () {
      this.$socket.emit("createGame");
    },
    admin: function() {
      this.$router.push({ name: "admin" });
    }
  },
};
