// import nodemailer from "nodemailer";
const nodemailer = require("nodemailer");
let nodeMail = nodemailer.createTransport({
  service: "qq", //类型qq邮箱
  port: 465, //上文获取的port
  secure: true, //上文获取的secure
  auth: {
    user: "1130045210@qq.com", // 发送方的邮箱，可以选择你自己的qq邮箱
    pass: "qdddnktcnmacgfha", // 上文获取的stmp授权码
  },
});

module.exports = nodeMail;
