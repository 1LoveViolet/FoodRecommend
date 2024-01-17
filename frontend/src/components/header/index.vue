<template>
  <div class="headerbox">
    <div class="logo">
      <img src="~assets/images/logo.png" class="logoimg" alt="" />
    </div>
    <div class="nav">
      <div class="nav-item-menu" v-show="this.$store.state.isLogin">
        <div class="nav-item">
          <div>{{ user.username }}</div>
        </div>
        <div class="menu-item" v-show="this.$store.state.isLogin">
          <div>个人信息</div>
          <div>我的收藏</div>
          <div>我的账单</div>
          <div @click="loginOut">退出注销</div>
        </div>
      </div>
      <div class="nav-item" v-if="!this.$store.state.isLogin" @click="toLogin">
        <div>登录/注册</div>
      </div>
      <div class="nav-item-intro nav-item">
        <div>个人中心</div>
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
export default {
  components: {},
  data() {
    return {
      user: {},
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
  },
  methods: {
    toLogin() {
      this.$router.push("/login");
    },
    loginOut() {
      this.$store.dispatch("clearUser");
      this.$store.dispatch("clearToken");
      this.$store.dispatch("changeisLogin");
    },
  },
};
</script>

<style src="@/assets/style/common.css"  scoped></style>
<style src="@/assets/style/mobileCommon.css"  scoped></style>
<!-- <style scoped>
@import "@/assets/style/common.css";
</style> -->