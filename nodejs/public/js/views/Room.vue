<template>
  <div class="room">
    <div class="grid-container app-world">
      <div class="grid-item-title div-centered">
        <h1>Space Mafia Among Us</h1>
      </div>
      <div class="grid-item-page div-centered">
        <h2>Room: {{ this.gameCode }}</h2>
      </div>
      <userlist-component></userlist-component>
      <chat-component></chat-component>
      <game-component></game-component>
    </div>
  </div>
</template>

<script>
module.exports = {
  name: "room",
  mounted() {
    console.log("room opened");
    this.$socket.open();
    if (localStorage.getItem("gameCode") === null) {
      this.$router.push({ name: "account" });
    }
    this.gameCode = localStorage.getItem("gameCode");
  },
  components: {
    "chat-component": httpVueLoader("/js/components/ChatComponent.vue"),
    "userlist-component": httpVueLoader("/js/components/UserlistComponent.vue"),
    "game-component": httpVueLoader("/js/components/GameComponent.vue"),
  },
  data: function () {
    return {
      me: [],
      gameCode: "",
    };
  },
  created: function () {
    // alerts player when they are kicked out of the room by Admin
    this.sockets.subscribe("kickOut", (data) => {
      this.$router.push({ name: "account" });
      window.alert(data.message);
    });
  },
};
</script>

<style></style>
