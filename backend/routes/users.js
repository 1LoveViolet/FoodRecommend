var express = require("express");
var router = express.Router();
const connection = require("../dataBase/db"); // 获取连接实例
const md5 = require("md5");
const jwt = require("jsonwebtoken");
const uploadAvatar = require("../multer/upload");
const nodeMail = require("../SMTP/nodemailer");
const session = require("express-session");
const MySQLStore = require("express-mysql-session")(session);
const mysql = require("mysql");
const cors = require("cors");
const checkTokenMiddleware = require("../middlewares/checkTokenMiddleware");

// router.use(
//   cors()
//   // res.setHeader("Access-Control-Allow-Origin", "123") // 默认设置
// );
// router.use(function (req, res, next) {
//   res.header("Access-Control-Allow-Origin", "http://127.0.0.1:8080");
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept"
//   );
//   res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
//   res.header("Access-Control-Allow-Credentials", "true");
//   next();
// });

// // 创建 MySQL 连接池
// const dbConfig = {
//   host: "localhost",
//   port: 3306,
//   user: "root",
//   password: "ou1685299181",
//   database: "foodrecommend",
//   charset: "utf8mb4", // 确保数据库连接的字符集正确
// };
// const pool = mysql.createPool(dbConfig);

// // 创建 MySQL 存储对象
// const sessionStore = new MySQLStore(
//   {
//     clearExpired: true,
//     checkExpirationInterval: 900000, // 检查过期会话的时间间隔，以毫秒为单位，例如每15分钟检查一次
//     expiration: 86400000, // 会话的默认过期时间，以毫秒为单位，例如1天
//     createDatabaseTable: true, // 是否创建会话表
//     connectionLimit: 10, // 连接池大小，默认为1
//     schema: {
//       tableName: "sessions", // 会话表的名称，默认为sessions
//       columnNames: {
//         session_id: "session_id",
//         expires: "expires",
//         data: "data",
//       },
//     },
//   },
//   pool
// );

// // 使用 express-session 中间件，并设置会话存储为 MySQL
// router.use(
//   session({
//     secret: " ", // 加密 session 的密钥，可以是任何字符串
//     resave: true,
//     saveUninitialized: false,
//     store: sessionStore,
//     cookie: {
//       maxAge: 1000 * 60 * 5,
//       Secure: false,
//     },
//   })
// );

//注册页面
router.get("/reg", (req, res) => {
  res.render("reg");
});
// 注册
router.post("/reg", (req, res) => {
  console.log("Session ID:", req.sessionID);
  let code = req.body.code;
  console.log("req.session", req.session);
  // 从会话中获取验证码
  let storedCode = req.session.verificationCode;
  // 检查验证码是否正确
  if (code !== storedCode) {
    return res.status(400).send("验证码错误");
  }
  let username = req.body.username;
  let password = md5(req.body.password);
  let email = req.body.email;
  var sql = `insert into users set username="${username}" , password="${password}", email="${email}"`;
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

// 发送邮箱注册验证码
router.post("/email", async (req, res) => {
  console.log("Session ID:", req.sessionID);
  const email = req.body.email;
  const code = String(Math.floor(Math.random() * 1000000)).padEnd(6, "0"); // 生成6位随机验证码
  // 将验证码存储到会话中
  req.session.verificationCode = code;
  // res.setHeader();
  console.log("req.session", req.session);
  // 发送邮件
  const mail = {
    from: `"美食可视化推荐系统"<1130045210@qq.com>`, // 发件人
    subject: "验证码", // 邮箱主题
    to: email, // 收件人，这里由 post 请求传递过来
    // 邮件内容，用 html 格式编写
    html: `
          <p>您好！</p>
          <p>您的验证码是：<strong style="color:orangered;">${code}</strong></p>
          <p>如果不是您本人操作，请无视此邮件</p>
      `,
  };
  await nodeMail.sendMail(mail, (err, info) => {
    if (!err) {
      res.json({ msg: "验证码发送成功" });
    } else {
      res.json({ msg: "验证码发送失败，请稍后重试" });
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
router.get("/getAvatar/:user_id", checkTokenMiddleware, (req, res) => {
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
router.post("/uploadAvatar", checkTokenMiddleware, async (req, res) => {
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
router.get("/searchUserById/:user_id", checkTokenMiddleware, (req, res) => {
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
router.delete(
  "/deleteReviewById/:review_id",
  checkTokenMiddleware,
  (req, res) => {
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
  }
);

//通过favorite_id，删除对应收藏
router.delete(
  "/deleteFavoriteById/:favorite_id",
  checkTokenMiddleware,
  (req, res) => {
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
  }
);

//通过user_id，修改用户信息
router.post("/updateUserInfo", checkTokenMiddleware, (req, res) => {
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
router.post("/addFavorite", checkTokenMiddleware, (req, res) => {
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
router.get(
  "/isFavorite/:user_id-:restaurant_id",
  checkTokenMiddleware,
  (req, res) => {
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
  }
);
//删除收藏
router.delete(
  "/deleteFavorite/:user_id-:restaurant_id",
  checkTokenMiddleware,
  (req, res) => {
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
  }
);

//查询是否关注
router.get(
  "/isguanzhu/:user_id-:fan_user_id",
  checkTokenMiddleware,
  (req, res) => {
    let user_id = req.params.user_id;
    let fan_user_id = req.params.fan_user_id;
    var sql = `select * from fans  where user_id= "${user_id}" AND fan_user_id= "${fan_user_id}"`;
    // var add_value = [req.body.username, md5(req.body.password), req.body.email];
    connection.query(sql, function (err, result) {
      if (err) {
        res.send({
          code: "412",
          msg: "未关注",
          data: null,
          err: err,
        });
      } else {
        res.json({
          code: "200",
          msg: "已关注",
          data: result,
        }); //   响应内容 增加数据成功
      }
    });
  }
);
//查询关注用户数量
// router.get("/guanzhuNum/:fan_user_id", (req, res) => {
//   let fan_user_id = req.params.fan_user_id;
//   var sql = `select * from fans  where fan_user_id= "${fan_user_id}"`;
//   // var add_value = [req.body.username, md5(req.body.password), req.body.email];
//   connection.query(sql, function (err, result) {
//     if (err) {
//       res.send({
//         code: "412",
//         msg: "查询错误",
//         data: null,
//         err: err,
//       });
//     } else {
//       res.json({
//         code: "200",
//         msg: "关注数量",
//         data: result,
//       }); //   响应内容 增加数据成功
//     }
//   });
// });

//查询关注用户数量
router.get("/guanzhuNum/:fan_user_id", checkTokenMiddleware, (req, res) => {
  let fan_user_id = req.params.fan_user_id;
  var sql = ` SELECT u.user_id, u.username, u.avatar_url FROM fans JOIN users u ON fans.user_id = u.user_id WHERE fans.fan_user_id = ${fan_user_id};
  `;
  // var add_value = [req.body.username, md5(req.body.password), req.body.email];
  connection.query(sql, function (err, result) {
    if (err) {
      res.send({
        code: "412",
        msg: "查询错误",
        data: null,
        err: err,
      });
    } else {
      res.json({
        code: "200",
        msg: "关注数量",
        data: result,
      }); //   响应内容 增加数据成功
    }
  });
});
//查询粉丝数量
router.get("/fansNum/:user_id", checkTokenMiddleware, (req, res) => {
  let user_id = req.params.user_id;
  var sql = `SELECT u.user_id, u.username, u.avatar_url FROM fans JOIN users u ON fans.fan_user_id = u.user_id WHERE fans.user_id = ${user_id};`;
  // var add_value = [req.body.username, md5(req.body.password), req.body.email];
  connection.query(sql, function (err, result) {
    if (err) {
      res.send({
        code: "412",
        msg: "查询错误",
        data: null,
        err: err,
      });
    } else {
      res.json({
        code: "200",
        msg: "粉丝数量",
        data: result,
      }); //   响应内容 增加数据成功
    }
  });
});
//关注其他用户
router.post("/guanzhu", checkTokenMiddleware, (req, res) => {
  let user_id = req.body.user_id;
  let fan_user_id = req.body.fan_user_id;
  var sql = `insert into fans set user_id="${user_id}" , fan_user_id="${fan_user_id}"`;
  // var add_value = [req.body.username, md5(req.body.password), req.body.email];
  connection.query(sql, function (err, result) {
    if (err) {
      res.send({
        code: "412",
        msg: "关注用户失败",
        data: null,
        err: err,
      });
    } else {
      res.json({
        code: "200",
        msg: "关注用户成功",
        data: result,
      });
      //   响应内容 增加数据成功
    }
  });
});

//取消关注
router.delete(
  "/deleteGuanzhu/:user_id-:fan_user_id",
  checkTokenMiddleware,
  (req, res) => {
    console.log(req.params);
    // 使用商家ID查询对应的菜品
    let user_id = req.params.user_id;
    let fan_user_id = req.params.fan_user_id;
    const sql = `DELETE FROM fans WHERE user_id="${user_id}" AND fan_user_id="${fan_user_id}"`;
    connection.query(sql, (err, results) => {
      if (err) {
        res.json({
          code: "500",
          msg: "取消关注失败",
          data: null,
          err: err,
        });
      } else {
        res.json({
          code: "200",
          msg: "取消关注成功",
          data: results,
        });
      }
    });
  }
);
module.exports = router;
