import axios from "./axios";
//地址管理
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

export function login() {
  return axios({
    url: "/api/alluser",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
    data: data,
  });
}

export function getAddress() {
  return axios({
    url: `/address/get/${id}`,
    method: "get",
  });
}
