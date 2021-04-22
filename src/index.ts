// ==================================
// Web Server Script
// ==================================

// Import Module
import express = require("express");
const app = express();
import moment from "moment";

// Import .ENV
import { env_var } from "./env"
const env = env_var(); 

// Import DB
import * as mysql from "mysql";

// Create connection
const db = mysql.createConnection({
    host: env.host_db,
    database: env.database,
    user: env.user_db,
    password: env.password_db
});

// Connect
db.connect((err) => {
    if (err) console.log(err);
    else{
        // Connessione al DB riuscita!
        console.log("Connect to DB!");
        //Set Listening Port
        app.listen(3000, () => console.log("Listening at 3000"));
        // Set public
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
            let result: Promise<string> = savedb(data);
            // Send Response
            result
                .then(() => response.sendStatus(200))    // Function Resolve
                .catch(() => response.sendStatus(500));  // Function Reject            
        });
    } 
});

// Function DB
const savedb = function (data: any): Promise<string> {
    return new Promise((resolve,rejects) => {
        // Get Date
        let date_proc = moment().format('YYYY/MM/DD HH:mm:ss');
        // Query
        var sql = `INSERT INTO tickets.tickets 
                (nome, cognome, email, posizione, biglietti, server_name, processed, regAt)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?);`;
        // Data Query
        let insert = [
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
            if (!err) resolve("succesuflly saved on DB");
            else {
                rejects("err");
                console.log(err);
            };
        });
    });    
}