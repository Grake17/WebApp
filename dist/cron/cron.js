"use strict";
// ==================================
// Cron Server Script
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
var cron_1 = require("cron");
// Import Email Date
var nodemailer = __importStar(require("nodemailer"));
var email_cred_json_1 = require("../email_cred.json");
// Set Cred to mail
var transporter = nodemailer.createTransport({
    host: email_cred_json_1.host_mail,
    auth: {
        user: email_cred_json_1.user_mail,
        pass: email_cred_json_1.password_mail
    }
});
// Import DB
var mysql = __importStar(require("mysql"));
// Import DB
var db_data_json_1 = require("../db_data.json");
// Create connection
var db = mysql.createConnection({
    host: db_data_json_1.host,
    database: db_data_json_1.database,
    user: db_data_json_1.username,
    password: db_data_json_1.password
});
// Connect to DB
db.connect(function (err) {
    // Check Connection Healt
    if (err)
        console.log(err);
    else {
        console.log("Connect to DB!");
        // Start Cron
        cron.start();
    }
    ;
});
// CRON Script every 10 minutes
var cron = new cron_1.CronJob("*/1 * * * *", function () {
    // MySQL Query
    var sql = 'SELECT * FROM tickets.tickets WHERE processed = 0;';
    // Set Up Array Fro
    var args = [];
    // Execute Query
    db.query(sql, function (err, rows, fields) {
        // Check if Rows length
        if (rows.length == 0)
            return console.log("Nothing to update!");
        // Start Elaborate
        console.log("Starting update: " + rows.length + " rows");
        var _loop_1 = function () {
            // Trasform RowDataType to String[]
            var data = Object.values((JSON.parse(JSON.stringify(i))));
            // Create Promise for mail check
            var promise = setup_mail(data);
            // Promise for check mail
            promise
                .then(function () { return elaborate(data); })
                .catch(function (n) { return console.log(n); });
        };
        for (var _i = 0, rows_1 = rows; _i < rows_1.length; _i++) {
            var i = rows_1[_i];
            _loop_1();
        }
    });
});
// Function Update DB
var elaborate = function (m) {
    // Get Date
    var date = new Date();
    // Format Date
    var date_proc = date.getFullYear() + "|" + date.getMonth() + "|" + date.getDay() + "-" + date.getHours() + ":" + date.getMinutes();
    // MySQL Query
    var sql = "UPDATE tickets.tickets \n               SET processed = '1', processat = '" + date_proc + "'\n               WHERE id = '" + m[0] + "';";
    // Execute Query
    db.query(sql, function (err) {
        if (!err)
            console.log("Successfully edit on DB");
        else
            console.log(err);
    });
};
// Function Send Mail
var setup_mail = function (m) {
    return new Promise(function (resolve, rejects) {
        // Set Up Mail Data
        var mailOptions = {
            from: email_cred_json_1.user_mail,
            to: m[3],
            subject: 'Email di conferma TICKET',
            text: "Confermiamo con successo che lei ha prenotato\n\n                " + m[5] + " biglietti il " + m[7]
        };
        transporter.sendMail(mailOptions, function (error, info) {
            // If send mail go wrong
            if (error) {
                console.log(error);
                rejects("err");
            }
            // If send mail works           
            else {
                console.log('Email sent: ' + info.response);
                resolve("yes");
            }
        });
    });
};
