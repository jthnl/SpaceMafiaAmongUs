<template>
  <div class="login">
    <h1>Login</h1>
    <p><input v-model="username" placeholder="username" /></p>
    <p><input v-model="password" placeholder="password" /></p>
    <p><button v-on:click="sendLogin()">Login</button></p>
    <p><router-link to="/register" tag="button">Sign Up</router-link></p>
    <!-- <p>{{ errMessage }}</p> -->
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
  },
  data: function () {
    return {
      username: "",
      password: "",
      errMessage: "",
    };
  },
  methods: {
    sendLogin: function () {
      console.log(this.username);
      console.log(this.password);
      let loginInfo = {
        username: this.username,
        password: this.password,
      };

      axios
        .post("http://localhost:3000/login", loginInfo, {
          headers: {withCredentials: true},
        })
        .then((res) => {
          console.log(res);
          this.$router.push("/lobby")
        })
        .catch((err) => {
          console.log(err.response);
          this.errMessage = err.response.data.message;
        });
    },
  },
};
</script>

<style scoped>
span {
  background-color: yellow;
}
</style>






