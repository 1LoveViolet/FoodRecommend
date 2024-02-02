<template>
  <div>
    <myheader></myheader>
    <div class="user-content">
      <div class="head">
        <img :src="user.avatar_url" alt="" />
        <div class="head-content">
          <div>{{ user.username }}</div>
          <div>{{ user.residence }}</div>
          <div class="tabbox">
            <div>首页</div>
            <div>评价</div>
            <div>收藏</div>
            <div>签到</div>
            <div>图片</div>
            <div>帖子</div>
          </div>
        </div>
      </div>
      <div class="side"></div>
      <div class="content"></div>
    </div>
    <myfooter></myfooter>
  </div>
</template>

<script>
const myheader = () => import("components/header/index.vue");
const myfooter = () => import("components/footer/index.vue");
import { searchUserById } from "api/user";
export default {
  components: {
    myheader,
    myfooter,
  },
  props: {
    ReviewsItem: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  data() {
    return {
      user: {},
      favorites: [],
    };
  },
  created() {
    searchUserById(this.$route.query.id).then((res) => {
      console.log(res);
      let Arr = res.data;
      Arr.forEach((item) => {
        switch (item.table_type) {
          case "users":
            this.user = item;
            break;
          case "favorites":
            // this.user.favorites = [];
            this.favorites.push(item);
            break;
          default:
            break;
        }
      });
      console.log("this.user: ", this.user);
      console.log("this.favorites: ", this.favorites);
    });
    console.log(this.$route.query);
  },
  methods: {},
};
</script>

<style scoped>
.user-content {
  width: 70%;
  margin: auto;
  background-color: aqua;
}
.head {
  width: 100%;
  display: flex;
}
.head img {
  width: 100px;
  height: 100px;
  margin: 10px;
}
.head-content {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
}
.tabbox {
  width: 80%;
  display: flex;
  justify-content: space-between;
}
.tabbox div {
  width: 12%;
  height: 21px;
  text-align: center;
  padding: 7px 9px 7px 10px;
  border: 1px solid #eaeaea;
  font-size: 14px;
  vertical-align: middle;
  border-color: #ffddb0;
  background-color: #fdfbef;
  color: #ff8400;
}
</style>