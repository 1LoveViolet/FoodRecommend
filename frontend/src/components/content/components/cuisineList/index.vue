<template>
  <div class="navigation">
    <div class="fenlei"></div>
    <div class="nav-cuisine">
      <div
        v-for="(item, index) in cuisines"
        :key="index"
        class="nav-cuisine-item"
        @click="itemclick(item, index)"
      >
        <span :class="{ active: index === currentIndex }">{{ item }}</span>
      </div>
    </div>
  </div>
</template>
    
    <script>
export default {
  props: {
    cuisines: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      currentIndex: 0,
    };
  },
  methods: {
    itemclick(item, index) {
      this.currentIndex = index;
      this.$emit("cuisineClick", { item, index });
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
  padding: 18px 0 0 55px;
  zoom: 1;
  font-size: 12px;
  background-color: #fafafa;
  border: solid 1px #eee;
}
.nav-cuisine {
  display: flex;
  align-content: center;
  flex-wrap: wrap;
  line-height: 20px;
  color: #666;
}
.nav-cuisine-item {
  width: 97px;
  margin-bottom: 5px;
}
.nav-cuisine-item span {
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
  