<template>
  <div class="headerbox">
    <div class="logo">
      <img src="~assets/images/logo.png" class="logoimg" alt="" />
    </div>
    <div class="nav">
      <div class="nav-item-index nav-item" v-show="!isLogin">
        <a href="./index.html">登录/注册</a>
      </div>
      <div class="nav-item-index nav-item" v-if="isLogin">
        <a href="./index.html">{{ user.username }}</a>
      </div>
      <div class="nav-item-intro nav-item">
        <a href="./testAreaIntroduction.html">个人中心</a>
      </div>
      <div class="nav-item">
        <a href="./entryGuide.html">入驻指引</a>
      </div>
      <div class="nav-item">
        <a href="./customsClearanceServices.html">商务服务</a>
      </div>
      <div class="nav-item">
        <a href="./news.html">美食排行</a>
      </div>
      <div class="nav-item">
        <a href="./comprehensiveServices.html">帮助中心</a>
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
      user: null,
      isLogin: false,
    };
  },
  mounted() {
    // $(document).ready(function () {
    //   var url = window.location.href;
    //   var url1;
    //   $(".nav a").each(function () {
    //     url1 = $(this).attr("href");
    //     console.log(url1);
    //     console.log(url);
    //     console.log($(".nav a"));
    //     if (url.indexOf(url1.slice(2, url1.length)) != -1) {
    //       $(this).addClass("active");
    //     }
    //     if (url.indexOf("settled-enterprise.html") != -1) {
    //       console.log("入驻企业");
    //       $(".nav a").eq(0).addClass("active");
    //     }
    //     if (url.indexOf("settled-enterprise-details.html") != -1) {
    //       console.log("入驻企业");
    //       $(".nav a").eq(0).addClass("active");
    //     }
    //   });
    // });
    var flag = true;
    $(".switch").click(function () {
      if (flag) {
        $(".switch").addClass("active");
        $(".nav").show();
        flag = false;
      } else {
        $(".switch").removeClass("active");
        $(".nav").hide();
        flag = true;
      }
    });
    if ($(window).width() <= 720) {
      $(".nav").hide();
    }
    $(window).resize(function () {
      //   console.log($(window).width());
      if ($(window).width() <= 720) {
        $(".nav").hide();
      } else {
        $(".nav").show();
        $(".switch").removeClass("active");
      }
    });
  },
};
</script>

<style src="@/assets/style/common.css"  scoped></style>
<style src="@/assets/style/mobileCommon.css"  scoped></style>
<!-- <style scoped>
@import "@/assets/style/common.css";
</style> -->