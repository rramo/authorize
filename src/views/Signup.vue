<template>
  <div class="container">
    <div>
      <form @submit.prevent="signUp">
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
          label="Lastname"
          type="text"
          required
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
          <button type="submit">Sign up</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import BaseInput from "../components/BaseInput";

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
    signUp() {
      if (this.password === this.confirmPassword) {
        let headers = new Headers();
        headers.append("Content-Type", "application/x-www-form-urlencoded");
        this.errors = [];
        let { lastname, firstname, email, password } = this;

        // Send a POST request
        axios({
          method: "post",
          url: "/register:9001",
          data: {
            lastname,
            firstname,
            email,
            password
          }
        })
          .then(() => {
            this.$router.push("/registrationOk");
            this.errors.push(
              "Please check your email (also your spam) and confirm the creation of your account by clicking the confirmation link"
            );
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
