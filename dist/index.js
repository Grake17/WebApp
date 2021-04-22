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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Import Module
var express = require("express");
var app = express();
var moment_1 = __importDefault(require("moment"));
// Import .ENV
var env_1 = require("./env");
var env = env_1.env_var();
// Import DB
var mysql = __importStar(require("mysql"));
// Create connection
var db = mysql.createConnection({
    host: env.host_db,
    database: env.database,
    user: env.user_db,
    password: env.password_db
});
// Connect
db.connect(function (err) {
    if (err)
        console.log(err);
    else {
        // Connessione al DB riuscita!
        console.log("Connect to DB!");
        //Set Listening Port
        app.listen(3000, function () { return console.log("Listening at 3000"); });
        // Set public
        app.use(express.static("public"));
        // Set limit of response
        app.use(express.json({ limit: "1mb" }));
        // Post Capture
        app.post("/api", function (request, response) {
            // Get Post Data
            var data = (request.body);
            // Console log for monitoring
            console.log("Request from " + data.email);
            // Function DB    
            var result = savedb(data);
            // Send Response
            result
                .then(function () { return response.sendStatus(200); }) // Function Resolve
                .catch(function () { return response.sendStatus(500); }); // Function Reject            
        });
    }
});
// Function DB
var savedb = function (data) {
    return new Promise(function (resolve, rejects) {
        // Get Date
        var date_proc = moment_1.default().format('YYYY/MM/DD HH:mm:ss');
        // Query
        var sql = "INSERT INTO tickets.tickets \n                (nome, cognome, email, posizione, biglietti, server_name, processed, regAt)\n                VALUES (?, ?, ?, ?, ?, ?, ?, ?);";
        // Data Query
        var insert = [
            data.name,
            data.surname,
            data.email,
            data.selection,
            data.number,
            env.server_name,
            0,
            date_proc
        ];
        // Format Query
        sql = mysql.format(sql, insert);
        // Send Query
        db.query(sql, function (err, rows, fields) {
            if (!err)
                resolve("succesuflly saved on DB");
            else {
                rejects("err");
                console.log(err);
            }
            ;
        });
    });
};
