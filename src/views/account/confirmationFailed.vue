<template>
  <div class="container">
    <div>
      Confirmation failed, please register
      <router-link to="/register">here</router-link>
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
