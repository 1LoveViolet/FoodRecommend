<template>
  <div>
    <div class="positionCity">
      <i class="el-icon-location"></i>{{ positionCity }}
    </div>

    <div class="banner">
      <div class="swiper mySwiper">
        <div class="swiper-wrapper">
          <div
            class="swiper-slide"
            v-for="(item, index) in hotGoods"
            :key="index"
          >
            <img :src="item.image_url" alt="" />
            {{ item.name }}
          </div>
        </div>
      </div>
      <div class="welcome">
        <div class="userinfo">
          <img :src="this.userImage" alt="" />
          <div>你好，{{ this.user.username }}</div>
          <div class="useTime" v-if="this.$store.state.user">
            您已使用
            <div class="usedTime">{{ this.usedTime }}</div>
            天
          </div>
          <div class="opt" v-if="this.$store.state.user">
            <div class="userinfo-review" @click="goToReview">
              <div>评论</div>
              <div>{{ reviews.length }}</div>
            </div>
            <div class="shu"></div>
            <div class="userinfo-favorite" @click="goToFavorite">
              <div>收藏</div>
              <div>{{ favorites.length }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

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
    <div class="orderBox">
      <div class="order-zonghe" @click="zongheOrderChange">
        综合<i class="el-icon-menu"></i>
      </div>
      <div class="order-shu">|</div>
      <div class="order-price" @click="priceOrderChange">
        价格<i
          :class="this.Porder ? 'el-icon-caret-top' : 'el-icon-caret-bottom'"
        ></i>
      </div>
      <div class="order-shu">|</div>
      <div class="order-rating" @click="ratingOrderChange">
        评分<i
          :class="this.Rorder ? 'el-icon-caret-top' : 'el-icon-caret-bottom'"
        ></i>
      </div>
    </div>
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
import { getAvatar } from "api/user";
import { searchUserById } from "api/user";

// import Swiper from "swiper";
import Swiper from "swiper/bundle";
import "swiper/swiper-bundle.css";

import MapLoader from "unti/unti";
export default {
  components: {
    TabControl,
    GoodsList,
    Cuisine,
    Detail,
  },
  data() {
    return {
      user: {},
      userImage: null,
      usedTime: null,
      input: null,
      categoryList: [],
      cuisineList: [],
      showGoods: [],
      currentType: null,
      pagegoodList: [],
      isShowDetail: false,
      Porder: false,
      Rorder: false,
      // 设置评分和价格范围的阈值
      ratingThreshold: 0.3, // 评分差距阈值
      priceRangeThreshold: 50, // 价格范围差距阈值
      favorites: [],
      reviews: [],
      userFavorites: [],
      hotGoods: [],
      positionCity: null,
    };
  },
  created() {
    if (this.$store.state.user) {
      this.user = this.$store.state.user[0];
      getAvatar(this.$store.state.user[0].user_id).then((res) => {
        // console.log(res);
        const data = res.data;
        this.userImage = data.avatar_url;
      });
      // 给定时间戳
      const givenDate = new Date(this.user.create_time);

      // 当前时间戳
      const currentDate = new Date();

      // 计算时间差（毫秒）
      const timeDifference = currentDate.getTime() - givenDate.getTime();

      // 将时间差转换为天数
      const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
      this.usedTime = daysDifference;

      console.log("用户信息为:", this.user);
    } else {
      this.user.username = "请先登录";
    }
    if (this.$store.state.user) {
      this.searchUserByIdmethod();
    }
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
    // 调用 MapLoader 方法并传递回调函数
    let positionInfo = {}; // 初始化positionInfo
    MapLoader(positionInfo)
      .then((positionInfo) => {
        console.log("得到处理后的数据", positionInfo);
        // 在这里处理positionInfo的数据
        this.positionCity = positionInfo.addressComponent.city;
        console.log(this.positionCity);
      })
      .catch((error) => {
        console.error("发生错误", error);
      });
  },
  computed: {},
  mounted() {
    // this.getAllRestaurantInfo();
    this.getSwiper();
  },
  methods: {
    getSwiper() {
      this.swiper = new Swiper(".mySwiper", {
        effect: "cards",
        grabCursor: true,
        // loop: true,
        autoplay: {
          //自动开始
          delay: 3000, //时间间隔
          disableOnInteraction: false, //*手动操作轮播图后不会暂停*
        },
        speed: 500, // 就是这个东西！
        observer: true, // 修改swiper自己或子元素时，自动初始化swiper
        observeParents: true, // 修改swiper的父元素时，自动初始化swiper
      });
    },
    getHotGoods() {
      this.hotGoods = [];
      this.showGoods.map((item, index) => {
        if (index <= 6) {
          this.hotGoods.push(item);
        }
      });
    },
    searchUserByIdmethod() {
      if (this.$store.state.user[0].user_id) {
        console.log("执行了searchUserByIdmethod函数");
        searchUserById(this.$store.state.user[0].user_id).then((res) => {
          this.favorites = [];
          console.log(res);
          let Arr = res.data;
          Arr.forEach((item) => {
            switch (item.table_type) {
              case "favorites":
                // this.user.favorites = [];
                this.favorites.push(item);
                break;
              case "reviews":
                // this.user.favorites = [];
                this.reviews.push(item);
                break;
              default:
                break;
            }
          });
          console.log("this.favorites: ", this.favorites);
          this.favorites.forEach((item) => {
            this.userFavorites.push(item.restaurant_id);
          });
          console.log("this.userFavorites: ", this.userFavorites);
        });
      } else {
        console.log(
          "this.$store.state.user",
          this.$store.state.user[0].user_id
        );
        console.log("用户没登录，没有this.$store.state.user.user_id");
      }
    },
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
    //综合排序算法
    // comprehensiveSort(
    //   businesses,
    //   userFavorites,
    //   ratingThreshold,
    //   priceRangeThreshold
    // ) {
    //   businesses.sort((a, b) => {
    //     // 检查是否是用户收藏的商家
    //     const aIsFavorite = userFavorites.includes(a.id);
    //     const bIsFavorite = userFavorites.includes(b.id);

    //     // 如果一个商家是用户收藏的，但另一个不是，将收藏的商家排在前面
    //     if (aIsFavorite && !bIsFavorite) return -1;
    //     if (!aIsFavorite && bIsFavorite) return 1;

    //     // 如果两个商家都是用户收藏的，则根据 cuisine 和 category 优先排序
    //     if (aIsFavorite && bIsFavorite) {
    //       if (a.cuisine === b.cuisine) {
    //         return a.category.localeCompare(b.category);
    //       }
    //       return a.cuisine.localeCompare(b.cuisine);
    //     }

    //     // 如果评分或价格范围的差距超过阈值，则特别处理
    //     const ratingDifference = Math.abs(a.rating - b.rating);
    //     const priceRangeDifference = Math.abs(a.price_range - b.price_range);

    //     if (
    //       ratingDifference >= ratingThreshold &&
    //       priceRangeDifference >= priceRangeThreshold
    //     ) {
    //       // 如果评分和价格范围都超过阈值，则优先按照评分排序
    //       return b.rating - a.rating;
    //     } else if (ratingDifference >= ratingThreshold) {
    //       // 如果只有评分超过阈值，则优先按照评分排序
    //       return b.rating - a.rating;
    //     } else if (priceRangeDifference >= priceRangeThreshold) {
    //       // 如果只有价格范围超过阈值，则优先按照价格范围排序
    //       return a.price_range - b.price_range;
    //     }

    //     // 默认情况下，根据评分降序排序
    //     return b.rating - a.rating;
    //   });
    // },
    // ------------------------------------------------------------------------------------------------------------------------
    // comprehensiveSort(
    //   restaurants,
    //   userFavorites,
    //   ratingThreshold,
    //   priceRangeThreshold
    // ) {
    //   // 定义权重函数，根据 rating 和 price_range 计算权重
    //   function calculateWeight(restaurant) {
    //     let weight = 0;
    //     if (restaurant.rating >= ratingThreshold) {
    //       weight += 2;
    //     }
    //     if (restaurant.price_range <= priceRangeThreshold) {
    //       weight += 1;
    //     }
    //     return weight;
    //   }

    //   // 根据权重对商家进行排序
    //   restaurants.sort((a, b) => {
    //     // 计算权重
    //     let weightA = calculateWeight(a);
    //     let weightB = calculateWeight(b);

    //     // 如果权重相同，根据 name 进行排序
    //     if (weightA === weightB) {
    //       return a.name.localeCompare(b.name);
    //     } else {
    //       return weightB - weightA; // 按照权重降序排序
    //     }
    //   });

    //   // 对排序结果进行加权处理
    //   restaurants.forEach((restaurant) => {
    //     // 如果商家是用户收藏的商家，则权重加2
    //     if (userFavorites.includes(restaurant.id)) {
    //       restaurant.weight += 2;
    //     }

    //     // 查找和用户收藏商家 cuisine 和 category 相同的其他商家
    //     let similarRestaurants = restaurants.filter(
    //       (r) =>
    //         r !== restaurant &&
    //         r.category === restaurant.category &&
    //         r.cuisine === restaurant.cuisine
    //     );
    //     // 对相似商家进行权重加0.5处理
    //     similarRestaurants.forEach((similarRestaurant) => {
    //       similarRestaurant.weight += 0.5;
    //     });
    //   });

    //   // 根据加权后的权重重新排序商家
    //   restaurants.sort((a, b) => b.weight - a.weight);
    // }
    comprehensiveSort(
      shops,
      favorites,
      userFavorites,
      ratingThreshold,
      priceRangeThreshold
    ) {
      console.log("shops: ", shops);
      // 计算每个商家的初始权重值
      shops.forEach((shop) => {
        shop.weight = shop.rating * 0.2; // 初始权重为 (5 - rating) * 0.1
      });

      // 根据 price_range 使用 sort 排序，价格越低排名越高
      shops.sort((a, b) => b.price_range - a.price_range);

      // 计算 price_range 权重叠加值
      let priceRangeWeight = 0;
      let lastPriceRange = null;
      shops.forEach((shop) => {
        if (lastPriceRange === null || shop.price_range !== lastPriceRange) {
          priceRangeWeight += 0.01;
        }
        shop.weight += priceRangeWeight;
        lastPriceRange = shop.price_range;
      });

      // 计算 cuisine 和 category 权重叠加值
      shops.forEach((shop) => {
        // console.log(shop.restaurant_id);
        if (userFavorites.includes(shop.restaurant_id)) {
          // console.log("用户收藏商家权重加0.02");
          shop.weight += 0.1; // 用户收藏商家权重加0.02
        } else {
          // console.log("用户收藏没有这个");
        }
        favorites.forEach((favorite) => {
          // console.log("shop.cuisine: ", shop.cuisine);
          // console.log("shop.category: ", shop.category);
          // console.log("favorite.cuisine: ", favorite.cuisine);
          // console.log("favorite.category: ", favorite.category);

          if (
            shop.category == favorite.category &&
            shop.cuisine == favorite.cuisine
          ) {
            shop.weight += 0.1; // 用户收藏商家的category cuisine相同的其他商家权重加0.01
            // console.log("加了0.02");
          } else if (shop.category == favorite.category) {
            shop.weight += 0.05; // 用户收藏商家的category 相同的其他商家权重加0.01
            // console.log("加了0.015");
          } else if (shop.cuisine == favorite.cuisine) {
            shop.weight += 0.05; // 用户收藏商家的 cuisine  相同的其他商家权重加0.01
            // console.log("加了0.01");
          } else {
            // console.log("商家的cuisineh和category和收藏的商家不同");
          }
        });
      });

      // 如果 rating 或 price_range 差距到达阈值，特殊处理
      shops.forEach((shop) => {
        shops.forEach((otherShop) => {
          if (shop.id !== otherShop.id) {
            const ratingDifference = Math.abs(shop.rating - otherShop.rating);
            const priceRangeDifference = Math.abs(
              shop.price_range - otherShop.price_range
            );
            if (
              ratingDifference >= ratingThreshold &&
              priceRangeDifference >= priceRangeThreshold
            ) {
              // 对于 rating 或 price_range 差距到达阈值的商家，权重加上一个固定值
              shop.weight += 0;
            }
          }
        });
      });

      // 按照权重值和名称排序
      shops.sort((a, b) => {
        if (a.weight !== b.weight) {
          return b.weight - a.weight;
        } else {
          return a.name.localeCompare(b.name);
        }
      });

      // 打印排序后的权重值数组
      const weights = shops.map((shop) => shop.weight);
      console.log(weights);
    },
    zongheOrderChange() {
      this.comprehensiveSort(
        this.showGoods,
        this.favorites,
        this.userFavorites,
        this.ratingThreshold,
        this.priceRangeThreshold
      );
      if (this.$refs.goodList) {
        this.$refs.goodList.currentPage = 1;
        this.$refs.goodList.getPageInfoClick();
      }
    },
    //价格排序改变
    priceOrderChange() {
      this.Porder = !this.Porder;
      this.Rorder = false;
      if (this.Porder) {
        this.ASC("price_range");
      } else {
        this.DESC("price_range");
      }
      if (this.$refs.goodList) {
        this.$refs.goodList.currentPage = 1;
        this.$refs.goodList.getPageInfoClick();
      }
    },
    //评分排序改变
    ratingOrderChange() {
      this.Rorder = !this.Rorder;
      this.Porder = false;
      if (this.Rorder) {
        this.ASC("rating");
      } else {
        this.DESC("rating");
      }
      if (this.$refs.goodList) {
        this.$refs.goodList.currentPage = 1;
        this.$refs.goodList.getPageInfoClick();
      }
    },
    ASC(type) {
      this.showGoods.sort((a, b) => a[type] - b[type]);
    },
    DESC(type) {
      this.showGoods.sort((a, b) => b[type] - a[type]);
    },
    getRestaurantInfoByCategory() {
      searchRestaurantsByCategory(this.currentType).then((res) => {
        this.showGoods = res.data;
        // 执行综合排序算法
        this.comprehensiveSort(
          this.showGoods,
          this.favorites,
          this.userFavorites,
          this.ratingThreshold,
          this.priceRangeThreshold
        );
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
        this.comprehensiveSort(
          this.showGoods,
          this.favorites,
          this.userFavorites,
          this.ratingThreshold,
          this.priceRangeThreshold
        );
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
        this.comprehensiveSort(
          this.showGoods,
          this.favorites,
          this.userFavorites,
          this.ratingThreshold,
          this.priceRangeThreshold
        );
        this.getHotGoods();
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
    goToFavorite() {
      this.$router
        .push({
          path: "/user",
          query: {
            //query是个配置项
            id: this.user.user_id,
          },
        })
        .then((res) => {
          this.$bus.$emit("toContent2", 2);
        })
        .catch(() => {
          this.$bus.$emit("toContent2", 2);
        });
    },
    goToReview() {
      this.$router
        .push({
          path: "/user",
          query: {
            //query是个配置项
            id: this.user.user_id,
          },
        })
        .then((res) => {
          this.$bus.$emit("toContent2", 1);
        })
        .catch(() => {
          this.$bus.$emit("toContent2", 1);
        });
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
.orderBox {
  display: flex;
  justify-content: flex-end;
  text-align: center;
  color: #333;
}
.orderBox div {
  line-height: 44px;
}
.order-price,
.order-rating,
.order-zonghe {
  padding: 0 15px;
  cursor: pointer;
}
.order-price:hover {
  color: #ff6b37;
}
.order-rating:hover {
  color: #ff6b37;
}
.order-shu {
  color: #e0e0e0;
}
.banner {
  width: 100%;
  display: flex;
  margin-top: 20px;
}
.welcome {
  width: 160px;
  background: #fff;
  margin: 15px;
  padding: 0 15px;
}
.userinfo {
  width: 160px;
  padding-top: 16px;
  font-size: 12px;
  line-height: 14px;
  text-align: center;
  color: #333;
}
.userinfo img {
  width: 61px;
  height: 61px;
}
.usedTime {
  color: red;
}
.shu {
  display: inline-block;
  width: 0;
  height: 17px;
  margin: 0px 7px;
  border-right: 1px solid #ccc;
}
.useTime,
.opt {
  display: flex;
  justify-content: center;
  padding-top: 5px;
}
.userinfo-favorite,
.userinfo-review {
  cursor: pointer;
}
.userinfo-favorite:hover {
  color: red;
}
.userinfo-review:hover {
  color: red;
}
.swiper {
  width: 600px;
  height: 320px;
}

.swiper-slide {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 18px;
  font-size: 22px;
  font-weight: bold;
  color: #fff;
}
.swiper-slide img {
  width: 450px;
  height: 250px;
}

.swiper-slide:nth-child(1n) {
  background-color: rgb(206, 17, 17);
}

.swiper-slide:nth-child(2n) {
  background-color: rgb(0, 140, 255);
}

.swiper-slide:nth-child(3n) {
  background-color: rgb(10, 184, 111);
}

.swiper-slide:nth-child(4n) {
  background-color: rgb(211, 122, 7);
}

.swiper-slide:nth-child(5n) {
  background-color: rgb(118, 163, 12);
}

.swiper-slide:nth-child(6n) {
  background-color: rgb(180, 10, 47);
}

.swiper-slide:nth-child(7n) {
  background-color: rgb(35, 99, 19);
}

.swiper-slide:nth-child(8n) {
  background-color: rgb(0, 68, 255);
}

.swiper-slide:nth-child(9n) {
  background-color: rgb(218, 12, 218);
}

.swiper-slide:nth-child(10n) {
  background-color: rgb(54, 94, 77);
}
.positionCity {
  display: flex;
  justify-content: flex-start;
  background-color: #fff;
  color: #333;
  font-size: 12px;
  cursor: pointer;
}
</style>