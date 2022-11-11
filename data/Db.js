var pg = require('pg');
var lang = require('../language/engine.js').lang;// библиотека языковой подстановки
var format = require('pg-format');
//var passwordHash = require('password-hash');
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
    if (error) {
        res.status(200).json(setMessageError(lang['usersNull']));
    }
    res.status(200).json(results.rows)
  })
}
const userById = (req, res) =>
{
    //console.log(req.params.id);
    var id = req.params.id;
    console.log("!!!Запрос на получение пользователя с id="+id+"!!!");
    var qStr = "Select * from users where id="+id+"";
    pool.query(qStr,(error,results)=>
    {
      if (error) {return;}
      var user = results.rows[0];
      if(user === undefined)
      {
        res.status(200).json(setMessageError(lang["userNotFound"])); 
      } 
      else
      {
        res.status(200).json(user);
      }
    }) 
}
const createNewUser = (req, res) => {
    console.log("!!!Запрос на создание нового пользователя!!!");
  var body = req.body;
  var qStr = "Select * from users where login='" + body.login + "'";
  console.log(qStr);
  pool.query(qStr,(error,results)=>//проверка есть ли в базе пользователь с логином
    {
        if(error)
        {
           res.status(200).json(setMessageError(lang["sqlError"]+":"+err.message));
        }
        else
        {
            var user = results.rows[0];
            if(user===undefined){
               var values =[[body.firstname,body.lastname,body.login,body.password]];
               var forma = format("INSERT INTO users (firstname,lastname,login,password) VALUES %L",values);
            //    console.log(forma);
               pool.query(forma,[], (err, result)=>{
                if(err)
                {
                    res.status(200).json(setMessageError(lang["sqlError"]+":"+err.message));
                }
                else
                {
                    res.status(200).json(setMessageDone("Обновлено строк:"+result.rowCount));              
                }
              });
            }
            else 
            {
                res.status(200).json(setMessageError(lang["foundUserError"]));//пользователь нашелся но не должен был(зараза)
            }
        }
    })
}
const deluser = (req,res) =>
{
    var id = req.params.id;
    console.log("!!!Запрос на удаление пользователя:id="+id+"!!!");
    var forma = "DELETE FROM users WHERE id='"+id+"'";
    pool.query(forma, (err, result)=>{
     if(err)
     {
        res.status(200).json( setMessageError(lang["sqlError"]+":"+err.message)); 
     }
     else
     {
        var count = result.rowCount;
        if (count === 0)
        {
            res.status(200).json(setMessageError(lang["noUpdateRows"]));
        }
        else
        {
            res.status(200).json(setMessageDone("Обновлено строк:"+count));  
        }      
     }
   });
}
const authentication = (req,res) =>
{
  console.log("!!!Попытка аутентификации !!!");
  var login = req.query.login;
  var password = req.query.password;
  console.log("!!!Логин: "+login+"!!!");
  console.log("!!!Пароль: "+password+"!!!");
  var qStr = "Select * from users where login='"+login+"'";
  pool.query(qStr,(error,results)=>
    {
      if (error) {  throw error;}
      var user = results.rows[0];
        if(user === undefined)
        {
          res.status(200).json(setMessageError(lang["badLogin"]));
        } 
        else
        { 
          var qStr2 = "Select * From users where login ='"+login+"' and password = '"+password+"'";
          pool.query(qStr2,(error2,results2)=>
          {
              if(error2){throw error;}
              var user = results2.rows[0];
              if (user === undefined)
              {
                res.status(200).json(setMessageError(lang["badPassword"]));
              }
              else
              {
                res.status(200).json(user);
              }
          });
          
        }
    }) 
  //res.status(200).json(user);
}
const updateUser =(req,res)=>
{
  
  var body = req.body;
  var id = body.id;
  var fn = body.firstname;
  var ln = body.lastname;
  var log = body.login;
  var pas = body.password;

  
  if(req.body === undefined){res.status(200).json({error:lang["userUpdateErr"]})}
  else
  {
    var qStr = "Select * from users where id='" + id + "'";    
  pool.query(qStr,(error,results)=>//проверка есть ли в базе пользователь с логином
    {
      if(error){res.status(200).json({error:lang["userUpdateErr"]+":"+error.message})}
      else
      {
        var user = results.rows[0];
        if(user === undefined){res.status(200).json({error:lang["userNotFound"]})}
        else
        {
            if(fn===undefined)fn=user.firstname;
            if(ln===undefined)ln=user.lastname;
            if(pas===undefined)pas=user.password;
            if(log===undefined)log=user.login;
            var vals = [fn,ln,log,pas];
            qStr = "UPDATE users SET firstname='"+fn+"',"
            +"lastname ='"+ln+"',"
            +"login ='"+log+"',"
            +"password ='"+pas+"'"
            +"WHERE id ="+id;
            pool.query(qStr,(error2,results2)=>
            {
                if(error2){ res.status(200).json(setMessageError(lang["sqlError"]+":"+error2.message));}
                else
                {
                  res.status(200).json(setMessageDone(lang["countUpdateRows"]+results2.rowCount));
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
            res.status(200).json(setMessageError(lang["newsNull"],res));
           }
        else
        {
            res.status(200).json(results.rows);
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
          res.status(200).json(setMessageError(lang["sqlError"]+":"+err.message));
      }
      else
      {
        var count = result.rowCount;
        if (count === 0)
        {
            res.status(200).json(setMessageError(lang["noUpdateRows"]));
        }
        else
        {
            res.status(200).json(setMessageDone("Обновлено строк:"+count));  
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
        res.status(200).json( setMessageError(lang["sqlError"]+":"+err.message)); 
     }
     else
     {
        var count = result.rowCount;
        if (count === 0)
        {
            res.status(200).json(setMessageError(lang["noUpdateRows"]));
        }
        else
        {
            res.status(200).json(setMessageDone(lang["countUpdateRows"]+count));  
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
    if(e){res.status(200).json(setMessageError(lang["sqlError"]+e.message))}
    else{
      var news = result.rows[0];
      if(news===undefined){res.status(200).json(setMessageError(lang["newsNotFound"]))}
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
          if(e){res.status(200).json(setMessageError(lang["sqlError"]+":"+e.message))}
          else
          {
            var count = res.rowCount;
            if(count===0){res.status(200).json(setMessageError(lang["noUpdateRows"]+":"+e.message))}
            else{
              res.status(200).json(setMessageDone(lang["done"]));
            }
          }
        })
      }
      
    }
  }) 
}


function setMessageError(message)
{
    var mess= {};
    mess["error"] = message;
    console.error(mess);
    return mess;
}
function setMessageDone(message)
{
    var mess= {};
    mess["done"] = message;
    console.error(mess);
    return mess;
}

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