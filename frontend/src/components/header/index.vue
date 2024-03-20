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
    <!-- <div class="positionCity">
      <i class="el-icon-location"></i>{{ positionCity }}
    </div> -->
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
          <div @click="toUser">个人中心</div>
        </div>
        <div class="menu-item">
          <div @click="toContent1">个人信息</div>
          <div @click="toContent2">我的评价</div>
          <div @click="toContent3">我的收藏</div>
          <div @click="toContent4">我的设置</div>
        </div>
      </div>
      <div class="nav-item">
        <div @click="toHome">美食首页</div>
      </div>
      <div class="nav-item">
        <div>商务服务</div>
      </div>
      <div class="nav-item">
        <div @click="toRank">美食排行</div>
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
import MapLoader from "unti/unti";
export default {
  components: {},
  data() {
    return {
      user: {},
      userImage: null,
      index1: 0,
      index2: 1,
      index3: 2,
      index4: 3,
      positionCity: null,
    };
  },
  created() {
    console.log("this.$store.state.user: ", this.$store.state.user);
    if (this.$store.state.user) {
      this.user = this.$store.state.user[0];
    } else {
      this.user.username = "登录/注册";
    }
    // 调用 MapLoader 方法并传递回调函数
    let positionInfo = {}; // 初始化positionInfo
    MapLoader(positionInfo)
      .then((positionInfo) => {
        console.log("得到处理后的数据", positionInfo);
        // 在这里处理positionInfo的数据
        this.positionCity = positionInfo.addressComponent.city;
      })
      .catch((error) => {
        console.error("发生错误", error);
      });
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
    if (this.$store.state.user) {
      getAvatar(this.$store.state.user[0].user_id).then((res) => {
        // console.log(res);
        const data = res.data;
        this.userImage = data.avatar_url;
      });
    }
  },
  methods: {
    toHome() {
      this.$router.go(0);
    },
    toLogin() {
      this.$router.push("/login");
    },
    toRank() {
      this.$router.push("/rank");
    },
    loginOut() {
      this.$store.dispatch("clearUser");
      this.$store.dispatch("clearToken");
      this.$store.dispatch("changeisLogin");
      this.$router.push("/home");
    },
    userClick() {
      const newhref = this.$router.resolve({
        path: "/user",
        name: "user",
        query: { id: this.user.user_id },
      });

      window.open(newhref.href, "_blank");
    },
    toContent1() {
      this.$router
        .push({
          path: "/user",
          query: {
            //query是个配置项
            id: this.user.user_id,
          },
        })
        .then((res) => {
          this.$bus.$emit("toContent1", this.index1);
        })
        .catch(() => {
          this.$bus.$emit("toContent1", this.index1);
        });
      // this.$bus.$emit("toContent1", this.index1);
    },
    toContent2() {
      this.$router
        .push({
          path: "/user",
          query: {
            //query是个配置项
            id: this.user.user_id,
          },
        })
        .then((res) => {
          this.$bus.$emit("toContent2", this.index2);
        })
        .catch(() => {
          this.$bus.$emit("toContent2", this.index2);
        });
      // this.$bus.$emit("toContent2", this.index2);
    },
    toContent3() {
      this.$router
        .push({
          path: "/user",
          query: {
            //query是个配置项
            id: this.user.user_id,
          },
        })
        .then((res) => {
          this.$bus.$emit("toContent2", this.index3);
        })
        .catch(() => {
          this.$bus.$emit("toContent2", this.index3);
        });
      // this.$bus.$emit("toContent3", this.index3);
    },
    toContent4() {
      this.$router
        .push({
          path: "/user",
          query: {
            //query是个配置项
            id: this.user.user_id,
          },
        })
        .then((res) => {
          this.$bus.$emit("toContent2", this.index4);
        })
        .catch(() => {
          this.$bus.$emit("toContent2", this.index4);
        });
      // this.$bus.$emit("toContent4", this.index4);
    },
    toHome() {
      this.$router.push({
        path: "/home",
      });
    },
    toUser() {
      this.$router.push({
        path: "/user",
        query: {
          //query是个配置项
          id: this.user.user_id,
        },
      });
    },
  },
};
</script>

<style src="@/assets/style/common.css"  scoped></style>
<style src="@/assets/style/mobileCommon.css"  scoped></style>
<!-- <style scoped>
@import "@/assets/style/common.css";
</style> -->