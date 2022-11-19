//var navigator = window.Navigator;
//var lang = navigator.language || navigator.userLanguage; 

/// тут будет интернационализация текстов
//ru
let languages = {};
                                /*russian                                       english                                  ukrainian*/
languages['userNotFound'] =     {ru:"Пользователь не найден",                   en:"User not found"                     ,ua:""};
languages['usersNull'] =        {ru:"Нет пользователей",                        en:"Empty users"                        ,ua:""};
languages['userUpdateErr'] =    {ru:"Ошибка добавления пользователя",           en:"Error adding user"                  ,ua:""};
languages['foundUserError'] =   {ru:"Такой пользователь уже существует",        en:"Such a user already exists"         ,ua:""};
languages['badLogin'] =         {ru:"Неверный логин",                           en:"Invalid login"                      ,ua:""};
languages['badPassword'] =      {ru:"Неверный пароль",                          en:"Invalid password"                   ,ua:""};
languages['notAllUserData'] =   {ru:"Не вся информация о пользователе введена", en:"Not all user information is entered",ua:""};
languages['formatEror'] =       {ru:"Неверный формат вводимых данных",          en:"Invalid input data format"          ,ua:""};

languages['sqlError'] =         {ru:"Ошибка в SQL запросе",                     en:"Error SQL querty"                   ,ua:""};
languages['done'] =             {ru:"Выполнено",                                en:"Done"                               ,ua:""};
languages['noUpdateRows'] =     {ru:"Ни одна строка не была обновлена",         en:"Not a single row has been updated"  ,ua:""};
languages['countUpdateRows'] =  {ru:"Количество обновленных строк:",            en:"Number of updated rows:"            ,ua:""};

languages['newsNull'] =         {ru:"Нет новостей",                             en:"Empty news"                         ,ua:""};
languages['newsNotFound'] =     {ru:"Новость не найдена",                       en:"News not found"                     ,ua:""};
languages['newsUpdateErr'] =    {ru:"Ошибка обновления новости",                en:"Error update news"                  ,ua:""};
languages['newsUpdateErr'] =    {ru:"Ошибка добавления новости",                en:"Error adding news"                  ,ua:""};


module.exports.lang = languages;
console.log("Языковой пакет подключен");