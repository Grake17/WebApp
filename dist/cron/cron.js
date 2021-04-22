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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Import Module
var cron_1 = require("cron");
// Import Date Formatter
var moment_1 = __importDefault(require("moment"));
// Import Email Date
var nodemailer = __importStar(require("nodemailer"));
// Import .ENV
var env_1 = require("../env");
var env = env_1.env_var();
// Set Cred to mail
var transporter = nodemailer.createTransport({
    host: env.host_mail,
    auth: {
        user: env.user_mail,
        pass: env.password_mail
    },
    secure: false
});
// Import Templete (Mail Templete)
var Email = require("email-templates");
var path_1 = __importDefault(require("path"));
var path_email = path_1.default.join(__dirname, "../../emails");
// Create Templete
var email = new Email({
    transport: transporter,
    send: true,
    preview: false,
    views: {
        root: path_1.default.resolve(path_email),
    }
});
// Import DB
var mysql = __importStar(require("mysql"));
// Create connection
var db = mysql.createConnection({
    host: env.host_db,
    database: env.database,
    user: env.user_db,
    password: env.password_db
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
            console.log(moment_1.default(data[7]).format('YYYY/MM/DD HH:mm:ss'));
            promise
                .then(function () { return elaborate(data); }) // Promise Resolve
                .catch(function (n) { return console.log(n); }); // Promise Reject           
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
    var date_proc = moment_1.default().format('YYYY/MM/DD HH:mm:ss');
    // MySQL Query
    var sql = "UPDATE tickets.tickets \n               SET processed = '1', processat = ?\n               WHERE id = '?';";
    // Take Values
    var option = [date_proc, m[0]];
    // Format Query
    sql = db.format(sql, option);
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
    // Promise for check error
    return new Promise(function (resolve, rejects) {
        // Send Mail    
        email.send({
            template: 'tickets',
            locals: {
                name: m[1],
                surname: m[2],
                email: m[3],
                position: m[4],
                number: m[5],
                data: moment_1.default(m[7]).format('YYYY/MM/DD HH:mm:ss') // Data registration
            },
            message: {
                from: env.user_mail,
                to: m[3], // Email Reciver
            },
        }).then(function () {
            // Mail send succesfully
            console.log("Email sent to " + m[3] + "!");
            resolve("yes");
        }).catch(function (err) {
            // Mail Error
            rejects(err);
        });
    });
};
