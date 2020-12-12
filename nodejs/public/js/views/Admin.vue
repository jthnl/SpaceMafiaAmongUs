<template>
  <div class="grid-container account">
    <div class="grid-item-title div-centered">
      <div id="title">
        <h1><router-link to="/">Administrator</router-link></h1>
      </div>
    </div>
    <div class="div-centered">
      <div id="account">
        <p><button v-on:click="back()">Back</button></p>
      </div>
    </div>
    <div class="grid-item-account">
      <div class="account-info">
        <h2>My Account</h2>
        <p>Name: {{ me.name }}</p>
        <p>Username: {{ me.username }}</p>
      </div>
    </div>
    <div class="grid-item-instructions">
      <div v-for="(room, index) in roomCollection" :key="room.roomCode">
        <div>
          {{ room.roomCode }}
          <div>
            <form id="message-form" @submit.prevent="messageTeam({code: room.roomCode, idx: index})">
              <input id="message" autocomplete="off" placeholder="Message"  v-model="messageInput[index].value" key="index"/>
            </form>
            <p>
              <button v-on:click="killRoom(room.roomCode)">Kill Room</button>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
module.exports = {
  name: "admin",
  mounted() {
    console.log("Admin.vue Loaded");
    // Setup Sockets
    this.$socket.open();
    this.$socket.emit("whoAmI");
    this.$socket.emit("adminInit");
  },
  data: function () {
    return {
      me: [],
      myStats: [],
      roomCollection: [],
      messageInput: [],
    };
  },
  created: function () {
    // SOCKET IO LISTENERS
    this.sockets.subscribe("accountUserInfo", (data) => {
      this.me = data;
    });
    // get all the active rooms
    this.sockets.subscribe("adminUpdate", (data) => {
      this.roomCollection = data;
      for(let i =0 ; i < this.roomCollection.length; i++){
        this.messageInput.push({ value: ''});
      }
    });
  },
  methods: {
    // SOCKET IO EMITTERS
    // return to account page
    back: function () {
      this.$router.push({ name: "account" });
    },
    // send a message to a room as an Admin
    messageTeam: function (data) {
      this.$socket.emit("sendAdminMessage", data.code, this.messageInput[data.idx].value);
      this.messageInput[data.idx].value = "";
    },
    // kick everyone out and destroy room
    killRoom: function (gameCode) {
      this.$socket.emit("deleteRoom", gameCode);
    },
  },
};
