<template>
  <div class="container">
    <div>
      <form class="form" @submit.prevent="login">
        <div>
          <div v-if="errors.length" :class="{ error: errors.length }">
            <div v-for="error in errors" :key="error">
              {{ error }}
            </div>
          </div>
        </div>

        <BaseInput
          v-model="email"
          type="email"
          v-autofocus
          v-autocomplete-disabled
          label="E-mail"
        />

        <BaseInput
          v-model="password"
          v-autocomplete-disabled
          label="Password"
          type="password"
        />
        <div class="info">
          No account? <router-link to="/register">Register</router-link>!
        </div>
        <div class="actions"><button type="submit">Login</button></div>
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
      username: "",
      email: "",
      password: "",
      redirect_uri: "",
      errors: []
    };
  },
  created() {
    let url = new URL(location.href);
    if (url.searchParams && url.searchParams.get("redirect_uri")) {
      this.redirect_uri = url.searchParams.get("redirect_uri");
    }
  },
  methods: {
    login() {
      let headers = new Headers();
      headers.append("Content-Type", "application/x-www-form-urlencoded");
      this.errors = [];
      let { email, password } = this;
      axios({
        method: "POST",
        url: `http://localhost:${process.env.VUE_APP_AUTH_PORT}/authorize`,
        headers,
        data: {
          email,
          password
        }
      })
        .then(res => {
          if (this.redirect_uri) {
            let token = res.headers.get("token");
            location.href = `${this.redirect_uri}?token=${token}`;
          } else {
            this.errors.push("redirect_uri not found in query parameters");
          }
        })
        .catch(err => {
          this.errors.push(`authentification failed (${err})`);
        });
    }
  }
};
</script>

<style>
.form {
  display: flex;
  flex-direction: column;
  align-items: center;
}
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
