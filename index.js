"use strict";
exports.__esModule = true;
var express = require("express");
var app = express();
app.listen(3000, function () { return console.log("Listening at 3000"); });
app.use(express.static("public"));
// Set limit of response
app.use(express.json({ limit: "1mb" }));
app.post("/api", function (request, response) {
    var data = (request.body);
    console.log("Request from " + data.email);
    response.json({
        status: "Success!"
    });
});
