import Vue from "vue";
import Router from "vue-router";
Vue.use(Router);

import Login from "@/pages/login/login.vue";
import Register from "@/pages/register/register.vue";
import File from "@/pages/file/file.vue";

import store from "@/store";

const router = new Router({
  routes: [
    {
      path: "/",
      redirect: { name: "login" }
    },
    {
      path: "/login",
      name: "login",
      component: Login
    },
    {
      path: "/register",
      name: "register",
      component: Register
    },
    {
      path: "/file",
      name: "file",
      component: File,
      meta: { requiresAuth: true }
    }
  ]
});

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!store.state.auth.isLogin) {
      next({
        path: "/login",
        query: {}
      });
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
