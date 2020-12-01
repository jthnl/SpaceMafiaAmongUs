<template>
  <div class="lobby">
    <div class="grid-container">
      <div class="grid-header">
        <div id="title">
          <h1><span style="color: #e06666">Space Mafia</span> Among Us</h1>
        </div>
        <div id="account">
          <h2>My Account</h2>
        </div>
      </div>

      <div class="grid-left">
        <div class="account-info">
          <h2>Account</h2>
          <p>Account Name</p>
        </div>

        <div class="account-info">
          <h2>Stats</h2>
          <p>Games Played:</p>
          <p>Wins:</p>
          <p>Losses:</p>
        </div>

        <div>
          <p><input class="input" v-model="gameCode" placeholder="Enter Code" /></p>
          <p><button v-on:click="joinGame()">Join Game</button></p>
          <p><button v-on:click="createGame()">Create Game</button></p>
        </div>
      </div>

      <div class="grid-right">
        <h3>Instructions</h3>
      </div>
    </div>
  </div>
</template>

<script>
module.exports = {
  name: "login",
  mounted() {
    console.log("Login Page loaded");
    let axios = document.createElement('script');
    axios.setAttribute('src', 'https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js');
    document.head.appendChild(axios);
    
    this.$socket.open();
    // let router = document.createElement('script');
    // router.setAttribute('src', 'js/router/index.js');
    // document.head.appendChild(router);
  },
  data: function () {
    return {
      gameCode: "",
    };
  },
  methods: {
    joinGame: function () {
        console.log("joinGame not implemented yet");
    },
    createGame: function () {
        console.log("createGame not implemented yet");
    },
  },
};
</script>



<style scoped>
.lobby {
  color: white;
  background-color: #212121;
}

#title {
  color: white;
  display: flex;
  align-items: center;
  padding: 0 100px;
}

#account {
  color: white;
  display: flex;
  align-items: center;
  padding: 0 25px;
}

.account-info {
  margin-bottom: 50px;
  text-align: left;
}

.grid-container {
  background-color: #212121;
  display: grid;
  height: 100vh;
  width: 100vw;
}

.grid-header {
  display: flex;
  justify-content: space-between;
  grid-row: 1;
  grid-column: 1 / span 5;
}

.grid-left {
  padding: 30px;
  display: flex;
  flex-direction: column;
  grid-row: 2 / span 5;
  grid-column: 1;
  border: white 1px solid;
}

.grid-right {
  text-align: left;
  padding: 30px;
  grid-row: 2 / span 5;
  grid-column: 2 / span 5;
  border: white 1px solid;
}

::placeholder {
  color: white;
}
.input {
  width: 50%;
  padding: 12px 20px;
  margin: 8px 0;
  border-radius: 10px;
  box-sizing: border-box;
  border: none;
  background-color: #666666;
  color: white;
  outline: none;
}

button:hover {
  background-color: rgb(214, 214, 214);
  cursor: pointer;
}
button {
  width: 50%;
  padding: 12px 20px;
  margin: 8px 0;
  border-radius: 10px;
  box-sizing: border-box;
  border: none;
  background-color: white;
  color: black;
  outline: none;
}
</style>