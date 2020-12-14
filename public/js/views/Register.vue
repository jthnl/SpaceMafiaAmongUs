<template>
  <div class="div-main div-centered register">
    <div class="div-h-centered">
      <h1>Sign Up</h1>
      <p><input v-model="name" placeholder="Name" /></p>
      <p><input v-model="username" placeholder="Username" /></p>
      <p><input v-model="email" placeholder="Email" /></p>
      <p><input v-model="password" type="password" placeholder="Password" /></p>
      <p><button v-on:click="sendRegister()">Sign up</button></p>
      <p><router-link to="/" tag="button">Cancel</router-link></p>
      <p>{{ errMessage }}</p>
    </div>
  </div>
</template>

<script>
module.exports = {
  name: "Register",
  mounted() {
    console.log("Register Page loaded");
    let axios = document.createElement("script");
    axios.setAttribute(
      "src",
      "https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"
    );
    document.head.appendChild(axios);
  },
  data: function () {
    return {
      name: "",
      username: "",
      email: "",
      password: "",
      errMessage: "",
    };
  },
  methods: {
    sendRegister: function () {
      let loginInfo = {
        username: this.username,
        password: this.password,
        email: this.email,
        name: this.name,
      };

      axios
        .post("/register", loginInfo, {
          headers: { withCredentials: true },
        })
        .then((res) => {
          console.log(res);
          if (res.data.success) {
            // if success, go to account
            this.$router.push("/account");
          } else {
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

<style></style>
