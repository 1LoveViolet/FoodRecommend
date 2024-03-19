var express = require("express");
var router = express.Router();
const connection = require("../dataBase/db"); // 获取连接实例
const md5 = require("md5");
const jwt = require("jsonwebtoken");
const uploadAvatar = require("../multer/upload");
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
    if (users != null && users != [] && users.length != 0) {
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
    } else {
      res.send({
        code: "404",
        msg: "用户或密码错误",
        data: null,
        token: null,
      });
    }
  });
});

//获取用户头像
router.get("/getAvatar/:user_id", (req, res) => {
  const user_id = req.params.user_id;
  let sql = `select avatar_url from users  where user_id= "${user_id}"`;
  connection.query(sql, (err, result) => {
    if (err) {
      res.status(500).send({
        code: "412",
        msg: "查找用户头像错误",
        data: null,
        err: err,
      });
    } else {
      res.send({
        code: "200",
        msg: "查找成功",
        data: {
          user_id: user_id,
          avatar_url: result[0].avatar_url,
          // jsonData: jsonData,
        },
      });
    }
  });
});
//上传头像
router.post("/uploadAvatar", async (req, res) => {
  try {
    const imageUrl = await uploadAvatar(req, res);
    const user_id = req.body.user_id;
    // const jsonData = req.body;
    var sql = `UPDATE users SET avatar_url="${imageUrl}" WHERE user_id="${user_id}"`;
    // var sql = `UPDATE users SET avatar_url=? WHERE user_id=?`;
    // let where_value = [req.body.user_id, await uploadAvatar(req, res)];
    connection.query(sql, function (err, result) {
      if (err) {
        res.status(500).send({
          code: "412",
          msg: "添加头像失败",
          data: null,
          err: err,
          req: req.body,
          avatar_url: imageUrl,
        });
      } else {
        res.send({
          code: "200",
          msg: "添加头像成功",
          data: {
            user_id: user_id,
            avatar_url: imageUrl,
            // jsonData: jsonData,
          },
        });
      }
    });
  } catch (error) {
    console.error("Error uploading image:", error);
    res.status(500).send({
      code: "500",
      msg: "添加头像失败",
      data: null,
      err: error,
    });
  }
});

//查询用户信息
router.get("/searchUserById/:user_id", (req, res) => {
  // 使用商家ID查询对应的菜品
  const user_id = req.params.user_id;
  const sql = `
  SELECT 
  'users' AS table_type,
  NULL AS favorite_id,
  NULL AS review_id,
  u.user_id,
  NULL AS restaurant_id,
  NULL AS fdate,
  NULL AS price,
  NULL AS RVrating,
  NULL AS comment,
  NULL AS date,
  u.username,
  u.email,
  u.avatar_url,
  u.sex,
  u.residence,
  u.signature,
  u.create_time,
  NULL AS name,
  NULL AS address,
  NULL AS Rrating,
  NULL AS area,
  NULL AS phone,
  NULL AS category,
  NULL AS cuisine
FROM 
  users u
WHERE 
  u.user_id = "${user_id}"
UNION

SELECT
  'favorites' AS table_type,
  f.favorite_id,
  NULL AS review_id,
  f.user_id,
  f.restaurant_id,
  f.fdate,
  NULL AS price,
  NULL AS RVrating,
  NULL AS comment,
  NULL AS date,
  NULL AS username,
  NULL AS email,
  NULL AS avatar_url,
  NULL AS sex,
  NULL AS residence,
  NULL AS signature,
  NULL AS create_time,
  r.name,
  r.address,
  r.rating,
  r.area,
  r.phone,r.category,r.cuisine
FROM
  favorites f
JOIN users u ON f.user_id = u.user_id
JOIN restaurants r ON r.restaurant_id=f.restaurant_id
WHERE
  f.user_id = "${user_id}"
UNION

SELECT
  'reviews' AS table_type,
  NULL AS favorite_id,
  rv.review_id,
  rv.user_id,
  rv.restaurant_id,
  NULL AS fdate,
  rv.price,
  rv.rating,
  rv.comment,
  rv.date,
  NULL AS username,
  NULL AS email,
  NULL AS avatar_url,
  NULL AS sex,
  NULL AS residence,
  NULL AS signature,
  NULL AS create_time,
  r.name,
  r.address,
  r.rating,
  r.area,
  r.phone,r.category,r.cuisine
FROM
  reviews rv
JOIN users u ON rv.user_id = u.user_id
JOIN restaurants r ON r.restaurant_id=rv.restaurant_id
WHERE
  rv.user_id = "${user_id}";
  `;
  connection.query(sql, (err, results) => {
    if (err) {
      res.status(500).json({
        code: "500",
        msg: "查询失败",
        data: null,
        err: err,
      });
    } else {
      res.json({
        code: "200",
        msg: "查询成功",
        data: results,
      });
    }
  });
});

//通过review_id，删除对应评论
router.delete("/deleteReviewById/:review_id", (req, res) => {
  // 使用商家ID查询对应的菜品
  const review_id = req.params.review_id;
  const sql = `
  DELETE FROM reviews
WHERE review_id = "${review_id}";
  `;
  connection.query(sql, (err, results) => {
    if (err) {
      res.status(500).json({
        code: "500",
        msg: "删除对应评论失败",
        data: null,
        err: err,
      });
    } else {
      res.json({
        code: "200",
        msg: "删除对应评论成功",
        data: results,
      });
    }
  });
});

//通过favorite_id，删除对应收藏
router.delete("/deleteFavoriteById/:favorite_id", (req, res) => {
  // 使用商家ID查询对应的菜品
  const favorite_id = req.params.favorite_id;
  const sql = `
  DELETE FROM favorites
WHERE favorite_id = "${favorite_id}";
  `;
  connection.query(sql, (err, results) => {
    if (err) {
      res.status(500).json({
        code: "500",
        msg: "删除对应收藏失败",
        data: null,
        err: err,
      });
    } else {
      res.json({
        code: "200",
        msg: "删除对应收藏成功",
        data: results,
      });
    }
  });
});

//通过user_id，修改用户信息
router.post("/updateUserInfo", (req, res) => {
  // 使用商家ID查询对应的菜品
  const user_id = req.body.user_id;
  const data = req.body.data;
  const sql = `
  UPDATE users
SET 
    username = "${data.username}",
    password = "${md5(data.password)}",
    email = "${data.email}",
    sex = "${data.sex}",
    residence = "${data.residence}",
    signature = "${data.signature}"
WHERE 
    user_id = "${user_id}";
  `;
  connection.query(sql, (err, results) => {
    if (err) {
      res.status(500).json({
        code: "500",
        msg: "修改失败",
        data: null,
        err: err,
      });
    } else {
      res.json({
        code: "200",
        msg: "修改成功",
        data: results,
      });
    }
  });
});

//添加收藏
router.post("/addFavorite", (req, res) => {
  let user_id = req.body.user_id;
  let restaurant_id = req.body.restaurant_id;
  let fdate = req.body.fdate;
  var sql = `insert into favorites set user_id="${user_id}" , restaurant_id="${restaurant_id}", fdate="${fdate}"`;
  // var add_value = [req.body.username, md5(req.body.password), req.body.email];
  connection.query(sql, function (err, result) {
    if (err) {
      res.send({
        code: "412",
        msg: "新增收藏失败",
        data: null,
        err: err,
      });
    } else {
      res.json({
        code: "200",
        msg: "添加收藏成功",
        data: result,
      });
      //   响应内容 增加数据成功
    }
  });
});
//查询是否收藏
router.get("/isFavorite/:user_id-:restaurant_id", (req, res) => {
  let user_id = req.params.user_id;
  let restaurant_id = req.params.restaurant_id;

  var sql = `select * from favorites  where user_id= "${user_id}" AND restaurant_id= "${restaurant_id}"`;
  // var add_value = [req.body.username, md5(req.body.password), req.body.email];
  connection.query(sql, function (err, result) {
    if (err) {
      res.send({
        code: "412",
        msg: "未收藏",
        data: null,
        err: err,
      });
    } else {
      res.json({
        code: "200",
        msg: "已收藏",
        data: result,
      }); //   响应内容 增加数据成功
    }
  });
});
//删除收藏
router.delete("/deleteFavorite/:user_id-:restaurant_id", (req, res) => {
  console.log(req.params);
  // 使用商家ID查询对应的菜品
  let user_id = req.params.user_id;
  let restaurant_id = req.params.restaurant_id;
  const sql = `DELETE FROM favorites WHERE user_id="${user_id}" AND restaurant_id="${restaurant_id}"`;
  connection.query(sql, (err, results) => {
    if (err) {
      res.json({
        code: "500",
        msg: "删除收藏失败",
        data: null,
        err: err,
      });
    } else {
      res.json({
        code: "200",
        msg: "删除收藏成功",
        data: results,
      });
    }
  });
});
module.exports = router;
