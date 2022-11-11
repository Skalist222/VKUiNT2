//var navigator = window.Navigator;
//var lang = navigator.language || navigator.userLanguage; 

/// тут будет интернационализация текстов
//ru
var locale = "ru";
var Rus = {};
Rus['userNotFound'] = "Пользователь не найден";
Rus['usersNull'] = "Нет пользователей";
Rus['userUpdateErr'] ="Ошибка добавления пользователя";
Rus['foundUserError'] ="Такой пользователь уже существует";
Rus['badLogin'] = "Неверный логин";
Rus['badPassword'] = "Неверный пароль";

Rus['sqlError'] ="Ошибка в SQL запросе";
Rus['done'] ="Выполнено";
Rus['noUpdateRows']= "Ни одна строка не была обновлена";
Rus['countUpdateRows']= "Количество обновленных строк:";

Rus['newsNull']= "Нет новостей";
Rus['newsNotFound'] ="Новость не найдена"
Rus['newsUpdateErr']="Ошибка обновления новости";
Rus['newsUpdateErr']="Ошибка добавления новости";

Rus['addCookieOk']= "Печенька добавлена";
Rus['addCookiesErr']= "Ошибка добавления Печеньки";
Rus['refCookiesOK']= "Печенька обновлена";


var lang;
switch(locale)
{
    case "ru":{lang =Rus}break;
    default:{lang =Rus}break;
}
if (locale === "ru") lang = Rus;

module.exports.lang = lang;
module.exports.Russian = Rus;
console.log("Языковой пакет подключен");