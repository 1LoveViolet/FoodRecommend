var createError = require("http-errors");
var express = require("express");
const session = require("express-session");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const cors = require("cors");
const MySQLStore = require("express-mysql-session")(session);
const mysql = require("mysql");
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var goodsRouter = require("./routes/goods");

var app = express();

// 创建 MySQL 连接池
const dbConfig = {
  host: "localhost",
  port: 3306,
  user: "root",
  password: "ou1685299181",
  database: "foodrecommend",
  charset: "utf8mb4", // 确保数据库连接的字符集正确
};
const pool = mysql.createPool(dbConfig);

// 创建 MySQL 存储对象
const sessionStore = new MySQLStore(
  {
    clearExpired: true,
    checkExpirationInterval: 900000, // 检查过期会话的时间间隔，以毫秒为单位，例如每15分钟检查一次
    expiration: 86400000, // 会话的默认过期时间，以毫秒为单位，例如1天
    createDatabaseTable: true, // 是否创建会话表
    connectionLimit: 10, // 连接池大小，默认为1
    schema: {
      tableName: "sessions", // 会话表的名称，默认为sessions
      columnNames: {
        session_id: "session_id",
        expires: "expires",
        data: "data",
      },
    },
  },
  pool
);
// 使用 express-session 中间件，并设置会话存储为 MySQL
app.use(
  session({
    name: "testsessionid",
    secret: " ",
    cookie:
      ("name",
      "value",
      { path: "/", httpOnly: true, secure: false, maxAge: 60000 }), //重新保存：强制
    resave: false,
    //强制“未初始化”的会话保存到存储。
    saveUninitialized: false,
    store: sessionStore,
  })
);
// 使用cors中间件
app.use(
  cors({
    origin: "http://localhost:8080",
    credentials: true,
  })
  // res.setHeader("Access-Control-Allow-Origin", "http://localhost:8080")
  // res.setHeader("Access-Control-Allow-Origin", "123") // 默认设置
);
// app.use(function (req, res, next) {
//   res.header("Access-Control-Allow-Origin", res.headers.origin);
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept"
//   );
//   res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
//   res.header("Access-Control-Allow-Credentials", "true");
//   next();
// });
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(express.static("public"));
app.use(express.static(path.join(__dirname, "")));

app.use("/", indexRouter);
app.use("/api", usersRouter);
app.use("/api", goodsRouter);

// app.use("/user", api);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

// app.post("/api/email", async (req, res) => {
//   const email = req.body.email;
//   const code = String(Math.floor(Math.random() * 1000000)).padEnd(6, "0"); //生成6位随机验证码
//   //发送邮件
//   const mail = {
//     from: `"美食可视化推荐系统"<1130045210@qq.com>`, // 发件人
//     subject: "验证码", //邮箱主题
//     to: email, //收件人，这里由post请求传递过来
//     // 邮件内容，用html格式编写
//     html: `
//           <p>您好！</p>
//           <p>您的验证码是：<strong style="color:orangered;">${code}</strong></p>
//           <p>如果不是您本人操作，请无视此邮件</p>
//       `,
//   };
//   await nodeMail.sendMail(mail, (err, info) => {
//     if (!err) {
//       res.json({ msg: "验证码发送成功" });
//     } else {
//       res.json({ msg: "验证码发送失败，请稍后重试" });
//     }
//   });
// });

module.exports = app;
