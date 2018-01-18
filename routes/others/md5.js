const crypto = require('crypto');


exports.md5 = function(data){
    const hash = crypto.createHash('md5');
    var str = data+data.substring(0,2);
    hash.update(str);
    var encry = hash.digest('hex');
    console.log(encry);
    return encry;
}