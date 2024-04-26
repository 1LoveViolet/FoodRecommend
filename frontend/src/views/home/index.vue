<template>
  <div>
    <myheader></myheader>
    <div class="content">
      <mycontent></mycontent>
      <!-- <goodsList></goodsList> -->
    </div>
    <myfooter></myfooter>
  </div>
</template>

<script>
const myheader = () => import("components/header/index.vue");
const myfooter = () => import("components/footer/index.vue");
const mycontent = () => import("components/content/index.vue");
// const goodsList = () => import("components/productList/index.vue");
export default {
  name: "home",
  components: {
    myheader,
    myfooter,
    mycontent,
    // goodsList,
  },
  created() {
    document.title = `首页`;
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