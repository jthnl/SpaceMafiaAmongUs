<template>
  <div class="div-main div-centered login">
    <div class="div-h-centered">
      <h1>Log In</h1>
      <p>
        <input v-on:keyup.enter="sendLogin()" v-model="username" placeholder="Username" />
      </p>
      <p>
        <input v-on:keyup.enter="sendLogin()" type="password" v-model="password" placeholder="Password" />
      </p>
      <p><button v-on:click="sendLogin()">Log In</button></p>
      <p><router-link to="/register" tag="button">Sign Up</router-link></p>
      <!-- <p>{{ errMessage }}</p> -->
    </div>
  </div>
</template>

<script>
module.exports = {
  name: "login",
  mounted() {
    console.log("Login Page loaded");
    let axios = document.createElement("script");
    axios.setAttribute(
      "src",
      "https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"
    );
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
        .post("/login", loginInfo, {
          headers: { withCredentials: true },
        })
        .then((res) => {
          console.log(res);
          this.$router.push("/account");
        })
        .catch((err) => {
          console.log(err.response);
          this.errMessage = err.response.data.message;
        });
    },
  },
};
</script>

<style></style>
