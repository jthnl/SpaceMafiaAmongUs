<template>
  <div class="lobby">
    <HelloWorld msg="Welcome to Your Vue.js App"/>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'

export default {
  name: 'Lobby',
  components: {
    HelloWorld
  }
}
</script>
