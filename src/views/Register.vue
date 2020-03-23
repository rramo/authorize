<template>
  <div class="container">
    <div>
      <form class="form" @submit.prevent="register">
        <div>
          <div v-if="errors.length" :class="{ error: errors.length }">
            <div v-for="error in errors" :key="error">
              {{ error }}
            </div>
          </div>
        </div>

        <BaseInput
          v-model="lastname"
          v-autofocus
          v-autocomplete-disabled
          label="Lastname"
          type="text"
          required
          autocomplete="off"
        />
        <BaseInput
          v-model="firstname"
          v-autocomplete-disabled
          label="Firstname"
          required
          autocomplete="off"
        />
        <BaseInput
          v-model="email"
          v-autocomplete-disabled
          label="E-mail"
          type="email"
          required
          autocomplete="off"
        />
        <BaseInput
          v-model="password"
          v-autocomplete-disabled
          label="Password"
          type="password"
          autocomplete="off"
          required
        />
        <BaseInput
          v-model="confirmPassword"
          v-autocomplete-disabled
          label="Confirm password"
          type="password"
          autocomplete="off"
        />
        <div class="info">
          Account? <router-link to="/">Login</router-link>!
        </div>
        <div class="actions">
          <button type="submit">Register</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import BaseInput from "../components/BaseInput";
import base64url from "base64url";

const { debug, info } = console;

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
    register() {
      try {
        console.log("register action!", "PORT", process.env.VUE_APP_AUTH_PORT);
        if (this.password !== this.confirmPassword) {
          this.errors.push("confirmation password not matching password");
          return;
        }
        if (!this.email || !this.firstname || !this.lastname) {
          this.errors.push("Registration failed");
          return;
        }
        axios
          .get(
            `http://localhost:${
              process.env.VUE_APP_AUTH_PORT
            }/users/email/${base64url(this.email)}`
          )
          .then(() => {
            this.errors.push("Email already taken by another user");
            return;
          })
          .catch(() => debug("no user found, user can be created"));
        let headers = new Headers();
        headers.append("Content-Type", "application/x-www-form-urlencoded");
        this.errors = [];

        // Send a POST request
        axios({
          method: "post",
          url: `http://localhost:${process.env.VUE_APP_AUTH_PORT}/register`,
          data: {
            lastname: this.lastname,
            firstname: this.firstname,
            email: this.email,
            password: this.password
          }
        })
          .then(({ data: { code } }) => {
            if (code === "confirm_link_sent") {
              this.$router.push("/confirmationLinkSent");
              info(`user "${this.email}" created`);
            } else {
              debug("response code", code);
            }
          })
          .catch(err => {
            debug(err);
            this.errors.push(`registration failed: ${err}`);
          });
      } catch (err) {
        debug(err);
        this.errors.push(`registration failed: ${err}`);
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
