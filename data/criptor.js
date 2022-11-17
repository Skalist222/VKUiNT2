
const bcrypt = require('bcrypt');
const salt = "$2b$04$36h0PS5J47alPsObgivScu";

function cryptData2(data)
{
  const hash = bcrypt.hashSync(data,salt);
  return hash;
}
function compere(data,hesh)
{
  const comp = bcrypt.compareSync(data,hesh);
}
  
module.exports.cryptData2 = cryptData2;
module.exports.compere = compere;
console.log("Пакет шифрования данных подключен")