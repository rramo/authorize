import Vue from "vue";
import VueRouter from "vue-router";
import Login from "../views/Login.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Login",
    component: Login
  },
  {
    path: "/register",
    name: "Register",
    component: () =>
      import(/* webpackChunkName: "register" */ "../views/Register.vue")
  },
  {
    path: "/alreadyConfirmed",
    name: "AlreadyConfirmed",
    component: () =>
      import(
        /* webpackChunkName: "alreadyConfirmed" */ "../views/account/AlreadyConfirmed.vue"
      )
  },
  {
    path: "/confirmationCodeNotValid",
    name: "ConfirmationCodeNotValid",
    component: () =>
      import(
        /* webpackChunkName: "" */ "../views/account/ConfirmationCodeNotValid.vue"
      )
  },
  {
    path: "/confirmationFailed",
    name: "ConfirmationFailed",
    component: () =>
      import(
        /* webpackChunkName: "" */ "../views/account/ConfirmationFailed.vue"
      )
  },
  {
    path: "/confirmationLinkSent",
    name: "ConfirmationLinkSent",
    component: () =>
      import(
        /* webpackChunkName: "" */ "../views/account/ConfirmationLinkSent.vue"
      )
  },
  {
    path: "/confirmed",
    name: "Confirmed",
    component: () =>
      import(/* webpackChunkName: "" */ "../views/account/Confirmed.vue")
  },
  {
    path: "/about",
    name: "About",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/About.vue")
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
