//查询数据库方法
const express = require("express");

const connection = require("./db"); // 获取连接实例
const { port } = require("./config"); // 获取启动参数

const app = express();

app.get("/", (req, res, next) => {
  /* 使用 connection.query 来执行 sql 语句 */
  // 第一个参数为 sql 语句，可以透过 js 自由组合
  // 第二个参数为回调函数，err 表示查询异常、第二个参数则为查询结果（这里的查询结果为多个用户行）
  connection.query("select * from users", (err, users) => {
    if (err) {
      res.send("query error");
    } else {
      // 将 MySQL 查询结果作为路由返回值
      res.send(users);
    }
  });
});

app.listen(port, () => {
  console.log(`express server listen at http://localhost:${port}`);
});
