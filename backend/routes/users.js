var express = require("express");
var router = express.Router();
const connection = require("../dataBase/db"); // 获取连接实例
const md5 = require("md5");
const jwt = require("jsonwebtoken");
//注册页面
router.get("/reg", (req, res) => {
  res.render("reg");
});
//注册
router.post("/reg", (req, res) => {
  let username = req.body.username;
  let password = md5(req.body.password);
  let email = req.body.email;
  var sql = `insert into users set username="${username}" , password="${password}", email="${email}"`;
  // var add_value = [req.body.username, md5(req.body.password), req.body.email];
  connection.query(sql, function (err, result) {
    if (err) {
      res.status(500).send({
        code: "412",
        msg: "新增用户失败",
        data: null,
        err: err,
      });
    } else {
      res.send("增加数据成功"); //   响应内容 增加数据成功
    }
  });
});

// router.get("/alluser", function (req, res, next) {
//   connection.query("select * from users", (err, users) => {
//     if (err) {
//       res.send("query error");
//     } else {
//       // 将 MySQL 查询结果作为路由返回值
//       res.send(users);
//     }
//   });
// });

//登录页面
router.get("/login", (req, res) => {
  res.render("login");
});
//登录
router.post("/login", (req, res) => {
  let sql = "select * from users  where username= ? and password=?";
  let where_value = [req.body.username, md5(req.body.password)];
  connection.query(sql, where_value, (err, users) => {
    if (err) {
      res.status(500).send({
        code: "412",
        msg: "账户或密码错误",
        data: null,
        err: err,
      });
    }
    if (users != null) {
      let token = jwt.sign(
        {
          username: users.username,
          user_id: users.user_id,
        },
        "token",
        {
          expiresIn: 60 * 60 * 24 * 7,
        }
      );
      // 将 MySQL 查询结果作为路由返回值
      res.send({
        code: "200",
        msg: "登录成功",
        data: users,
        token: token,
      });
    }
  });
});

module.exports = router;
