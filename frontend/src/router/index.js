import Vue from "vue";
import VueRouter from "vue-router";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";

// 全局使用 Element UI
Vue.use(ElementUI);
Vue.use(VueRouter);
const Login = () => import("views/login/index.vue");
const Register = () => import("views/register/index.vue");
const Home = () => import("views/home/index.vue");
const User = () => import("views/user/index.vue");
const Detail = () => import("components/content/components/goodDetail");
const Rank = () => import("views/rank/index.vue");
const router = new VueRouter({
  // mode: "history", // history 模式去除地址栏 # 号
  routes: [
    // {
    // 	path: "/",
    // 	name: "登录",
    // 	component: () => import("@/components/account/Login.vue"),
    // 	meta: { requireAuth: false },
    // },
    {
      path: "/",
      // redirect: "/edit/basic",
      component: Home,
    },
    {
      path: "/login",
      component: Login,
    },
    {
      path: "/register",
      component: Register,
    },
    {
      path: "/detail",
      name: "detail",
      component: Detail,
    },
    {
      path: "/user",
      name: "user",
      component: User,
    },
    {
      path: "/home",
      name: "Home",
      component: Home,
    },
    {
      path: "/rank",
      name: "Rank",
      component: Rank,
    },
  ],
  mode: "history",
});

router.beforeEach((to, from, next) => {
  const token = router.app.$store.state.token;

  if (
    to.path == "/login" ||
    to.path == "/register" ||
    to.path == "/home" ||
    to.path == "/detail" ||
    to.path == "/"
  ) {
    // 如果是登录或注册页面，直接允许访问
    next();
  } else if (token) {
    // 用户已登录，允许导航到目标路由
    next();
  } else {
    // 用户未登录，重定向到登录页面或其他处理方式
    Vue.prototype.$alert("请先登录", "提示", {
      confirmButtonText: "确定",
      type: "warning",
      callback: () => {
        next("/login");
      },
    });
  }
  // if (from.name) {
  //   const componentInstance = router.app.$children.find(
  //     (child) => child.$route.name === from.name
  //   );
  //   if (componentInstance) {
  //     componentInstance.$destroy();
  //   }
  // }
  // next();
  if (from.name === "rank") {
    from.meta.destroyComponent();
    next();
  }
});
export default router;
