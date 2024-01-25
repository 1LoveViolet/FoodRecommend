<template>
  <div class="goods">
    <GoodsListItem
      v-for="(item, index) in goods"
      :key="index"
      :goodsItem="item"
    ></GoodsListItem>
  </div>
</template>
  
  <script>
const GoodsListItem = () => import("../goodListItem/index.vue");
export default {
  components: {
    GoodsListItem,
  },
  props: {
    goods: {
      type: Array,
      default() {
        return [];
      },
    },
  },
};
</script>
  
  <style scoped>
.goods {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
}
</style>