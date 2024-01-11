<template>
  <div>
    <myheader></myheader>
    <h1>1</h1>
    <h1>1</h1>
    <h1>1</h1>
    <h1>1</h1>
    <h1>1</h1>
    <h1>1</h1>
    <h1>1</h1>
    <h1>1</h1>
    <h1>1</h1>
    <h1>1</h1>
    <h1>1</h1>
    <h1>1</h1>
    <h1>1</h1>
    <h1>1</h1>
    <h1>1</h1>
    <h1>1</h1>
    <h1>1</h1>
    <h1>1</h1>
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

<style>
</style>