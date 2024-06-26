var express = require("express");
var router = express.Router();
const connection = require("../dataBase/db"); // 获取连接实例
const md5 = require("md5");
const jwt = require("jsonwebtoken");
const checkTokenMiddleware = require("../middlewares/checkTokenMiddleware");
// 假设已有数据库连接池 connection，如果没有，需要先配置数据库连接

//全查商家
//根据主分类查询商家
router.get("/searchAllRestaurants", (req, res) => {
  const sql = `SELECT * FROM restaurants`;
  connection.query(sql, (err, results) => {
    if (err) {
      res.status(500).json({
        code: "500",
        msg: "查询失败",
        data: null,
        err: err,
      });
    } else {
      res.json({
        code: "200",
        msg: "查询成功",
        data: results,
      });
    }
  });
});
//首页展示商家信息 搜索框或主分类
router.post("/searchRestaurants", (req, res) => {
  // const category = req.body.category;
  // const dishName = req.body.name;
  const input = req.body.input;
  // 使用占位符防止 SQL 注入
  // const sql = `SELECT DISTINCT r.* FROM restaurants r INNER JOIN dishes d ON r.restaurant_id = d.restaurant_id WHERE ("${category}" IS NULL OR d.category LIKE "%${category}%") OR ("${dishName}" IS NULL OR d.name LIKE "%${dishName}%")`;
  const sql = `SELECT DISTINCT *
  FROM (
      SELECT r.*
      FROM restaurants r
      WHERE r.name LIKE "%${input}%"
         OR r.cuisine LIKE "%${input}%"
         OR r.category LIKE "%${input}%"
      UNION
      SELECT r.*
      FROM restaurants r
      INNER JOIN dishes d ON r.restaurant_id = d.restaurant_id
      WHERE d.name LIKE "%${input}%"
         OR d.category LIKE "%${input}%"
  ) AS combined_results;
  
  `;
  let where_value = [req.body.category, req.body.name];
  connection.query(sql, where_value, (err, results) => {
    if (err) {
      res.status(500).json({
        code: "500",
        msg: "查询失败",
        data: null,
        err: err,
      });
    } else {
      res.json({
        code: "200",
        msg: "查询成功",
        data: results,
      });
    }
  });
});
//根据主分类查询商家
router.get("/searchRestaurantsByCategory/:category", (req, res) => {
  const category = req.params.category;
  const sql = `SELECT * FROM restaurants WHERE category="${category}"`;
  connection.query(sql, (err, results) => {
    if (err) {
      res.status(500).json({
        code: "500",
        msg: "查询失败",
        data: null,
        err: err,
      });
    } else {
      res.json({
        code: "200",
        msg: "查询成功",
        data: results,
      });
    }
  });
});
//根据副分类查询商家
router.get("/searchRestaurantsByCuisine/:cuisine", (req, res) => {
  const cuisine = req.params.cuisine;
  const sql = `SELECT * FROM restaurants WHERE cuisine="${cuisine}"`;
  connection.query(sql, (err, results) => {
    if (err) {
      res.status(500).json({
        code: "500",
        msg: "查询失败",
        data: null,
        err: err,
      });
    } else {
      res.json({
        code: "200",
        msg: "查询成功",
        data: results,
      });
    }
  });
});
//通过商家id查询对应的菜品信息
router.post("/searchRestaurantDishes", (req, res) => {
  const restaurantId = req.body.restaurantId;

  // 使用商家ID查询对应的菜品
  const sql = `
    SELECT * 
    FROM dishes 
    WHERE restaurant_id = ?;
  `;
  let where_value = [req.body.restaurantId];
  connection.query(sql, where_value, (err, results) => {
    if (err) {
      res.status(500).json({
        code: "500",
        msg: "查询失败",
        data: null,
        err: err,
      });
    } else {
      res.json({
        code: "200",
        msg: "查询成功",
        data: results,
      });
    }
  });
});
//查询商家评论
router.post("/searchRestaurantReviews", (req, res) => {
  const restaurantId = req.body.restaurantId;

  // 使用商家ID查询对应的菜品
  const sql = `
    SELECT * 
    FROM reviews
    WHERE restaurant_id = ?;
  `;
  let where_value = [req.body.restaurantId];
  connection.query(sql, where_value, (err, results) => {
    if (err) {
      res.status(500).json({
        code: "500",
        msg: "查询失败",
        data: null,
        err: err,
      });
    } else {
      res.json({
        code: "200",
        msg: "查询成功",
        data: results,
      });
    }
  });
});
//查询商家表的菜品种
router.get("/searchRestaurantCategory", (req, res) => {
  // 使用商家ID查询对应的菜品
  const sql = `
    SELECT category
    FROM restaurants;
  `;
  connection.query(sql, (err, results) => {
    if (err) {
      res.status(500).json({
        code: "500",
        msg: "查询失败",
        data: null,
        err: err,
      });
    } else {
      res.json({
        code: "200",
        msg: "查询成功",
        data: results,
      });
    }
  });
});
//查询商家表的菜品种的副种类
router.get("/searchRestaurantCuisine/:category", (req, res) => {
  // 使用商家ID查询对应的菜品
  const category = req.params.category;
  const sql = `
    SELECT cuisine
    FROM restaurants where category="${category}";
  `;
  connection.query(sql, (err, results) => {
    if (err) {
      res.status(500).json({
        code: "500",
        msg: "查询失败",
        data: null,
        err: err,
      });
    } else {
      res.json({
        code: "200",
        msg: "查询成功",
        data: results,
      });
    }
  });
});
//根据商家Id查询  商家信息，用户评论  商家菜品SELECT
router.get("/searchRestaurantInfoById/:id", (req, res) => {
  // 使用商家ID查询对应的菜品
  const id = req.params.id;
  const charset = "utf8mb4"; // 设置字符集为utf8mb4
  const sql = `
  SELECT 
        'dishes' AS table_type,
        d.restaurant_id,
        d.dish_id,
        NULL AS review_id,
        NULL AS user_id,
        d.name,
        d.category,
        d.description,
        NULL AS cuisine,
        NULL AS address,
        NULL AS rating,
        d.price,
        NULL AS price_range,
        d.image_url,
        NULL AS area,
        NULL AS phone,
        NULL AS bankhour,
        NULL AS story,
        NULL AS date,
        NULL AS user_name,
        NULL AS user_avatar
    FROM 
        dishes d
    WHERE 
        d.restaurant_id = "${id}"
    
    UNION
    
    SELECT 
        'restaurants' AS table_type,
        r.restaurant_id,
        NULL AS dish_id,
        NULL AS review_id,
        NULL AS user_id,
        r.name,
        r.category,
        r.description,
        r.cuisine,
        r.address,
        r.rating,
        NULL AS price,
        r.price_range,
        r.image_url,
        r.area,
        r.phone,
        r.bankhour,
        r.story,
        NULL AS date,
        NULL AS user_name,
        NULL AS user_avatar
    FROM 
        restaurants r
    WHERE 
        r.restaurant_id = "${id}"

    UNION

    SELECT
        'reviews' AS table_type,
        rv.restaurant_id,
        NULL AS dish_id,
        rv.review_id,
        rv.user_id,
        NULL AS name,
        NULL AS category,
        rv.comment AS description,
        NULL AS cuisine,
        NULL AS address,
        rv.rating,
        NULL AS price,
        NULL AS price_range,
        NULL AS image_url,
        NULL AS area,
        NULL AS phone,
        NULL AS bankhour,
        NULL AS story,
        rv.date,
        u.username AS user_name,
        u.avatar_url AS user_avatar
    FROM
        reviews rv
    JOIN users u ON rv.user_id = u.user_id
    WHERE
        rv.restaurant_id = "${id}"; `;
  connection.query(sql, (err, results) => {
    if (err) {
      res.status(500).json({
        code: "500",
        msg: "查询失败",
        data: null,
        err: err,
      });
    } else {
      res.header("Content-Type", `application/json; charset=${charset}`); // 设置响应头中的字符集
      res.json({
        code: "200",
        msg: "查询成功",
        data: results,
      });
    }
  });
});
//添加评论
router.post("/addReview", checkTokenMiddleware, (req, res) => {
  const restaurant_id = req.body.restaurant_id;
  const user_id = req.body.user_id;
  const rating = req.body.rating;
  const comment = req.body.comment;
  const date = req.body.date;
  // 使用商家ID查询对应的菜品
  const sql = `
  insert into reviews set user_id="${user_id}" , restaurant_id="${restaurant_id}", rating="${rating}", comment="${comment}", date="${date}"
  `;
  connection.query(sql, (err, results) => {
    if (err) {
      res.status(500).json({
        code: "500",
        msg: "添加评论失败",
        data: null,
        err: err,
      });
    } else {
      res.json({
        code: "200",
        msg: "添加评论成功",
        data: results,
      });
    }
  });
});
module.exports = router;
