<template>
  <!-- <div class="goods" @click="itemClick"> -->
  <div class="goodItem" @click="goodItemClick">
    <!-- <img :src="goodsItem.image_url" alt="" @load="imageLoad" /> -->
    <img class="logoimg" :src="goodsItem.image_url" alt="" />
    <div class="goods-info">
      <span class="title">{{ goodsItem.name }}</span>
      <div class="goodinfo-2">
        <el-rate
          v-model="goodsItem.rating"
          disabled
          show-score
          text-color="#ff9900"
          score-template="{value}"
        >
        </el-rate>
        <span class="price">{{ goodsItem.price_range }}</span>
      </div>
      <!-- <span class="rating">{{ goodsItem.rating }}</span> -->
      <div class="goodinfo-3">
        <span class="cuisine">{{ goodsItem.cuisine }}</span>
        <div class="rectangle-1">|</div>
        <span class="area">{{ goodsItem.area }}</span>
      </div>
      <span class="description">{{ goodsItem.description }}</span>
    </div>
  </div>
</template>
  
  <script>
export default {
  props: {
    goodsItem: {
      type: Object,
      default() {
        return {
          goodsItem: this.goodsItem,
        };
      },
    },
  },
  data() {
    return {};
  },
  methods: {
    goodItemClick() {
      console.log("点击了goodItem");
      console.log("this.goodsItem: ", this.goodsItem);
    },
    // imageLoad() {
    //   this.$bus.$emit("itemimageLoad");
    // },
    // itemClick() {
    //   this.$router.push("/detail/" + this.goodsItem.iid);
    // },
  },
};
</script>
  
  <style scoped>
.goodItem {
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-content: center;
  border-bottom: 1px solid #f0f0f0;
}
.logoimg {
  width: 20%;
  margin: 15px;
}
.goods-info {
  width: 80%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  margin: 15px;
}
.goods-info span {
  height: 26px;
}
.title {
  margin-right: 5px;
  font-size: 16px;
  max-width: 380px;
  color: #333;
}
.goodinfo-2 {
  display: flex;
  justify-content: flex-start;
  color: #999;
  line-height: 26px;
  font: 12px/1.5 "Microsoft YaHei", "Hiragino Sans GB";
}
.price {
  margin-left: 10px;
}
.goodinfo-3 {
  display: flex;
  justify-content: flex-start;
  color: #999;
  line-height: 26px;
  font: 12px/1.5 "Microsoft YaHei", "Hiragino Sans GB";
}
.rectangle-1 {
  margin: 0 5px;
  color: #e8e8e8;
}
/* .goodItem {
  padding-bottom: 40px;
  position: relative;
  width: 48%;
}
.goodItem img {
  width: 100%;
}

.goods-info {
  font-size: 12px;
  position: absolute;
  bottom: 5px;
  left: 0;
  right: 0;
  overflow: hidden;
  text-align: center;
}

.goods-info p {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-bottom: 3px;
}

.goods-info .price {
  color: var(--color-high-text);
  margin-right: 20px;
}

.goods-info .rating {
  position: relative;
}

.goods-info .rating::before {
  content: "";
  position: absolute;
  left: -15px;
  top: 0;
  width: 14px;
  height: 14px;
} */
</style>