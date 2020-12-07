<template>
  <div class="room">
    <div class="grid-container app-world">
      <div class="grid-item-title div-centered">
        <h1><router-link to="/">Space Mafia Among Us</router-link></h1>
      </div>
      <div class="grid-item-page div-centered">
        <h2>Room: {{ this.gameCode }}</h2>
      </div>
      <userlist-component></userlist-component>
      <chat-component></chat-component>
      <div class="grid-item-info">
        <h2>Information</h2>
      </div>
    </div>
  </div>
</template>

<script>
module.exports = {
  name: "room",
  mounted() {
    this.$socket.open();
    console.log("room");
    if (localStorage.getItem("gameCode") === null) {
      this.$router.push({ name: "account" });
    }
    this.gameCode = localStorage.getItem("gameCode");
    this.$socket.emit("roomSetup", this.gameCode);
  },
  components: {
    "chat-component": httpVueLoader("/js/components/ChatComponent.vue"),
    "userlist-component": httpVueLoader("/js/components/UserlistComponent.vue"),
  },
  data: function () {
    return {
      me: [],
      gameCode: [],
      roomObj: [],
    };
  },
  created: function () {
    this.sockets.subscribe("roomUpdate", (data) => {
      this.roomObj = data;
    });
  },
};
</script>

<style></style>
