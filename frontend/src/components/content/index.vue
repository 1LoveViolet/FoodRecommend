<template>
  <div>
    <div class="content-head">
      <div class="allcate">
        全部美食分类
        <i class="el-icon-caret-bottom i-cate"></i>
      </div>
      <div class="input">
        <el-input
          placeholder="请输入内容"
          v-model="input"
          class="input-with-select"
        >
          <el-button slot="append" icon="el-icon-search"></el-button>
        </el-input>
      </div>
    </div>
    <TabControl
      ref="tabControl2"
      class=""
      :categorys="this.categoryList"
      @tabClick="tabClick(arguments)"
    ></TabControl>
    <GoodsList :goods="showGoods"></GoodsList>
  </div>
</template>

<script>
const TabControl = () =>
  import("components/content/components/tabControl/index.vue");
const GoodsList = () =>
  import("components/content/components/goodList/index.vue");
import { searchRestaurantCategory } from "api/good";
export default {
  components: {
    TabControl,
    GoodsList,
  },
  data() {
    return {
      input: null,
      categoryList: [],
      goods: {},
      // goods: {
      //   pop: { page: 0, list: [] },
      //   new: { page: 0, list: [] },
      //   sell: { page: 0, list: [] },
      // },
    };
  },
  created() {
    searchRestaurantCategory().then((res) => {
      console.log(res);
      let ArrCategory = this.uniqueFunc(res.data, "category");
      console.log(ArrCategory);
      ArrCategory.forEach((item) => {
        this.categoryList.push(item.category);
      });
      console.log(this.categoryList);
    });
  },
  computed: {
    // showGoods() {
    //   return this.goods[this.currentType].list;
    // },
  },
  mounted() {},
  methods: {
    //对象数组去重
    uniqueFunc(arr, uniId) {
      const res = new Map();
      return arr.filter(
        (item) => !res.has(item[uniId]) && res.set(item[uniId], 1)
      );
    },
    //事件监听相关的代码
    tabClick(argus) {
      console.log(argus[0]);
      const { item, index } = argus[0];
      console.log(item);
      console.log(index);
      this.currentType = item;
      this.$refs.tabControl2.currentIndex = index;
      // this.$refs.tabControl1.currentIndex = index;
    },
  },
};
</script>

<style>
.content-head {
  width: 100%;
  display: flex;
  background-color: blueviolet;
  justify-content: space-between;
  margin-top: 20px;
}
.allcate {
  width: 30%;
  position: relative;
  background-color: #ff6b37;
  color: #fff;
  font-size: 15px;
  text-align: center;
  line-height: 35px;
  font-family: "Microsoft YaHei", "Hiragino Sans GB";
}
.i-cate {
  position: absolute;
  right: 15px;
  top: 10px;
}
.input {
  width: 60%;
}
.content-top {
  margin-bottom: 20px;
}
</style>