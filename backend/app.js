var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const cors = require("cors");
const nodeMail = require("./SMTP/nodemailer");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var goodsRouter = require("./routes/goods");
var app = express();
// 使用cors中间件
app.use(
  cors()
  // res.setHeader("Access-Control-Allow-Origin", "123") // 默认设置
);
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

app.post("/api/email", async (req, res) => {
  const email = req.body.email;
  const code = String(Math.floor(Math.random() * 1000000)).padEnd(6, "0"); //生成6位随机验证码
  //发送邮件
  const mail = {
    from: `"美食可视化推荐系统"<1130045210@qq.com>`, // 发件人
    subject: "验证码", //邮箱主题
    to: email, //收件人，这里由post请求传递过来
    // 邮件内容，用html格式编写
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

module.exports = app;
