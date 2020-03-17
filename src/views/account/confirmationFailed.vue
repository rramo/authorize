<template>
  <div class="container">
    <div>
      Confirmation failed, please sign up
      <router-link to="/signup">here</router-link>
    </div>
  </div>
</template>

<style>
.error {
  color: red;
}
.container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}
</style>
