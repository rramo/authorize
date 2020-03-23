import Vue from "vue";
import App from "./App.vue";
// import "./registerServiceWorker";
import router from "./router";
import store from "./store";

Vue.config.productionTip = false;

Vue.directive("autofocus", {
  inserted: function(el) {
    el.querySelector("input").focus();
  }
});

Vue.directive("autocomplete-disabled", {
  bind: function(el) {
    let input = el.querySelector("input");
    input.setAttribute("autocomplete", "off");
    input.setAttribute("readonly", "readonly");
    input.style.backgroundColor = "inherit";
  },
  inserted: function(el) {
    let input = el.querySelector("input");
    // input.removeAttribute("readonly");
    setTimeout(() => input.removeAttribute("readonly"), 500);
  }
});

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
