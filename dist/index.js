"use strict";
// ==================================
// Web Server Script
// ==================================
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
// Import Module
var express = require("express");
var app = express();
// Import DB
var mysql = __importStar(require("mysql"));
var _a = require('../db_data.json'), host = _a.host, database = _a.database, username = _a.username, password = _a.password;
// Create connection
var db = mysql.createConnection({
    host: host,
    database: database,
    user: username,
    password: password
});
// Connect
db.connect(function (err) {
    if (err)
        console.log(err);
    else
        console.log("Connect to DB!");
});
// Var for result
var result = [];
//Set Listening Port
app.listen(3000, function () { return console.log("Listening at 3000"); });
app.use(express.static("public"));
// Set limit of response
app.use(express.json({ limit: "1mb" }));
// Post Capture
app.post("/api", function (request, response) {
    var data = (request.body);
    console.log("Request from " + data.email);
    savedb(data);
    response.sendStatus(200);
});
// Function DB
var savedb = function (data) {
    // Set Date Data
    var date = new Date();
    var date_reg = date.getFullYear() + "|" + date.getMonth() + "|" + date.getDay() + "-" + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
    // Query
    var sql = "INSERT INTO tickets.tickets (nome, cognome, email, posizione, biglietti, processed, regAt)\n               VALUES ('" + data.name + "', '" + data.surname + "', '" + data.email + "', '" + data.selection + "', '" + data.number + "', '" + 0 + "', '" + date_reg + "');";
    // let sql = "SELECT * FROM tickets"
    // Send Query
    db.query(sql, function (err, rows, fields) {
        if (!err)
            console.log("succesuflly saved on DB");
        else
            console.log(err);
    });
};
