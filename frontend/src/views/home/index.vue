<template>
  <div>
    <myheader></myheader>
    <div class="content"></div>
    <myfooter></myfooter>
  </div>
</template>

<script>
const myheader = () => import("components/header/index.vue");
const myfooter = () => import("components/footer/index.vue");
export default {
  name: "home",
  components: {
    myheader,
    myfooter,
  },
};
</script>

<style scoped>
.content {
  width: 1000px;
  height: 1000px;
  background-color: aqua;
  margin: auto;
}
</style>