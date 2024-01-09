var express = require("express");
var router = express.Router();
const connection = require("../dataBase/db"); // 获取连接实例
const md5 = require("md5");
//注册页面
router.get("/reg", (req, res) => {
  res.render("reg");
});
//注册
router.post("/reg", (req, res) => {
  UserModel.create({ ...req.body, password: md5(req.body.password) }).then(
    (data) => {
      if (!data) {
        res.status(500).send("注册失败");
        return;
      }
      res.render("success", { msg: "注册成功哦", url: "/login" });
    }
  );

  connection.query("select * from users", (err, users) => {
    if (err) {
      res.status(500).send("注册失败");
      return;
    } else {
      // 将 MySQL 查询结果作为路由返回值
      res.render("success", { msg: "注册成功哦", url: "/login" });
    }
  });
});

router.get("/alluser", function (req, res, next) {
  connection.query("select * from users", (err, users) => {
    if (err) {
      res.send("query error");
    } else {
      // 将 MySQL 查询结果作为路由返回值
      res.send(users);
    }
  });
});

//登录页面
router.get("/login", (req, res) => {
  res.render("login");
});
//登录
router.post("/login", (req, res) => {
  let username = req.body.username;
  let password = md5(req.body.password);
  UserModel.findOne({ $and: [{ username: username }, { password: password }] })
    .then((data) => {
      if (!data) {
        res.status(500).send("密码错误");
        return;
      }
      //写入session
      req.session.username = data.username;
      req.session._id = data._id;
      res.render("success", { msg: "登录成功哦", url: "/account" });
    })
    .catch((err) => {
      if (err) {
        res.status(500).send("登录失败，请稍后再试");
        return;
      }
    });
});

module.exports = router;
