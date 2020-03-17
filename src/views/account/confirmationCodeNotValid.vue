<template>
  <div class="container">
    <div>
      Confirmation link no more valid, please click <a href="">here</a> to get
      another email confirmation link.
      <router-link to="/signin">here</router-link>
    </div>
  </div>
</template>

<script>
export default {
  medthods: {
    sendNewCode() {}
  }
};
</script>

<style>
.container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}
</style>
