<template>
  <div class="room">
    <chat-component></chat-component>
  </div>
</template>

<script>
var chatComponent = httpVueLoader("/js/components/AppWorld.vue");
module.exports = {
  name: "room",
  mounted() {},
  components: {
    "chat-component": chatComponent,
  },
};
</script>

<style></style>
