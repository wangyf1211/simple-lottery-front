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
    component: Publish,
    meta: {
      checkAdmin: true
    }
  },
  {
    path: "/join/:lotteryId",
    name: "join",
    component: Join
  },
  {
    path: "/assign/:lotteryId",
    name: "assign",
    component: () => import("../views/Assign.vue"),
    meta: {
      checkAdmin: true
    }
  },
  {
    path: "/share",
    name: "share",
    component: () => import("../views/Share.vue"),
    meta: {
      checkAdmin: true
    }
  },
  {
    path: "/admin",
    name: "admin",
    component: () => import("../views/Admin.vue")
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
router.beforeEach(function(to, from, next) {
  if (to.meta.checkAdmin && !localStorage.getItem("authenticate")) {
    next({
      path: "/admin"
    });
  } else {
    next();
  }
});
export default router;
