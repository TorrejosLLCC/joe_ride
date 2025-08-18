// generate-jwt-secret.js
const crypto = require('crypto');
console.log(crypto.randomBytes(32).toString('base64'));