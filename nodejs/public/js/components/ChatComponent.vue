<template>
  <div class="grid-item-messages">
    <h2>Messages</h2>
    <ul id="messages">
      <div v-for="message in messageList" :key="message._mid">
        <div v-if="message._id === myPlayer._id">
          <li class="message-main-user">
            <p class="message-text message-text-main-user">
              {{ uidtousername(message._id) }} + {{ message.timestamp | timestamptodate }} +
              {{ message.message }}
            </p>
          </li>
        </div>
        <div v-else>
          <li>
            <p class="message-text">
              {{ uidtousername(message._id) }} + {{ message.timestamp | timestamptodate }} +
              {{ message.message }}
            </p>
          </li>
        </div>
      </div>
    </ul>
    <div class="force-bottom div-centered">
      <form id="message-form" @submit.prevent="sendMessage">
        <input
          id="message"
          autocomplete="off"
          placeholder="Message"
          v-model="messageInput"
        />
      </form>
    </div>
  </div>
</template>

<script>
module.exports = {
  name: "chatcomponent",
  mounted() {
    //this.$socket.open();
    console.log("Chat component added");
    this.$socket.emit("whoAmI");
    this.$socket.emit("chatComponentInit", localStorage.getItem("gameCode"));
  },
  data: function () {
    return {
      me: [],
      messageList: [],
      playerList: [],
      messageInput: "",
    };
  },
  created: function () {
    //    SOCKET IO LISTENERS
    this.sockets.subscribe("accountUserInfo", (data) => {
        this.me = data;
    });
    this.sockets.subscribe("messageUpdate", (data) => {
      this.messageList = data.messageList;
      this.playerList = data.playerList;
    });
  },
  methods: {
    sendMessage: function () {
      this.$socket.emit(
        "newMessage",
        localStorage.getItem("gameCode"),
        this.messageInput
      );
      this.messageInput = "";
    },
    uidtousername: function (value) {
      if (!value) return "null id";
      let usr = this.playerList.find((user) => {
        return user._id === value;
      });
      if (usr) {
        return usr.username;
      }
      return "[Unknown User]";
    },
  },
  computed: {
    myPlayer: function () {
      let foundPlayer = this.playerList.find(player => player._id === this.me._id);
      console.log(JSON.stringify(foundPlayer));
      return foundPlayer;
    }
  },
  filters: {
    timestamptodate: function (value) {
      if (!value) return "null date";
      let timestamp = new Date(value);
      let hrs = timestamp.getHours();
      let mins = "0" + timestamp.getMinutes();
      let secs = "0" + timestamp.getSeconds();
      return "" + hrs + ":" + mins.substr(-2) + ":" + secs.substr(-2);
    },
  },
};
</script>

<style scoped>
.grid-item-messages {
  position: relative;
}

.force-bottom {
  position: absolute;
  left: 10px;
  right: 10px;
  bottom: 10px;
}
</style>
