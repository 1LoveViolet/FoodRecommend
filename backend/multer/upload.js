// 引入配置好的 multerConfig
const multerConfig = require("./config");

// 上传到服务器地址
const BaseURL = "http://127.0.0.1:3000";
// 上传到服务器的目录
const imgPath = "/public/images/";

// 封装上传图片的接口
function uploadAvatar(req, res) {
  return new Promise((resolve, reject) => {
    multerConfig.single("file")(req, res, function (err) {
      if (err) {
        // 传递的图片格式错误或者超出文件限制大小，就会reject出去
        reject(err);
      } else {
        // 拼接成完整的服务器静态资源图片路径
        resolve(BaseURL + imgPath + req.file.filename);
      }
    });
  }).catch(() => {});
}

module.exports = uploadAvatar;
