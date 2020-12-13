<template>
  <div class="grid-item-users">
    <h2>Users</h2>
    <ul id="users">
      <li v-for="player in playerList" :key="player._id">
        <div>
           <span v-if="player.is_captain && gameState === 1">&#128081;</span>
           <span class="teamMember" v-if="player.on_team && (gameState === 2 || gameState === 3)">&#128160;</span>
           {{ player.name }}
           <span v-if="player._id === myPlayer._id">(You)</span>
           <span v-if="!player.gameReady">&#10006;</span>
           <span v-if="player.gameReady">&#10004;</span>
        </div>
      </li>
    </ul>
     <p><button class="isActive" v-if="!myPlayer.gameReady && gameState === 0" v-on:click="ready()">Ready</button></p>
    <p><button class="isInActive" v-if="myPlayer.gameReady && gameState === 0" v-on:click="ready()">Unready</button></p>

    <div v-if="myPlayer.roomCreator && gameState === 0">
      <p><button v-on:click="start()">Start</button></p>
    </div>

    <div v-if="gameState !== 0">
      <div>Your role:</div>
      <span v-if="myPlayer.role === 'INNOCENT'"> &#128311;</span>
      <span v-if="myPlayer.role === 'TRAITOR'"> &#128310;</span>
      <span> {{ myPlayer.role }}</span>
      <div v-if="myPlayer.role === 'TRAITOR'">
        <p>You are working together with the other traitor:</p>
        <div v-for="player in playerList" :key="player.id">
          <div v-if="player.role === 'TRAITOR' && myPlayer._id !== player._id">
            <span>&#128312; {{ player.name }}</span>
          </div>
        </div>
      </div>
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
    },
    allReady: function () {
      return true;
      let totalReady = 0;
      for(let i = 0; i < playerList.length; i++) {
        if(playerList[i].gameReady) {
          totalReady++;
        }
      }
      return(totalReady === playerList.length);
    }
  }
 
};
</script>

<style scoped>
.isActive {
  background-color: #16CA76;
}
.isInActive {
  background-color: #e06666;
}
.teamMember {
  font-size: 70%;
}
</style>
      