<template>
  <div>
    <!-- <myheader></myheader> -->
    <!-- <div class="content">排行</div> -->
    <!-- <myecharts></myecharts> -->
    <mythree :key="componentKey"></mythree>
    <!-- <myfooter></myfooter> -->
  </div>
</template>
  
  <script>
const myheader = () => import("components/header/index.vue");
const myfooter = () => import("components/footer/index.vue");
const myecharts = () => import("components/echarts/index.vue");
const mythree = () => import("components/three/index.vue");
export default {
  components: { myheader, myfooter, myecharts, mythree },
  data() {
    return {
      componentKey: 0,
    };
  },
  beforeRouteLeave(to, from, next) {
    this.forceRerender();
    next();
  },
  destroyed() {
    this.forceRerender();
  },
  created() {
    this.forceRerender();
    document.title = `可视化`;
  },
  methods: {
    forceRerender() {
      this.componentKey += 1;
    },
  },
};
</script>
  

  <style scoped>
.content {
  width: 1000px;
  height: 100%;
  /* background-color: aqua; */
  margin: auto;
  background: #f6f6f6;
}
</style>
  <!-- <style scoped>
  @import "@/assets/style/common.css";
  </style> -->