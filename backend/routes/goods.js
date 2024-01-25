var express = require("express");
var router = express.Router();
const connection = require("../dataBase/db"); // 获取连接实例
const md5 = require("md5");
const jwt = require("jsonwebtoken");

// 假设已有数据库连接池 connection，如果没有，需要先配置数据库连接

//首页展示商家信息
router.post("/searchRestaurants", (req, res) => {
  const category = req.body.category;
  const dishName = req.body.name;
  // 使用占位符防止 SQL 注入
  const sql = `SELECT DISTINCT r.* FROM restaurants r INNER JOIN dishes d ON r.restaurant_id = d.restaurant_id WHERE ("${category}" IS NULL OR d.category LIKE "%${category}%") OR ("${dishName}" IS NULL OR d.name LIKE "%${dishName}%")`;
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
router.post("/searchRestaurantCuisine", (req, res) => {
  // 使用商家ID查询对应的菜品
  const category = req.body.category;
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

module.exports = router;
