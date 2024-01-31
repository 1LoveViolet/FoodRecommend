<template>
  <div class="navigation">
    <div class="fenlei">分类：</div>
    <div class="nav-category">
      <div
        v-for="(item, index) in categorys"
        :key="index"
        class="nav-category-item"
        @click="itemclick(item, index)"
      >
        <div :class="{ active: index === currentIndex }">{{ item }}</div>
      </div>
    </div>
  </div>
</template>
  
  <script>
export default {
  components: {},
  props: {
    categorys: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      currentIndex: 0,
      categoryList: [],
    };
  },
  created() {},
  methods: {
    itemclick(item, index) {
      this.currentIndex = index;
      this.$emit("tabClick", { item, index });
    },
  },
};
</script>

<style scoped>
.fenlei {
  white-space: nowrap;
}
.navigation {
  display: flex;
  border: 1px solid #f0f0f0;
  padding: 18px 0 0 19px;
  background: #fff;
  zoom: 1;
  font-size: 12px;
}
.nav-category {
  display: flex;
  align-content: center;
  flex-wrap: wrap;
  line-height: 20px;
  color: #666;
}
.nav-category-item {
  width: 97px;
  margin-bottom: 5px;
}
.nav-category-item div {
  display: inline-block;
  margin-left: -4px;
  padding: 0px 4px;
  cursor: pointer;
}
.active {
  background-color: #f63;
  color: #fff;
  padding: 0 8px;
  height: 20px;
  line-height: 20px;
  border-radius: 10px;
}
</style>
