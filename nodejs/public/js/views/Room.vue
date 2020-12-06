<template>
  <div class="room">
    <div class="grid-container app-world">
      <div class="grid-item-title div-centered">
        <h1><router-link to="/">Space Mafia Among Us</router-link></h1>
      </div>
      <div class="grid-item-page div-centered">
        <h2>Room: {{this.room.roomCode}}</h2>
      </div>
      <div class="grid-item-users">
        <h2>Users</h2>
        <ul id="users"></ul>
      </div>
      <div class="grid-item-messages">
        <h2>Messages</h2>
        <ul id="messages"></ul>
      </div>
      <div class="grid-item-form div-centered">
        <form id="message-form" action="">
          <input id="message" autocomplete="off" placeholder="Message" />
        </form>
      </div>
      <div class="grid-item-info">
        <h2>Information</h2>
      </div>
    </div>
  </div>
</template>

<script>
var chatComponent = httpVueLoader("/js/components/ChatComponent.vue");
module.exports = {
  name: "room",
  mounted() {},
  components: {
    "chat-component": chatComponent,
  },
  data: function () {
    return {
      me: [],
      room: [],
    };
  },
  created: function () {
    // add socket listeners
    this.sockets.subscribe("roomSetup", (data) => {
      this.room = data;
      console.log(JSON.stringify(this.room));
    });
  },
};
</script>

<style></style>
