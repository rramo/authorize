<template>
  <div class="container">
    <div>
      <form @submit.prevent="signIn" :class="{ error: errors.length }">
        <div>
          <div v-if="errors.length">
            <div v-for="error in errors" :key="error">
              {{ error }}
            </div>
          </div>
        </div>

        <BaseInput
          v-model="email"
          id="email"
          name="email"
          label="E-mail"
          type="text"
          autocomplete="current-email"
          autofocus
        />

        <BaseInput
          v-model="password"
          id="password"
          name="password"
          label="Password"
          type="password"
          autocomplete="current-password"
        />
        <div class="info">
          No account? <router-link to="/signup">Sign up</router-link>!
        </div>
        <div class="actions"><button type="submit">Sign in</button></div>
      </form>
    </div>
  </div>
</template>

<script>
import BaseInput from "../components/BaseInput";

export default {
  components: {
    BaseInput
  },
  data() {
    return {
      email: "",
      password: "",
      redirect_uri: "",
      errors: []
    };
  },
  created() {
    let url = new URL(location.href);
    console.log(url, location.href);
    if (url.searchParams && url.searchParams.get("redirect_uri")) {
      this.redirect_uri = url.searchParams.get("redirect_uri");
    }
  },
  methods: {
    signIn() {
      let headers = new Headers();
      headers.append("Content-Type", "application/x-www-form-urlencoded");
      this.errors = [];
      fetch("/authorize", {
        method: "POST",
        headers: headers,
        body: `email=${this.email}&password=${this.password}`
      }).then(res => {
        if (res.status === 200) {
          if (this.redirect_uri) {
            let token = res.headers.get("token");
            location.href = `${this.redirect_uri}?token=${token}`;
          } else {
            this.errors.push("redirect_uri not found in query parameters");
          }
        } else {
          this.errors.push("authentification failed");
        }
      });
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
