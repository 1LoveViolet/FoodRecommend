<template>
  <div>
    <myheader></myheader>

    <div class="content">
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

      <div class="detail">
        <div class="detail-head">
          <div class="detail-title">{{ restaurantInfo[0].name }}</div>
          <div class="detail-rating">
            <el-rate
              v-model="restaurantInfo[0].rating"
              disabled
              show-score
              text-color="#ff9900"
              score-template="{value}"
            >
            </el-rate>
            <div class="detail-price">
              人均：{{ restaurantInfo[0].price_range }}
            </div>
          </div>
          <div class="detail-address">
            地址：{{ restaurantInfo[0].address }}
          </div>
          <div class="detail-phone">电话：{{ restaurantInfo[0].phone }}</div>
          <div class="detail-cuisine">
            特色：{{ restaurantInfo[0].cuisine }}
          </div>
          <div class="detail-bankhour">
            营业时间：{{ restaurantInfo[0].bankhour }}
          </div>
          <div class="detail-writeRV"><i class="el-icon-edit"></i>写评价</div>
        </div>
      </div>

      <div class="detail-card">
        <el-tabs type="border-card">
          <el-tab-pane label="推荐菜">
            <div class="detail-dish">
              <div
                v-for="(item, index) in dishList"
                :key="index"
                class="detail-dish-box"
              >
                <img :src="item.image_url" alt="" class="detail-dish-img" />
                <div>{{ item.name }}</div>
                <div class="detail-dish-price">￥{{ item.price }}</div>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="商家相册">
            <div class="detail-photo">
              <img :src="restaurantInfo[0].image_url" alt="" />
            </div>
          </el-tab-pane>
          <el-tab-pane label="品牌故事">
            <div class="detail-story">
              <img :src="restaurantInfo[0].image_url" alt="" />
              <div class="detail-story-content">
                <h3>关于{{ restaurantInfo[0].name }}</h3>
                {{ restaurantInfo[0].story }}
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>

      <GoodReview
        :Reviews="this.showReviews"
        :pagereviewList="this.pagereviewList"
        @getPageInfoClick="getPageInfoClick(arguments)"
      ></GoodReview>
    </div>

    <myfooter></myfooter>
  </div>
</template>

<script>
const myheader = () => import("components/header/index.vue");
const myfooter = () => import("components/footer/index.vue");
const GoodReview = () => import("../goodReview/index.vue");
import { searchRestaurants, searchRestaurantInfoById } from "api/good";
export default {
  components: {
    myheader,
    myfooter,
    GoodReview,
    // goodsList,
  },
  data() {
    return {
      goodItem: null,
      dishList: [],
      restaurantInfo: [],
      pagereviewList: [],
      showReviews: [],
      input: null,
    };
  },
  created() {
    searchRestaurantInfoById(this.$route.query.id).then((res) => {
      console.log("res: ", res);
      let Arr = res.data;
      Arr.forEach((item) => {
        switch (item.table_type) {
          case "dishes":
            this.dishList.push(item);
            break;
          case "restaurants":
            this.restaurantInfo.push(item);
            break;
          case "reviews":
            this.showReviews.push(item);
            break;
          default:
            break;
        }
      });
    });
    console.log("detail中的dishList: ", this.dishList);
    console.log("detail中的restaurantInfo: ", this.restaurantInfo);
    console.log("detail中的reviewList: ", this.showReviews);
  },
  mounted() {
    // console.log("params: ", this.$route.params);
    console.log("query: ", this.$route.query);
  },
  methods: {
    getPageInfoClick(argus) {
      const { pagesize, currentPage } = argus[0];
      //清空pagereviewList中的数据
      this.pagereviewList = [];
      // 获取当前页的数据
      for (
        let i = (currentPage - 1) * pagesize;
        i < this.showReviews.length;
        i++
      ) {
        //把遍历的数据添加到pagereviewList里面
        this.pagereviewList.push(this.showReviews[i]);
        //判断是否达到一页的要求
        if (this.pagereviewList.length === pagesize) break;
      }
      console.log(
        "detail中的getPageInfoClick的this.pagereviewList: ",
        this.pagereviewList
      );
    },
    inputClick() {
      // this.currentType = "不限";
      // this.$refs.tabControl2.currentIndex = 0;
      console.log("input:  ", this.input);
      let data = { input: this.input };
      this.$router.push({
        name: "Home",
        params: data,
      });

      searchRestaurants(data).then((res) => {
        console.log("输入框提交后结果:", res);
        // this.showReviews = res.data;
        // this.$refs.goodList.getPageInfoClick();
      });
    },
  },
};
</script>


<style src="@/assets/style/gooddetail.css"  scoped></style>