<template>
  <div class="register">
    <h1>Register</h1>
    <p><input v-model="name" placeholder="name" /></p>
    <p><input v-model="username" placeholder="username" /></p>
    <p><input v-model="email" placeholder="email" /></p>
    <p><input v-model="password" placeholder="password" /></p>
    <p><button v-on:click="sendRegister()">Sign up</button></p>
    <p><router-link to="/" tag="button">Cancel</router-link></p>
    <p>{{errMessage}}</p>
  </div>
</template>

<script>
import router from "../router";
import axios from "axios";

export default {
  name: "Register",
  data: function () {
    return {
      name: "",
      username: "",
      email: "",
      password: "",
      errMessage: ""
    };
  },
  methods: {
    sendRegister: function () {
      let loginInfo = {
        username: this.username,
        password: this.password,
        email: this.email,
        name: this.name
      };

      axios
        .post("http://localhost:3000/register", loginInfo, {
          headers: { withCredentials: true },
        })
        .then((res) => {
          console.log(res);
          if(res.data.success){
            // if success, go to lobby
            router.push("/lobby");
          }else{
            // if fail, notify user
            this.errMessage = res.data.message;
          }
        })
        .catch((err) => {
          console.log(err.response);
          this.errMessage = err.response;
        });
    },
  },
};
</script>

<style>

</style>
