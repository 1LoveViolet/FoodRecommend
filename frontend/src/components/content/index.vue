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
          <el-button
            slot="append"
            icon="el-icon-search"
            @click="inputClick"
          ></el-button>
        </el-input>
      </div>
    </div>
    <TabControl
      ref="tabControl2"
      v-if="!isShowDetail"
      :categorys="this.categoryList"
      @tabClick="tabClick(arguments)"
      @hook:mounted="tabControl2Mounted"
    ></TabControl>
    <Cuisine
      v-show="this.currentType !== '不限'"
      ref="tabControl3"
      v-if="!isShowDetail"
      :cuisines="this.cuisineList"
      @cuisineClick="cuisineClick(arguments)"
    ></Cuisine>
    <GoodsList
      ref="goodList"
      v-if="!isShowDetail"
      :goods="this.showGoods"
      :pagegoodList="this.pagegoodList"
      @getPageInfoClick="getPageInfoClick(arguments)"
    ></GoodsList>
    <Detail v-if="isShowDetail"></Detail>
  </div>
</template>

<script>
const TabControl = () =>
  import("components/content/components/tabControl/index.vue");
const GoodsList = () =>
  import("components/content/components/goodList/index.vue");
const Cuisine = () =>
  import("components/content/components/cuisineList/index.vue");
const Detail = () =>
  import("components/content/components/goodDetail/index.vue");
import {
  searchRestaurants,
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
    Detail,
  },
  data() {
    return {
      input: null,
      categoryList: [],
      cuisineList: [],
      showGoods: [],
      currentType: null,
      pagegoodList: [],
      isShowDetail: false,
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

    this.getAllRestaurantInfo();
  },
  computed: {},
  mounted() {
    // this.getAllRestaurantInfo();
  },
  methods: {
    getPageInfoClick(argus) {
      const { pagesize, currentPage } = argus[0];
      //清空pagegoodList中的数据
      this.pagegoodList = [];
      // 获取当前页的数据
      for (
        let i = (currentPage - 1) * pagesize;
        i < this.showGoods.length;
        i++
      ) {
        //把遍历的数据添加到pagegoodList里面
        this.pagegoodList.push(this.showGoods[i]);
        //判断是否达到一页的要求
        if (this.pagegoodList.length === pagesize) break;
      }
    },
    //对象数组去重
    uniqueFunc(arr, uniId) {
      const res = new Map();
      return arr.filter(
        (item) => !res.has(item[uniId]) && res.set(item[uniId], 1)
      );
    },
    getRestaurantInfoByCategory() {
      searchRestaurantsByCategory(this.currentType).then((res) => {
        this.showGoods = res.data;
        console.log(this.showGoods);
        if (this.$refs.goodList) {
          this.$refs.goodList.currentPage = 1;
          this.$refs.goodList.getPageInfoClick();
          console.log("tabclick点击后，showgood: ", this.showGoods);
          console.log("tabclick点击后，pagegoodList: ", this.pagegoodList);
        }
      });
    },
    getRestaurantInfoByCuisine() {
      searchRestaurantsByCuisine(this.currentType).then((res) => {
        this.showGoods = res.data;
        console.log(this.showGoods);
        if (this.$refs.goodList) {
          this.$refs.goodList.currentPage = 1;
          this.$refs.goodList.getPageInfoClick();
          console.log("cuisineClick点击后，showgood: ", this.showGoods);
          console.log("cuisineClick点击后，pagegoodList: ", this.pagegoodList);
        }
      });
    },
    getAllRestaurantInfo() {
      searchAllRestaurants().then((res) => {
        this.showGoods = res.data;
        if (this.$refs.goodList) {
          this.$refs.goodList.currentPage = 1;
          this.$refs.goodList.getPageInfoClick();
          console.log("当选择不限,tabClick点击后，showgood: ", this.showGoods);
          console.log(
            "当选择不限,tabClick点击后，pagegoodList: ",
            this.pagegoodList
          );
        }
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
      this.currentType = item;
      console.log("this.currentType:  ", this.currentType);
      this.$refs.tabControl2.currentIndex = index;
      this.getCuisine(this.currentType);
      if (this.currentType == "不限") {
        this.getAllRestaurantInfo();
      } else {
        this.getRestaurantInfoByCategory();
      }
      if (this.$refs.goodList) {
        this.$refs.goodList.currentPage = 1;
        this.$refs.goodList.getPageInfoClick();
      }
      this.input = "";
    },
    cuisineClick(argus) {
      const { item, index } = argus[0];
      this.currentType = item;
      console.log("this.currentType:  ", this.currentType);
      this.$refs.tabControl3.currentIndex = index;
      this.getRestaurantInfoByCuisine();
      if (this.$refs.goodList) {
        this.$refs.goodList.currentPage = 1;
        this.$refs.goodList.getPageInfoClick();
      }
      this.input = "";
    },

    inputClick() {
      this.currentType = "不限";
      this.$refs.tabControl2.currentIndex = 0;
      console.log("input:  ", this.input);
      let data = { input: this.input };
      searchRestaurants(data).then((res) => {
        console.log("输入框提交后结果:", res);
        this.showGoods = res.data;
        this.$refs.goodList.currentPage = 1;
        this.$refs.goodList.getPageInfoClick();
      });
    },
    tabControl2Mounted() {
      if (
        this.$refs.tabControl2 &&
        this.$route.params !== {} &&
        this.$route.params !== undefined &&
        this.$route.params.input
      ) {
        this.input = this.$route.params.input;
        this.inputClick();
      }
    },
  },
};
</script>

<style>
.content-head {
  width: 100%;
  position: relative;
  display: flex;
  /* background-color: blueviolet; */
  justify-content: space-between;
  margin-top: 20px;
  border-bottom: 2px #ff6b37 solid;
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