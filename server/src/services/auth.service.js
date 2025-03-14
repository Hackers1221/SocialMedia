const jwt = require('jsonwebtoken');
require('dotenv').config();

const verfiyJwtToken = (token) =>{
    try {
        let decodedToken = jwt.verify(token, process.env.secret_key);
        return decodedToken;
      } catch(err) {
        throw err.message;
      }
}

module.exports = {
    verfiyJwtToken
}