<template>
  <div class="login">
    <h1>Login</h1>
    <p>
      <input v-model="username" placeholder="username" />
    </p>
    <p>
      <input v-model="password" placeholder="password" />
    </p>
    <p>
      <button v-on:click="sendLogin()">Login</button>
    </p>
    <p>
      <router-link to="/register" tag="button">Sign Up</router-link>
    </p>
  </div>
</template>

<script>
import router from "../router";
import axios from "axios";

export default {
  name: "Login",
  data: function () {
    return {
      username: "",
      password: "",
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
          router.push("/home");
        })
        .catch((err) => {
          console.log(err.response);
        });
    },
  },
};
</script>
