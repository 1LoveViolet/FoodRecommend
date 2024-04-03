<template>
  <div class="login-wrapper">
    <div class="login-main">
      <h3 class="login-title">注册</h3>
      <el-form :rules="rule" ref="FormData" :model="FormData">
        <el-form-item prop="phoneNumber">
          <el-input
            v-model="FormData.phoneNumber"
            type="text"
            placeholder="手机号"
          >
            <template slot="prepend">+86</template>
          </el-input>
        </el-form-item>
        <el-form-item prop="code">
          <el-input v-model="FormData.code" type="text" placeholder="验证码">
            <el-button
              slot="append"
              icon="el-icon-s-promotion"
              @click="sendMsg"
            ></el-button>
          </el-input>
        </el-form-item>
        <el-form-item prop="username">
          <el-input
            v-model="FormData.username"
            type="text"
            placeholder="用户名"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password" style="margin-top: 30px">
          <el-input
            v-model="FormData.password"
            type="password"
            placeholder="密码"
            show-password
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button class="login-btn" type="primary" round @click="register"
            >注册</el-button
          >
          <el-button class="register-btn" type="success" round @click="back"
            >返回</el-button
          >
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script >
import { STMPregister } from "api/user";
export default {
  data() {
    return {
      FormData: {
        phoneNumber: "",
        code: "",
        username: "",
        password: "",
      },
      rule: {
        phoneNumber: [
          { required: true, message: "手机号不能为空", trigger: "blur" },
          {
            pattern: /^1[0-9]{10}$/,
            message: "手机号格式不正确",
            trigger: "blur",
          },
        ],
        code: [{ required: true, message: "验证码不能为空", trigger: "blur" }],
        username: [
          { required: true, message: "用户名不能为空", trigger: "blur" },
          {
            pattern: /^[a-zA-Z0-9_-]{4,20}$/,
            message:
              "用户名长度必须在4到20个字符之间，且只能包含字母、数字、下划线和连字符",
            trigger: "blur",
          },
        ],
        password: [
          { required: true, message: "密码不能为空", trigger: "blur" },
          {
            min: 6,
            max: 20,
            message: "密码长度必须在6到20个字符之间",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    sendMsg() {
      const email = this.FormData.phoneNumber;
      STMPregister(email)
        .then((response) => {
          console.log("res", res);
          this.$message({
            message: "验证码已发送，注意查看",
            type: "success",
          });
        })
        .catch((error) => {
          // 登录失败的处理逻辑
          // 例如，显示错误信息给用户
          console.log("失败");
        });
    },
    register() {
      // 用户注册逻辑
      const username = this.FormData.username;
      const password = this.FormData.password;
      const email = this.FormData.phoneNumber;
      const code = this.FormData.code;
      // 发送登录请求
      this.axios
        .post("user/register", {
          email: email,
          username: username,
          password: password,
          code: code,
        })
        .then((response) => {
          this.$router.replace("/login");
        })
        .catch((error) => {
          // 登录失败的处理逻辑
          // 例如，显示错误信息给用户
          console.log("失败");
        });
    },
    back() {
      this.$router.replace("/login");
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
  height: 400px;
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
  width: 35%;
  height: 36px;
  margin-right: 85px;
  font-size: 16px;
}
.register-btn {
  width: 35%;
  height: 36px;
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
.error-message {
  font-size: 12px;
  line-height: 0px;
  margin: 0px;
}
</style>