const express = require("express");
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const userroutes = require('./src/routes/user.routes');
const {Mongo_DB_URL, PORT} = require('./src/config/db.config');
const mongoose = require('mongoose');
const postRoutes = require("./src/routes/posts.routes");
const pulseRoutes = require("./src/routes/pulse.route");
const commentRoutes = require('./src/routes/comments.routes');
const announcementRoutes = require ('./src/routes/announcement.routes');
const messageRoutes = require('./src/routes/message.routes')
const groupRoutes = require('./src/routes/group.routes')
// server instance
const http = require("http");
const setupSocket = require("../server/socket/socket");
const groupRouter = require("./src/routes/group.routes");
const notificationRouter = require("./src/routes/notification.routes");
const server = http.createServer(app);

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

app.use('/auth',userroutes);
app.use('/post',postRoutes);
app.use('/pulse',pulseRoutes);
app.use('/comment',commentRoutes);
app.use('/announcement',announcementRoutes);
app.use('/message',messageRoutes);
app.use('/group',groupRoutes);
app.use('/notification', notificationRouter);


// Error handling middleware
app.use((err,req,res,next) => {
    const {statusCode = 500 , message = "Something went wrong"} = err;
    res.status(statusCode).send({
        msg : message
    })
})

app.use(cors());

async function ConnectToDb(){

    try {
      await mongoose.connect(Mongo_DB_URL);
      console.log("Connected to DB");
    } catch (error) {
        console.log("Connection to DB failed");
        console.log(error);
    }

}

ConnectToDb();

// Web Socket
setupSocket(server);


server.listen(PORT, () => {
    console.log(`listning to port ${PORT}!`);
})