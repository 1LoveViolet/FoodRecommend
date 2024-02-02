<template>
  <div class="headerbox">
    <div class="logo">
      <img
        src="~assets/images/logo.png"
        class="logoimg"
        alt=""
        @click="toHome"
      />
    </div>
    <div class="nav">
      <div class="nav-item-menu-user" v-show="this.$store.state.isLogin">
        <div class="nav-item">
          <div @click="userClick()">{{ user.username }}</div>
        </div>
        <div class="menu-item-user">
          <div class="avatar">
            <img :src="this.userImage" alt="" />
          </div>
          <div class="menu-item-user-content">
            <div class="username" @click="userClick()">{{ user.username }}</div>
            <div class="fansandreview">
              <div class="fansnum">粉丝：6</div>
              <div class="reviewnum">评论：7</div>
            </div>
            <div @click="loginOut" class="loginOut">退出</div>
          </div>
        </div>
      </div>
      <div class="nav-item" v-if="!this.$store.state.isLogin" @click="toLogin">
        <div>登录/注册</div>
      </div>
      <div class="nav-item-menu">
        <div class="nav-item">
          <div>个人中心</div>
        </div>
        <div class="menu-item">
          <div>个人信息</div>
          <div>我的收藏</div>
          <div>我的账单</div>
        </div>
      </div>
      <div class="nav-item">
        <div>入驻指引</div>
      </div>
      <div class="nav-item">
        <div>商务服务</div>
      </div>
      <div class="nav-item">
        <div>美食排行</div>
      </div>
      <div class="nav-item">
        <div>帮助中心</div>
      </div>

      <!-- <div class="nav-item">
        <a href="./commonProblem.html">常见问题</a>
      </div> -->
    </div>
    <div class="switch"></div>
  </div>
</template>

<script>
import $ from "jquery";
import { getAvatar } from "api/user";
export default {
  components: {},
  data() {
    return {
      user: {},
      userImage: null,
    };
  },
  created() {
    if (this.$store.state.user) {
      this.user = this.$store.state.user[0];
    } else {
      this.user.username = "登录/注册";
    }
  },
  mounted() {
    // $(".menu-item").css("display", "flex");
    $(".menu-item").css("display", "none");
    //获取类.div1节点 div;设置鼠标经过节点mouseover
    $(".nav-item-menu").mouseover(function () {
      $(".menu-item").css("display", "flex");
    });
    //获取类.div1节点 div;设置鼠标离开节点mouseout
    $(".nav-item-menu").mouseout(function () {
      $(".menu-item").css("display", "none");
    });

    $(".menu-item-user").css("display", "none");
    $(".nav-item-menu-user").mouseover(function () {
      $(".menu-item-user").css("display", "flex");
    });
    //获取类.div1节点 div;设置鼠标离开节点mouseout
    $(".nav-item-menu-user").mouseout(function () {
      $(".menu-item-user").css("display", "none");
    });
    getAvatar(this.$store.state.user[0].user_id).then((res) => {
      // console.log(res);
      const data = res.data;
      this.userImage = data.avatar_url;
    });
  },
  methods: {
    toHome() {
      this.$router.go(0);
    },
    toLogin() {
      this.$router.push("/login");
    },
    loginOut() {
      this.$store.dispatch("clearUser");
      this.$store.dispatch("clearToken");
      this.$store.dispatch("changeisLogin");
    },
    userClick() {
      const newhref = this.$router.resolve({
        path: "/user",
        name: "user",
        query: { id: this.user.user_id },
        // params: this.goodsItem.restaurant_id,
      });

      window.open(newhref.href, "_blank");
      // this.$router.push({
      //   name: "detail",
      //   params: { goodItem: this.goodsItem },
      // });
    },
  },
};
</script>

<style src="@/assets/style/common.css"  scoped></style>
<style src="@/assets/style/mobileCommon.css"  scoped></style>
<!-- <style scoped>
@import "@/assets/style/common.css";
</style> -->