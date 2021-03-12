var crypto = require('crypto');
module.exports = {
    md5Encryption : function(pwd){
        return crypto.createHash('md5').update(String(pwd)).digest('hex');
    }
};