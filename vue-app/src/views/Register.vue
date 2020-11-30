<template>
  <div class="register">
    <h1>Register</h1>
    <p>
      <input v-model="username" placeholder="username" />
    </p>
    <p>
      <input v-model="password" placeholder="password" />
    </p>
    <p>
      <input v-model="password" placeholder="can add more..." />
    </p>
    <p>
      <button v-on:click="sendRegister()">Sign up</button>
    </p>
    <p>
      <router-link to="/" tag="button">Cancel</router-link>
    </p>
  </div>
</template>

<script>
import router from "../router";
import axios from "axios";

export default {
  name: "Register",
  data: function () {
    return {
      username: "",
      password: "",
    };
  },
  methods: {
    sendRegister: function () {
      console.log(this.username);
      console.log(this.password);
      let loginInfo = {
        username: this.username,
        password: this.password,
      };

      axios
        .post("http://localhost:3000/register", loginInfo, {
          headers: { withCredentials: true },
        })
        .then((res) => {
          console.log(res);
          router.push("/");
        })
        .catch((err) => {
          console.log(err.response);
        });
    },
  },
};
</script>
