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
    <Cuisine
      v-show="this.currentType !== '不限'"
      ref="tabControl3"
      class=""
      :cuisines="this.cuisineList"
      @cuisineClick="cuisineClick(arguments)"
    ></Cuisine>
    <GoodsList :goods="this.showGoods"></GoodsList>
  </div>
</template>

<script>
const TabControl = () =>
  import("components/content/components/tabControl/index.vue");
const GoodsList = () =>
  import("components/content/components/goodList/index.vue");
const Cuisine = () =>
  import("components/content/components/cuisineList/index.vue");
import {
  searchRestaurantCuisine,
  searchRestaurantCategory,
  searchRestaurantsByCategory,
  searchRestaurantsByCuisine,
  searchAllRestaurants,
} from "api/good";
export default {
  components: {
    TabControl,
    GoodsList,
    Cuisine,
  },
  data() {
    return {
      input: null,
      categoryList: [],
      cuisineList: [],
      showGoods: [],
      currentType: null,
      // goods: {
      //   pop: { page: 0, list: [] },
      //   new: { page: 0, list: [] },
      //   sell: { page: 0, list: [] },
      // },
    };
  },
  created() {
    searchRestaurantCategory().then((res) => {
      let ArrCategory = this.uniqueFunc(res.data, "category");
      this.categoryList.push("不限");
      ArrCategory.forEach((item) => {
        this.categoryList.push(item.category);
      });
      console.log(this.categoryList);
      this.getCuisine(this.categoryList[0]);
      this.currentType = "不限";
    });
  },
  computed: {},
  mounted() {
    this.getAllRestaurantInfo();
  },
  methods: {
    //对象数组去重
    uniqueFunc(arr, uniId) {
      const res = new Map();
      return arr.filter(
        (item) => !res.has(item[uniId]) && res.set(item[uniId], 1)
      );
    },
    getRestaurantInfoByCategory() {
      searchRestaurantsByCategory(this.currentType).then((res) => {
        console.log(res);
        this.showGoods = res.data;
        console.log(this.showGoods);
      });
    },
    getRestaurantInfoByCuisine() {
      searchRestaurantsByCuisine(this.currentType).then((res) => {
        console.log(res);
        this.showGoods = res.data;
        console.log(this.showGoods);
      });
    },
    getAllRestaurantInfo() {
      searchAllRestaurants().then((res) => {
        console.log(res);
        this.showGoods = res.data;
        console.log(this.showGoods);
      });
    },
    //获取副种类
    getCuisine(canshu) {
      searchRestaurantCuisine(canshu).then((res) => {
        let ArrCuisine = this.uniqueFunc(res.data, "cuisine");
        this.cuisineList = [];
        ArrCuisine.forEach((item) => {
          this.cuisineList.push(item.cuisine);
        });
        console.log(this.cuisineList);
      });
    },
    //事件监听相关的代码
    tabClick(argus) {
      const { item, index } = argus[0];
      console.log(item);
      this.currentType = item;
      console.log("this.currentType:  ", this.currentType);
      this.$refs.tabControl2.currentIndex = index;
      this.getCuisine(this.currentType);
      if (this.currentType == "不限") {
        this.getAllRestaurantInfo();
      } else {
        this.getRestaurantInfoByCategory();
      }
      // this.$refs.tabControl1.currentIndex = index;
    },
    cuisineClick(argus) {
      const { item, index } = argus[0];
      console.log(item);
      this.currentType = item;
      console.log("this.currentType:  ", this.currentType);
      this.$refs.tabControl3.currentIndex = index;
      this.getRestaurantInfoByCuisine();
    },
  },
};
</script>

<style>
.content-head {
  width: 100%;
  display: flex;
  /* background-color: blueviolet; */
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