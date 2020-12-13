<template>
  <div class="grid-item-chat-component grid-container-chat-component">
    <div id="msglist-container" class="grid-item-messages">
      <ul id="messages">
        <div v-for="message in messageList" :key="message._mid">
          <div v-if="message._id === myPlayer._id">
            <li class="message-main-user">
              <p>
                {{ uidtousername(message._id) }} (You)
                <span class="timestamp">{{ message.timestamp | timestamptodate }}</span>
              </p>
              <p class="message-text message-text-main-user">
                {{ message.message }}
              </p>
            </li>
          </div>
          <div v-else>
            <li>
              <p>
                {{ uidtousername(message._id) }}
                <span class="timestamp">{{ message.timestamp | timestamptodate }}</span>
              </p>
              <p class="message-text">
                {{ message.message }}
              </p>
            </li>
          </div>
        </div>
      </ul>
    </div>
    <div class="grid-item-form div-centered">
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
// This is for converting timestamp differences from milliseconds to hours
const NUMBER_OF_MILLISECONDS_IN_AN_HOUR = 1000 * 60 * 60;

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
      autoScroll: false,
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

      // Determine whether or not the list of messages will scroll down automatically
      // Only scroll down when the user is at the very bottom of the list of messages
      let messageBlock = this.$el.querySelector("#msglist-container");

      if (
        messageBlock.scrollTop + messageBlock.clientHeight >=
        messageBlock.scrollHeight
      ) {
        this.autoScroll = true;
      }
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
      // check if message is from server or admin
      if (!value) return "null id";
      if(value === 1){
        return "Server";
      }
      if(value === 2){
        return "Admin"
      }
      let usr = this.playerList.find((user) => {
        return user._id === value;
      });
      if (usr) {
        return usr.username;
      }
      return "[Unknown User]";
    },
  },
  updated: function () {
    let messageBlock = this.$el.querySelector("#msglist-container");

    if (this.autoScroll) {
      messageBlock.scrollTop = messageBlock.scrollHeight;
      this.autoScroll = false;
    }
  },
  computed: {
    myPlayer: function () {
      let foundPlayer = this.playerList.find((player) => player._id === this.me._id);
      console.log(JSON.stringify(foundPlayer));
      return foundPlayer;
    },
  },
  filters: {
    timestamptodate: function (value) {
      if (!value) return "null date";
      let timestamp = new Date(value);

      let difference_in_hours =
        Math.abs(new Date() - timestamp) / NUMBER_OF_MILLISECONDS_IN_AN_HOUR;

      // If message timestamp is less than a day old, display time only, otherwise, display date only
      if (difference_in_hours < 24) {
        return timestamp.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "numeric",
        });
      } else {
        return timestamp.toLocaleDateString("en-US", {
          year: "numeric",
          month: "numeric",
          day: "numeric",
        });
      }
    },
  },
};
</script>

<style scoped></style>
