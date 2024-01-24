import axios from "network/axios";
//获取所有用户
export function getAllUsers() {
  return axios({
    url: "/api/alluser",
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
    // data: data,
  });
}
//登录
export function login(data) {
  return axios({
    url: "/api/login",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
    data: data,
  });
}
//上传用户头像
export function uploadAvatar(data) {
  return axios({
    url: "/api/uploadAvatar",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
    data: data,
  });
}
//获取用户头像
export function getAvatar(user_id) {
  return axios({
    url: `/api/getAvatar/${user_id}`,
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
