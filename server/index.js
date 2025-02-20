const express = require("express");
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const userroutes = require('./src/routes/user.routes');
const Mongo_DB_URL = require('./src/config/db.config');
const mongoose = require('mongoose');

app.use(function (req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin, Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, x-access-token");
    next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());

app.use('/social/auth',userroutes);

<<<<<<< HEAD
app.use((err,req,res,next) => {
    const {statusCode = 500 , message = "Something went wrong"} = err;
    res.status(statusCode).send({
        msg : message
    })
})
=======
app.use(cors())
>>>>>>> cf11567b25cfc37114d925e6ac6102239a8ff10d


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

