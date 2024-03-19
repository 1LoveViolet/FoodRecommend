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
          <div
            class="detail-address"
            @click="onSearchAddress(restaurantInfo[0].address)"
          >
            地址：{{ restaurantInfo[0].address }}
            <i
              class="el-icon-location"
              @click="onSearchAddress(scope.row.duAddress)"
            >
            </i>
          </div>
          <div class="detail-phone">电话：{{ restaurantInfo[0].phone }}</div>
          <div class="detail-cuisine">
            特色：{{ restaurantInfo[0].cuisine }}
          </div>
          <div class="detail-bankhour">
            营业时间：{{ restaurantInfo[0].bankhour }}
          </div>
          <div class="detail-writeRVBox">
            <div class="detail-writeRV" @click="addReviewbtn">
              <i class="el-icon-edit"></i>写评价
            </div>
            <div>
              <i
                :class="isFavorite ? 'el-icon-star-on' : 'el-icon-star-off'"
                @click="favoriteBtn"
              ></i>
            </div>
          </div>
        </div>
      </div>

      <div class="detail-card" v-show="!isAddReview">
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
                <div class="detail-dish-price" v-if="item.price">
                  ￥{{ item.price }}
                </div>
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
        v-show="!isAddReview"
        :Reviews="this.showReviews"
        :pagereviewList="this.pagereviewList"
        @getPageInfoClick="getPageInfoClick(arguments)"
      ></GoodReview>

      <el-form
        ref="review"
        :model="review"
        label-width="80px"
        v-show="isAddReview"
      >
        <el-form-item label="总体评价:">
          <div class="form-rate">
            <el-rate
              v-model="review.rate"
              :colors="colors"
              show-text
              allow-half
            >
            </el-rate>
            <div>{{ review.rate }}</div>
          </div>
        </el-form-item>
        <el-form-item label="评价:">
          <el-popover
            placement="left"
            title="标题"
            width="500"
            height="700"
            trigger="click"
            v-model="emojiShow"
          >
            <div slot="reference" class="emojiBtn">😀</div>
            <div class="browBox">
              <ul>
                <li
                  v-for="(item, index) in faceList"
                  :key="index"
                  @click="getBrow(index)"
                >
                  {{ item }}
                </li>
              </ul>
            </div>
          </el-popover>
          <el-input
            type="textarea"
            placeholder="请输入内容"
            v-model="review.content"
            maxlength="2000"
            show-word-limit
          >
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">发表评价</el-button>
          <el-button>取消发表</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 地图 -->
    <el-dialog title="地理位置" :visible.sync="dialogVisible" width="50%">
      <div class="map_address">
        <div class="address-wrapper" :style="{ width: '100%', height: '100%' }">
          <el-amap
            vid="amap"
            :key="amapKey"
            class="amap-demo"
            :amap-manager="amapManager"
            :center="center"
            :zoom="zoom"
            style="height: 500px; width: 800px"
          >
            <el-amap-marker
              v-for="(marker, index) in markers"
              :key="'marker' + index"
              :position="marker"
            >
            </el-amap-marker>
          </el-amap>
        </div>
      </div>
    </el-dialog>

    <myfooter></myfooter>
  </div>
</template>

<script>
const myheader = () => import("components/header/index.vue");
const myfooter = () => import("components/footer/index.vue");
const GoodReview = () => import("../goodReview/index.vue");
const appData = require("@/assets/images/emojis.json");
import {
  searchRestaurants,
  searchRestaurantInfoById,
  addReview,
} from "api/good";
import { addFavorite, deleteFavorite, isFavorite } from "api/user";

//引入获取实例
import { AMapManager } from "vue-amap";
let amapManager = new AMapManager();
export default {
  components: {
    myheader,
    myfooter,
    GoodReview,
    // goodsList,
  },
  data() {
    const self = this;
    return {
      goodItem: null,
      dishList: [],
      restaurantInfo: [],
      pagereviewList: [],
      showReviews: [],
      input: null,
      isAddReview: false,
      review: {
        rate: null,
        content: "",
      },
      colors: ["#99A9BF", "#F7BA2A", "#FF9900"], // 等同于 { 2: '#99A9BF', 4: { value: '#F7BA2A', excluded: true }, 5: '#FF9900' }
      content: "",
      //表情框是否展示
      emojiShow: false,
      //表情列表
      faceList: [],
      //表情文本
      getBrowString: "",
      isFavorite: false,
      amapKey: "66be375bbee739346813eda698d5e2c8",
      center: [0, 0],
      loaded: false,
      zoom: 17,
      input: "",
      lng: 0,
      lat: 0,
      amapManager,
      searchOption: { city: "全国", citylimit: false },
      markers: [], //标记
      dialogVisible: false,
    };
  },
  created() {
    searchRestaurantInfoById(this.$route.query.id).then((res) => {
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
      this.initIsFavorite();
    });
    console.log("detail中的dishList: ", this.dishList);
    console.log("detail中的restaurantInfo: ", this.restaurantInfo);
    console.log("detail中的reviewList: ", this.showReviews);
    this.loadEmojis();
  },
  mounted() {},
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
    addReviewbtn() {
      if (this.$store.state.token) {
        this.isAddReview = !this.isAddReview;
        console.log("addReviewbtn函数执行");
      } else {
        // 用户未登录，重定向到登录页面或其他处理方式
        this.$alert("请先登录", "提示", {
          confirmButtonText: "确定",
          type: "warning",
          callback: () => {
            this.$router.push("/login");
          },
        });
      }
    },
    getNowTime() {
      var now = new Date();
      var year = now.getFullYear(); //获取年
      var month = now.getMonth(); //获取月
      var date = now.getDate(); //获取日
      var hours = now.getHours(); //获取小时
      var minutes = now.getMinutes(); //获取分钟
      var seconds = now.getSeconds(); //获取秒
      month = month + 1;
      month = month.toString().padStart(2, "0");
      date = date.toString().padStart(2, "0");
      var defaultDate = `${year}-${month}-${date} ${hours}:${minutes}:${seconds}`;
      return defaultDate;
    },
    onSubmit() {
      let data = {
        restaurant_id: this.restaurantInfo[0].restaurant_id,
        user_id: this.$store.state.user[0].user_id,
        rating: this.review.rate,
        comment: this.review.content,
        date: this.getNowTime(),
      };
      addReview(data).then((res) => {
        this.$router.go(0);
        console.log(res);
      });
    },
    loadEmojis() {
      for (let i in appData) {
        this.faceList.push(appData[i].char);
      }
    },
    // 获取用户点击之后的标签 ，存放到输入框内
    getBrow(index) {
      for (let i in this.faceList) {
        if (index == i) {
          this.getBrowString = this.faceList[index];
          this.review.content += this.getBrowString;
        }
      }
      this.emojiShow = false;
    },
    favoriteBtn() {
      if (this.$store.state.token) {
        this.isFavorite = !this.isFavorite;
        if (this.isFavorite) {
          let data = {
            user_id: this.$store.state.user[0].user_id,
            restaurant_id: this.restaurantInfo[0].restaurant_id,
            fdate: this.getNowTime(),
          };
          addFavorite(data).then((res) => {
            this.$notify({
              title: "成功",
              message: "收藏成功",
              type: "success",
              offset: 100,
            });
            console.log("收藏");
          });
        } else {
          let user_id = this.$store.state.user[0].user_id;
          let restaurant_id = this.restaurantInfo[0].restaurant_id;
          deleteFavorite(user_id, restaurant_id).then((res) => {
            this.$notify({
              title: "取消",
              message: "取消收藏",
              type: "warning",
              offset: 100,
            });
            console.log("取消收藏");
          });
        }
      } else {
        // 用户未登录，重定向到登录页面或其他处理方式
        this.$alert("请先登录", "提示", {
          confirmButtonText: "确定",
          type: "warning",
          callback: () => {
            this.$router.push("/login");
          },
        });
      }
    },
    initIsFavorite() {
      if (this.$store.state.token) {
        let user_id = this.$store.state.user[0].user_id;
        let restaurant_id = this.restaurantInfo[0].restaurant_id;
        isFavorite(user_id, restaurant_id).then((res) => {
          if (res.data.length == 0) {
            this.isFavorite = false;
          } else {
            this.isFavorite = true;
          }
        });
      }
    },
    onSearchAddress(e) {
      this.dialogVisible = true;
      console.log(" onSearchAddress方法的e:", e);
      AMap.plugin("AMap.Geocoder", () => {
        var geocoder = new AMap.Geocoder({
          // city 指定进行编码查询的城市，支持传入城市名、adcode 和 citycode
          city: "成都市",
        });
        geocoder.getLocation(e, (status, result) => {
          console.log("getLocation的status:", status);
          console.log("getLocation的result:", result);
          if (status === "complete" && result.info === "OK") {
            // result中对应详细地理坐标信息
            this.center = [
              result.geocodes[0].location.lng,
              result.geocodes[0].location.lat,
            ];
            this.markers.push([
              result.geocodes[0].location.lng,
              result.geocodes[0].location.lat,
            ]);
            //把搜索的位置的第一个值
          }
        });
      });
    },
  },
};
</script>


<style src="@/assets/style/gooddetail.css"  scoped></style>