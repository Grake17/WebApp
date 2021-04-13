// ==================================
// Web Server Script
// ==================================

// Import Module
import express = require("express");
const app = express();

// Import DB
import * as mysql from "mysql";
const { host, database, username, password } = require('../db_data.json');

// Create connection
const db = mysql.createConnection({
    host: host,
    database: database,
    user: username,
    password: password
});

// Connect
db.connect((err) => {
    if (err) console.log(err);
    else console.log("Connect to DB!");
});

// Var for result
var result: string[] = [];

//Set Listening Port
app.listen(3000, () => console.log("Listening at 3000"));
// Set
app.use(express.static("public"));

// Set limit of response
app.use(express.json({ limit: "1mb" }));

// Post Capture
app.post("/api", (request, response) => {
    // Get Post Data
    const data = (request.body);
    // Console log for monitoring
    console.log(`Request from ${data.email}`);
    // Function DB    
    savedb(data);
    // Send Response
    response.sendStatus(200);
});

// Function DB
const savedb = function (data: any): void {
    // Set Date Data
    var date = new Date();
    let date_reg = `${date.getFullYear()}|${date.getMonth()}|${date.getDay()}-${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
    // Query
    let sql = `INSERT INTO tickets.tickets (nome, cognome, email, posizione, biglietti, processed, regAt)
               VALUES ('${data.name}', '${data.surname}', '${data.email}', '${data.selection}', '${data.number}', '${0}', '${date_reg}');`
    // let sql = "SELECT * FROM tickets"
    // Send Query
    db.query(sql, function (err, rows, fields) {
        if (!err) console.log("succesuflly saved on DB");
        else console.log(err);
    });
}