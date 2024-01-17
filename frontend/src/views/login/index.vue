<template>
  <div class="login-wrapper">
    <div class="login-main">
      <h3 class="login-title">登录</h3>
      <el-form ref="userForm">
        <el-form-item>
          <el-input
            v-model="username"
            type="text"
            placeholder="用户名"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-input
            v-model="password"
            type="password"
            placeholder="密码"
            show-password
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-link
            class="sms"
            type="info"
            :underline="false"
            @click="toSMSRegister"
            >短信注册</el-link
          >
        </el-form-item>
        <el-form-item>
          <el-button class="login-btn" type="primary" round @click="login"
            >登录</el-button
          >
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { login } from "api/index";
export default {
  data() {
    return {
      username: [],
      password: [],
      token: null,
      user: {},
    };
  },
  mounted() {
    // console.log('userId: ' + this.$store.state.user.userId)
    // console.log('userId: ' + this.$store.state.user.userName)
  },
  methods: {
    login() {
      let data = { username: this.username, password: this.password };
      login(data) //封装好的login()方法
        .then((response) => {
          console.log(response);

          if (response.code == "200") {
            (this.user = response.data), (this.token = response.token);
            this.$store.dispatch("setUser", this.user);
            this.$store.dispatch("setToken", this.token);
            console.log("user", this.$store.state.user);
            console.log("token", this.$store.state.token);
            this.$store.dispatch("changeisLogin");
            this.$router.push("/home");
          }
        })
        .catch(function (error) {
          console.log(error);
        });
      // this.axios.get("api/alluser").then((response) => {
      //   console.log(response);
      // });
      // axios({
      //   url: "api/alluser",
      //   method: "get",
      // }).then((response) => {
      //   console.log(response);
      // });
    },
    // login() {
    //   // 用户登录逻辑
    //   const username = this.username;
    //   const password = this.password;
    //   // 发送登录请求
    //   this.axios.post('user/login', {
    //     username: username,
    //     password: password
    //   })
    //     .then((response) => {
    //       // 登录成功的处理逻辑
    //       // 例如，保存登录状态、跳转到其他页面等
    //       // 成功登录后将用户ID存储到Vuex
    //       const userId = response.data.data.id
    //       const userName = response.data.data.username
    //       // console.log(userId)
    //       // console.log(userName)
    //       this.$store.dispatch('setUserId', userId);
    //       this.$store.dispatch('setUserName', userName);
    //       // console.log('userId: ' + this.$store.state.user.userId)
    //       // console.log('userId: ' + this.$store.state.user.userName)
    //       this.$router.push('/home')
    //     })
    //     .catch((error) => {
    //       // 登录失败的处理逻辑
    //       // 例如，显示错误信息给用户
    //     });
    // },
    toSMSRegister() {
      this.$router.replace("/register");
    },
  },
};
</script>

<style scoped>
.login-wrapper {
  height: 100%;
  background: #f7f7f7;
}
#canvas {
  width: 100%;
}
.login-main {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 320px;
  height: 370px;
  padding: 20px 35px;
  border: 1px solid #eee;
  margin: -185px 0 0 -160px;
}
.login-main::before {
  position: absolute;
  height: 12px;
  content: "";
}
.login-main::after {
  position: absolute;
  height: 12px;
  content: "";
}
.login-main::before {
  left: 4px;
  right: 4px;
  top: -12px;
  z-index: 2;
  background-color: #f5f5f5;
}
.login-main::after {
  left: 10px;
  right: 10px;
  top: -22px;
  z-index: 1;
  background-color: #f0f0f0;
}
.login-title {
  padding-bottom: 15px;
  border-bottom: 2px solid #459f75;
  margin: 15px 0 45px 0;
  color: #555;
  text-align: center;
  font-size: 30px;
}
.login-btn {
  width: 100%;
  height: 36px;
  margin-top: 30px;
  margin-right: 85px;
  font-size: 16px;
}

.login-tip {
  color: #999;
  font-size: 12px;
  line-height: 30px;
}
.login-anim {
  position: absolute;
  bottom: 0;
  left: 0;
  z-index: -1;
}
.sms {
  display: flex;
  align-items: right;
  justify-content: right;
  font-size: 12px;
  line-height: 0;
}
</style>