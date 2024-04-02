import Vue from "vue";
import App from "./App.vue";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import VueRouter from "vue-router";
import router from "./router";
import axios from "axios";
import dayjs from "dayjs";
import VueAMap from "vue-amap";
import "../node_modules/dat.gui/build/dat.gui.js";
import "../node_modules/dat.gui/build/dat.gui.css";
import * as echarts from "echarts";
Vue.prototype.$echarts = echarts;
Vue.config.productionTip = false;
Vue.use(ElementUI);
Vue.use(VueRouter);
Vue.use(VueAMap);
Vue.prototype.axios = axios;
VueAMap.initAMapApiLoader({
  key: "66be375bbee739346813eda698d5e2c8", //申请的key码需要填写的地方，格式为长串字符数字
  plugin: [
    //按照你的需要，引入地图的哪些功能，不需要下面这么多
    "AMap.Autocomplete", //输入提示插件
    "AMap.PlaceSearch", //POI搜索插件
    "AMap.Scale", //右下角缩略图插件 比例尺
    "AMap.OverView", //地图鹰眼插件
    "AMap.ToolBar", //地图工具条
    "AMap.MapType", //类别切换控件，实现默认图层与卫星图、实施交通图层之间切换的控制
    "AMap.PolyEditor", //编辑 折线多，边形
    "AMap.CircleEditor", //圆形编辑器插件
    "AMap.Geolocation", //定位控件，用来获取和展示用户主机所在的经纬度位置
    "MarkerClusterer",
    "AMap.HeatMap",
    "AMap.DistrictLayer",
    "AMap.Heatmap",
    "AMap.DistrictSearch",
    "AMap.Object3DLayer",
  ],
  v: "2.0", // 默认高德 sdk 版本为 1.4.4
  uiVersion: "1.0",
});
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
