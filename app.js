const express = require('express');
const bodyParser = require('body-parser');
const createError = require('http-error');
const index = require("./routers/index.js");
const base = require("./data/Db.js");
var app = express();
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true,}));
app.use('/', index);

//апишники APIs
//get users
app.get("/api/users",  function(req, res){base.users(req,res)});//Работает хорошо
app.get("/api/users/:id",  function(req, res){base.userById(req,res)});// 
app.get("/api/users/delete/:id",  function(req, res){base.delUser(req,res)});
//post users
app.post("/api/users/login",  function(req, res){base.logIn(req,res)});
app.post("/api/users/create",function(req,res){base.addUser(req,res)});
app.post("/api/users/update",function(req,res){base.updateUser(req,res)});


//get news
app.get("/api/news",function(req,res){base.news(req,res)});
app.get("/api/news/delete/:id",function(req,res){base.delNews(req,res)});
//post news
app.post("/api/news/add",function(req,res){base.addNews(req,res)});
app.post("/api/news/update",function(req,res){base.updateNews(req,res)});
app.post("/api/news/query",function(req,res){base.query(req,res)});
app.get("/api/language/setInDb",function(req,res){base.setLanguage(req,res)});
//app.post("/api/language/");

app.get("/api/test",function(req,res){
    res.status(200).json({ok:"ok"})
})

module.exports = app;
console.log("Основной пакет App подключен");