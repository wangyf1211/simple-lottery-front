import Vue from "vue";
import VueRouter from "vue-router";
import Publish from "../views/Publish.vue";
import Join from "../views/Join.vue";
import Home from "../views/Home.vue";
Vue.use(VueRouter);

const routes = [
  {
    path: "/publish",
    name: "publish",
    component: Publish
  },
  {
    path: "/join/:lotteryId",
    name: "join",
    component: Join
  },
  {
    path: "/assign/:lotteryId",
    name: "assign",
    component: () => import("../views/Assign.vue")
  },
  {
    path: "/admin",
    name: "admin",
    component: () => import("../views/Admin.vue")
  },
  {
    path: "/about",
    name: "about",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/About.vue")
  },
  {
    path: "*",
    name: "*",
    component: Home
  }
];

const router = new VueRouter({
  routes
});

export default router;
