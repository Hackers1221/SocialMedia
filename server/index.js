const express = require("express");
const app = express();

app.use("/", (req, res) => {
    res.send("Started");
})


app.listen(8080, () => {
    console.log("listning to port 8080!");
})