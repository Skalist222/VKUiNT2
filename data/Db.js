var lang = require('../language/engine.js').lang;// библиотека языковой подстановки
var format = require('pg-format');
const cryptor = require('./criptor.js');
//const argon = require('argon2');
const crypto = require('crypto');// библиотека шифрования ключей
const { isStringObject } = require('util/types');
const Pool = require('pg').Pool
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'firstbase',
  password: 'vV80665646662',
  port: 5432,
})

//users
const getAllUsers = (req, res) => {
  console.log("!!!ЗАпрос на получение всех юзеров!!!");
  pool.query('SELECT * FROM users ORDER BY id ASC', (error, results) => {
    if (error)  errorM(lang.usersNull,res);
    else ObjectM(results.rows,res);
  })
}
const userById = (req, res) => {
  var idstr = req.params.id;
    var id = parseInt(idstr);
    console.log(idstr);
    
    if (isNaN(id)) errorM(lang.formatEror, res);
    else {
      console.log("!!!Запрос на получение пользователя с id=" + id + "!!!");
      var qStr = "Select * from users where id=" + id + "";
      pool.query(qStr, (error, results) => {
        if (error) { return; }
        var user = results.rows[0];
        if (user === undefined) {
          errorM(lang.userNotFound, res);
        }
        else {
          ObjectM(user, res);
        }
      })
    }
}

const createNewUser =(req,res)=>
{
  console.log("!!!Запрос на создание нового пользователя!!!");
  var body = req.body;
  if(!validUser(body)){errorM(lang.notAllUserData,res)}
  // Выставляем приоритет(без привилегий) для пользователя
  
  else
  {
    var priority = 1;
    if(body.priority !== undefined) priority = body.priority
    if(body.priority === null) priority = 0;

    var qStr ="Select * FROM users WHERE login='"+body.login+"'";
    pool.query(qStr,(err,result)=>{//проверка на наличие пользователя в базе
      if(err) errorM(err.message,res);
      else
      {
        var password = cryptor.cryptData2(body.password); 
        qStr ="Insert Into users(firstname,lastname,login,password,priority)"
        +"VALUES('"+body.firstname+"','"+body.lastname+"','"+body.login+"','"+password+"','"+priority+"')";
        pool.query(qStr,(err,result)=>
        {
          if(err)errorM(err.message,res);
          else
          {
            doneM(lang.countUpdateRows+":"+result.rowCount,res);
          }
        })
      }
    })
  }
}

const deluser = (req,res) =>
{
    var id = req.params.id;
    console.log("!!!Запрос на удаление пользователя:id="+id+"!!!");
    var forma = "DELETE FROM users WHERE id='"+id+"'";
    pool.query(forma, (err, result)=>{
     if(err)
     {
      errorM(lang.sqlError+":"+err.message,res);
     }
     else
     {
        var count = result.rowCount;
        if (count === 0)
        {
          errorM(lang.noUpdateRows,res);
        }
        else
        {
          doneM(lang.countUpdateRows+count,res);
        }      
     }
   });
}
const authentication = (req,res) =>
{
  console.log("!!!Попытка аутентификации !!!");
  var login = req.body.login;
  var password = req.body.password;
  if(login===undefined || password === undefined)errorM(lang.notAllUserData,res);
  else
  {
    var qStr = "Select * from users where login ='"+login+"'";
    pool.query(qStr,(e,r)=>
    {
      if(e)errorM(lang.sqlError+":"+e.message,res);
      else
      {
        var user = r.rows[0];
        if(user ===undefined)errorM(lang.badLogin,res);
        else
        {
          
          var selectedPas = user.password;
          var cryptoPass = cryptor.cryptData2(password);
          user["password"] ="";
          if (selectedPas===cryptoPass) doneM(user,res)
          else  errorM(lang.badPassword,res);
        }
      }
    });
  }
}
const updateUser = (req, res) => {

  var body = req.body;
  var id = body.id;
  var fn = body.firstname;
  var ln = body.lastname;
  var log = body.login;
  var pas = cryptor.cryptData2(body.password);

  if (req.body === undefined) { errorM(lang.userUpdateErr, res) }
  else {
    var qStr = "Select * from users where id='" + id + "'";
    pool.query(qStr, (error, results) =>//проверка есть ли в базе пользователь с логином
    {
      if (error) {errorM(lang.userUpdateErr+":"+error.message,res)}
      else {
        var user = results.rows[0];
        if (user === undefined) {errorM(lang.userNotFound,res)}
        else {
          if (fn === undefined) fn = user.firstname;
          if (ln === undefined) ln = user.lastname;
          if (pas === undefined) pas = user.password;
          if (log === undefined) log = user.login;
          var vals = [fn, ln, log, pas];
          qStr = "UPDATE users SET firstname='" + fn + "',"
            + "lastname ='" + ln + "',"
            + "login ='" + log + "',"
            + "password ='" + pas + "'"
            + "WHERE id =" + id;
          pool.query(qStr, (error2, results2) => {
            if (error2) {errorM(lang.sqlError+":"+error2.message,res)}
            else {
              doneM(lang.countUpdateRows+results2.rowCount)
            }
          })
        }
      }
    });
  }
}

//News
const getAllNews = (req,res) =>
{
    console.log("!!!Запрос на получение всех новостей!!!");
    pool.query('SELECT * FROM news;', (error, results) => {
        if (error) {
            errorM(lang.newsNull,res)
           }
        else
        {
          ObjectM(results.rows,res);
        }
      })
}
const createNews = (req,res) =>
{
    console.log("!!!Запрос на создание новости!!!");
    var body = req.body;
    var datecreate = body.datecreate;
    if(datecreate === undefined){
        datecreate = new Date();
        console.log(datecreate);
    }
    var values =[[body.namenews,body.description,datecreate]];
    var query = format("INSERT INTO news (namenews,description,datecreate) VALUES %L",values);
    pool.query(query,[], (err, result)=>{
      if(err)
      {
          errorM(lang["sqlError"]+":"+err.message,res);
      }
      else
      {
        var count = result.rowCount;
        if (count === 0)
        {
            errorM(lang["noUpdateRows"],res);
        }
        else
        {
            doneM("Обновлено строк:"+count,res);  
        }                 
      }
    });
}
const deleteNews = (req,res)=>
{
  var id = req.params.id;
    console.log("!!!Запрос на удаление пользователя:id="+id+"!!!");
    var forma = "DELETE FROM news WHERE id='"+id+"'";
    pool.query(forma, (err, result)=>{
     if(err)
     {
        errorM(lang["sqlError"]+":"+err.message,res); 
     }
     else
     {
        var count = result.rowCount;
        if (count === 0)
        {
            errorM(lang["noUpdateRows"],res);
        }
        else
        {
            doneM(lang["countUpdateRows"]+count);  
        }      
     }
   });
}

const updateNews = (req,res) =>
{
  var b = req.body;
  var id = b.id;
  var name = b.namenews;
  var description = b.description;
  var datecreate = b.datecreate;

  res.status(200).json({error:"Не реализовано"});
  var qStr = "SELECT * FROM news WHERE id ="+id
  pool.query(qStr,(e,result)=>
  {
    if(e){errorM(lang["sqlError"]+e.message,res)}
    else{
      var news = result.rows[0];
      if(news===undefined){errorM(lang["newsNotFound"],res)}
      else
      {
        if(name === undefined)name = news.namenews;
        if(description === undefined)description = news.description;
        if(datecreate === undefined)datecreate = new Date(news.datecreate,'en');
        /// 
        qStr = "UPDATE news SET "
        +"namenews ='"+name+"', "
        +"description = '"+description+"' , "
        +"datecreate = '"+datecreate+"'";
        console.log(datecreate);
        console.log(qStr);
        pool.query(qStr,(e,result)=>
        {
          if(e){errorM(lang["sqlError"]+":"+e.message,res)}
          else
          {
            var count = res.rowCount;
            if(count===0){errorM(lang["noUpdateRows"]+":"+e.message,res)}
            else{
             doneM(lang["done"],res);
            }
          }
        })
      }
      
    }
  }) 
}
const query = (req,res) =>
{
    console.log("!!!ЗАПРОС!!!");
    pool.query('Select * from news', (error, results) => {
        if (error) {
            errorM("не добавил в таблицу   "+error.message,res);
           }
        else
        {
            doneM(results.rows,res);
        }
      })
}

function errorM(message,res)
{
  mess ={error:message};
  console.log("-!!!!!!!! "+message+" !!!!!!!!-");
  //console.error(mess);
  res.status(200).json(mess);
}
function doneM(message,res)
{
  mess ={done:message};
  console.log("__________"+message+"__________");
  res.status(200).json(mess);
}
function ObjectM(message,res)
{
  mess = {message};
  console.log(mess);
  res.status(200).json(message);
}

function validUser(body)
{
  return body.login !==undefined && body.password !==undefined&& body.firstname !==undefined&& body.lastname!==undefined;
}



module.exports.query = query;
module.exports.updateNews = updateNews;
module.exports.updateUser = updateUser;
module.exports.delNews = deleteNews;
module.exports.delUser = deluser;
module.exports.news = getAllNews;
module.exports.addNews = createNews;
module.exports.addUser = createNewUser;
module.exports.userById = userById;
module.exports.logIn = authentication;
module.exports.users = getAllUsers;
console.log("Класс базы данных подключен");