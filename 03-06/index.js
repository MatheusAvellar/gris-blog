const app = require("express")();
const fs = require("fs");
const http = require("http").Server(app);

app.get("/redos", function(req, res) {
    res.sendFile(__dirname + "/index.html");
});
app.get("/redos.css", function(req, res) {
    res.sendFile(__dirname + "/index.css");
});

http.listen(3000, function() {
    console.clear();
    console.log("Listening on *:3000\n");
});