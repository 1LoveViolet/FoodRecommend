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
      "Content-Type": "multipart/form-data",
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

//获取用户信息
export function searchUserById(user_id) {
  return axios({
    url: `/api/searchUserById/${user_id}`,
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  });
}

//通过review_id，删除对应评论
export function deleteReviewById(review_id) {
  return axios({
    url: `/api/deleteReviewById/${review_id}`,
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  });
}

//通过favorite_id，删除对应收藏
export function deleteFavoriteById(favorite_id) {
  return axios({
    url: `/api/deleteFavoriteById/${favorite_id}`,
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  });
}

//修改用户信息
export function updateUserInfo(data) {
  return axios({
    url: "/api/updateUserInfo",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
    data: data,
  });
}
