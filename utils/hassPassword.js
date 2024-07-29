const crypto = require('crypto');

function hashPassword(password) {
    return crypto.createHash('sha256').update(password).digest('hex');
}
// console.log(hashPassword('crcsolar@030886'));
module.exports = hashPassword;