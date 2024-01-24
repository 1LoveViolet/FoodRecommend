import axios from "network/axios";
//首页展示商家信息   参数category，name
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
