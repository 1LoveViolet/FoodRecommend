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
      path: "/home",
      component: Home,
      //   children: [
      //     {
      //       path: "/home/edit",
      //       component: Edit,
      //       // redirect: "/edit/basic",
      //       children: [
      //         {
      //           path: "/edit/basic",
      //           component: BasicInfo,
      //           meta: { requireAuth: false },
      //         },
      //         {
      //           path: "/edit/paper",
      //           component: Paper,
      //         },
      //         {
      //           path: "/edit/address",
      //           component: Address,
      //         },
      //         {
      //           path: "/edit/contact",
      //           component: Contact,
      //         },
      //         {
      //           path: "/edit/education",
      //           component: Education,
      //         },
      //         {
      //           path: "/edit/skill",
      //           component: Skill,
      //         },
      //         {
      //           path: "/edit/workExp",
      //           component: WorkExp,
      //         },
      //         {
      //           path: "/edit/projectExp",
      //           component: ProjectExp,
      //         },
      //         {
      //           path: "/edit/salary",
      //           component: Salary,
      //         },
      //       ],
      //     },
      //     {
      //       path: "/home/person",
      //       component: Person,
      //     },
      //     {
      //       path: "/home/salary",
      //       component: Salary,
      //     },
      //     {
      //       path: "/home/workpost",
      //       component: WorkPost,
      //     },
      //   ],
    },
  ],
  mode: "history",
});

router.beforeEach((to, from, next) => {
  const token = router.app.$store.state.token;

  if (
    to.path === "/login" ||
    to.path === "/register" ||
    to.path === "/home" ||
    to.path === "/"
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
});
export default router;
