<template>
  <div class="container">
    <div>
      <form @submit.prevent="signUp" :class="{ error: errors.length }">
        <div>
          <div v-if="errors.length">
            <div v-for="error in errors" :key="error">
              {{ error }}
            </div>
          </div>
        </div>

        <BaseInput
          v-model="lastname"
          label="Lastname"
          required
          autofocus
          autocomplete="off"
        />
        <BaseInput
          v-model="firstname"
          label="Firstname"
          required
          autocomplete="off"
        />
        <BaseInput
          v-model="email"
          label="E-mail"
          type="email"
          required
          autocomplete="off"
        />
        <BaseInput
          v-model="password"
          label="Password"
          type="password"
          autocomplete="off"
          required
        />
        <BaseInput
          v-model="confirmPassword"
          label="Confirm password"
          type="password"
          autocomplete="off"
        />
        <div class="info">
          Account? <router-link to="/">Sign in</router-link>!
        </div>
        <div class="actions">
          <button type="button" @click="test">Test</button>
          <button type="submit">Sign up</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import BaseInput from "../components/BaseInput";
import crypto from "crypto";
require("dotenv").config();

export default {
  components: {
    BaseInput
  },
  data() {
    return {
      lastname: "",
      firstname: "",
      email: "",
      password: "",
      confirmPassword: "",
      errors: []
    };
  },
  methods: {
    test() {
      console.log("SALT: ", process.env.SALT);
      let hashPassword = crypto
        .pbkdf2("coucou", process.env.SALT, 1000, 64, `sha512`)
        .toString(`hex`);
      console.log("encrypted password: ", hashPassword);
    },
    signUp() {
      if (this.password === this.confirmPassword) {
        let headers = new Headers();
        headers.append("Content-Type", "application/x-www-form-urlencoded");
        this.errors = [];
        fetch("/register", {
          method: "POST",
          headers,
          body: `lastname=${this.lastname}
                &firstname=${this.firstname}
                &email=${this.email}
                &password=${this.password}`
        })
          .then(res => {
            if (res.status === 200) {
              this.$router.push("/registrationOk");
            } else {
              this.errors.push("registration failed");
            }
          })
          .catch(err =>
            this.errors.push(`registration failed: ${err.message}`)
          );
      }
    }
  }
};
</script>

<style>
.error {
  color: red;
}
.container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}
.actions {
  position: relative;
  padding: 1rem;
  display: flex;
  justify-content: center;
}
.actions button {
  padding: 1.3rem 2.5rem;
  background: green;
  color: white;
  font-weight: bold;
  font-size: 1rem;
  border: 1px solid darkgreen;
  border-radius: 5px;
}
.actions button:focus,
.actions button:active,
.actions button:hover {
  background: darkgreen;
  border: 1px solid black;
}
.actions button:hover {
  cursor: pointer;
}
</style>
