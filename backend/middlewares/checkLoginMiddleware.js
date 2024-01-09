//声明中间件检测登录
let checkLoginMiddleware = (req, res, next) => {
  if (!req.session.username) {
    return res.redirect("/login");
  }
  next();
};
module.exports = checkLoginMiddleware;
