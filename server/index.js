const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const userroutes = require('./src/routes/user.routes');
const Mongo_DB_URL = require('./src/config/db.config');
const mongoose = require('mongoose');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());

app.use('/social/auth',userroutes);

async function ConnectToDb(){

    try {
    console.log(Mongo_DB_URL);
      await mongoose.connect("mongodb://127.0.0.1:27017/socialmedia");
      console.log("Connected to DB");
    } catch (error) {
        console.log("Connection to DB failed");
        console.log(error);
    }

}

ConnectToDb();








app.listen(8080, () => {
    console.log("listning to port 8080!");
})

