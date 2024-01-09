const jwt = require("jsonwebtoken");
//声明中间件
let checkTokenMiddleware = (req, res, next) => {
  //获取token
  let token = req.get("token");
  console.log(token);
  //判断
  if (!token) {
    return res.json({
      code: "2003",
      msg: "token缺失",
      data: null,
    });
  }
  //检验token
  jwt.verify(token, "token", (err, data) => {
    if (err) {
      res.json({
        code: "2003",
        msg: "token 校验失败",
        data: null,
      });
      return;
    }
    //如果校验成功
    next();
  });
};
module.exports = checkTokenMiddleware;
