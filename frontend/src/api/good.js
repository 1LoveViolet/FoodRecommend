import axios from "network/axios";

//全查商家
export function searchAllRestaurants() {
  return axios({
    url: `/api/searchAllRestaurants`,
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  });
}

//首页展示商家信息  搜索框或主分类 参数category，name
export function searchRestaurants(data) {
  return axios({
    url: "/api/searchRestaurants",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
    data: data,
  });
}
//首页展示商家信息  主分类
export function searchRestaurantsByCategory(category) {
  return axios({
    url: `/api/searchRestaurantsByCategory/${category}`,
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
//首页展示商家信息  副分类
export function searchRestaurantsByCuisine(cuisine) {
  return axios({
    url: `/api/searchRestaurantsByCuisine/${cuisine}`,
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  });
}

//通过商家id查询对应的菜品信息  参数restaurantId
export function searchRestaurantDishes(data) {
  return axios({
    url: "/api/searchRestaurantDishes",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
    data: data,
  });
}
//查询商家评论  参数restaurantId
export function searchRestaurantReviews(data) {
  return axios({
    url: "/api/searchRestaurantReviews",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
    data: data,
  });
}
//查询商家的种类
export function searchRestaurantCategory() {
  return axios({
    url: "/api/searchRestaurantCategory",
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
//查询种类的副种类
export function searchRestaurantCuisine(category) {
  return axios({
    url: `/api/searchRestaurantCuisine/${category}`,
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  });
}

//根据商品Id查询  商品信息，用户评论  商家菜品
export function searchRestaurantInfoById(id) {
  return axios({
    url: `/api/searchRestaurantInfoById/${id}`,
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  });
}

//添加评论
export function addReview(data) {
  return axios({
    url: `/api/addReview`,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
    data: data,
  });
}
