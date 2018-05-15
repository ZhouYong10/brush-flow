var crypto = require('crypto');
const key = 'This is a user id';

function doCipher(string) {
    var cipher = crypto.createCipher('aes192', key);
    var encrypted = cipher.update(string, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
}

function doDecipher(string) {
    try{
        var decipher = crypto.createDecipher('aes192', key);
        var decrypted = decipher.update(string, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
    }catch(e){
        return null;
    }
}


module.exports = {
    doCipher: doCipher,
    doDecipher: doDecipher
};