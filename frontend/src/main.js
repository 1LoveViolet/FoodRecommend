import Vue from "vue";
import App from "./App.vue";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import VueRouter from "vue-router";
import router from "./router";
import axios from "axios";
import dayjs from "dayjs";
Vue.config.productionTip = false;
Vue.use(ElementUI);
Vue.use(VueRouter);
Vue.prototype.axios = axios;
axios.defaults.baseURL = "http://loaclhost:3000"; //我电脑问题，你们使用改成http://127.0.0.1

import store from "./store";
Vue.prototype.$store = store;
Vue.prototype.dayjs = dayjs;
Vue.config.productionTip = false;

new Vue({
  store,
  render: (h) => h(App),
  router: router,

  beforeCreate() {
    Vue.prototype.$bus = this;
    const originalPush = VueRouter.prototype.push;
    VueRouter.prototype.push = function push(location) {
      return originalPush.call(this, location).catch((err) => err);
    };
  },
}).$mount("#app");
