const dotenv = require('dotenv');

dotenv.config();

module.exports = {
    Mongo_DB_URL : process.env.URL,
    PORT: process.env.PORT,
    FRONT_URL : process.env.FRONT_URL
}