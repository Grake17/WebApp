// ==================================
// Cron Server Script
// ==================================

// Import Module
import { CronJob } from "cron";

// Import Email Date
import * as nodemailer from "nodemailer";
const { host_mail, user_mail, password_mail } = require("../../email_cred.json");
// Set Cred to mail
const transporter = nodemailer.createTransport({
    host: host_mail,
    auth: {
        user: user_mail,
        pass: password_mail
    }
});

// Import DB
import * as mysql from "mysql";
// Import DB Credential
const { host, database, username, password } = require('../../db_data.json');

// Create connection
const db = mysql.createConnection({
    host: host,
    database: database,
    user: username,
    password: password
});

// Connect to DB
db.connect((err) => {
    // Check Connection Healt
    if (err) console.log(err);
    else console.log("Connect to DB!");
});

// CRON Script every 10 minutes
const cron = new CronJob("*/10 * * * *", async () => {
    // MySQL Query
    let sql = 'SELECT * FROM tickets.tickets WHERE processed = 0;'
    // Set Up Array Fro
    let args: string[] = [];
    // Execute Query
    db.query(sql, function (err, rows, fields) {
        // Check if Rows length
        if (rows.length == 0) return console.log("Nothing to update!");
        // Start Elaborate
        console.log(`Starting update: ${rows.length} rows`);
        for (var i of rows) {
            // Trasform RowDataType to String[]
            let data: string[] = Object.values((JSON.parse(JSON.stringify(i))));
            // Elaborate Function
            elaborate(data);
            // Email Function
            send_mail(data);
        }
    });
})

// Function Update DB
const elaborate = function (m: string[]) {
    // Get Date
    var date = new Date();
    // Format Date
    let date_proc = `${date.getFullYear()}|${date.getMonth()}|${date.getDay()}-${date.getHours()}:${date.getMinutes()}`;
    // MySQL Query
    let sql = `UPDATE tickets.tickets 
               SET processed = '${1}', processat = '${date_proc}'
               WHERE id = '${m[0]}';`
    // Execute Query
    db.query(sql, function (err) {
        if (!err) console.log("Successfully edit on DB");
        else console.log(err);
    });
}

// Function Send Mail
const send_mail = function (m: string[]) {
    // Set Up Mail Data
    var mailOptions = {
        from: user_mail,
        to: m[3],
        subject: 'Email di conferma TICKET',
        text: `Confermiamo con successo che lei ha prenotato\n
               ${m[5]} biglietti il ${m[7]}`
    };
    // Send Mail
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

// Start Cron
cron.start();