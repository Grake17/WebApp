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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
// Import Module
var cron_1 = require("cron");
// Import Email Date
var nodemailer = __importStar(require("nodemailer"));
var _a = require("../../email_cred.json"), host_mail = _a.host_mail, user_mail = _a.user_mail, password_mail = _a.password_mail;
// Set Cred to mail
var transporter = nodemailer.createTransport({
    host: host_mail,
    auth: {
        user: user_mail,
        pass: password_mail
    }
});
// Import DB
var mysql = __importStar(require("mysql"));
// Import DB Credential
var _b = require('../../db_data.json'), host = _b.host, database = _b.database, username = _b.username, password = _b.password;
// Create connection
var db = mysql.createConnection({
    host: host,
    database: database,
    user: username,
    password: password
});
// Connect to DB
db.connect(function (err) {
    // Check Connection Healt
    if (err)
        console.log(err);
    else
        console.log("Connect to DB!");
});
// CRON Script every 10 minutes
var cron = new cron_1.CronJob("*/10 * * * *", function () { return __awaiter(void 0, void 0, void 0, function () {
    var sql, args;
    return __generator(this, function (_a) {
        sql = 'SELECT * FROM tickets.tickets WHERE processed = 0;';
        args = [];
        // Execute Query
        db.query(sql, function (err, rows, fields) {
            // Check if Rows length
            if (rows.length == 0)
                return console.log("Nothing to update!");
            // Start Elaborate
            console.log("Starting update: " + rows.length + " rows");
            for (var _i = 0, rows_1 = rows; _i < rows_1.length; _i++) {
                var i = rows_1[_i];
                // Trasform RowDataType to String[]
                var data = Object.values((JSON.parse(JSON.stringify(i))));
                // Elaborate Function
                elaborate(data);
                // Email Function
                send_mail(data);
            }
        });
        return [2 /*return*/];
    });
}); });
// Function Update DB
var elaborate = function (m) {
    // Get Date
    var date = new Date();
    // Format Date
    var date_proc = date.getFullYear() + "|" + date.getMonth() + "|" + date.getDay() + "-" + date.getHours() + ":" + date.getMinutes();
    // MySQL Query
    var sql = "UPDATE tickets.tickets \n               SET processed = '" + 1 + "', processat = '" + date_proc + "'\n               WHERE id = '" + m[0] + "';";
    // Execute Query
    db.query(sql, function (err) {
        if (!err)
            console.log("Successfully edit on DB");
        else
            console.log(err);
    });
};
// Function Send Mail
var send_mail = function (m) {
    // Set Up Mail Data
    var mailOptions = {
        from: user_mail,
        to: m[3],
        subject: 'Email di conferma TICKET',
        text: "Confermiamo con successo che lei ha prenotato\n\n               " + m[5] + " biglietti il " + m[7]
    };
    // Send Mail
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        }
        else {
            console.log('Email sent: ' + info.response);
        }
    });
};
// Start Cron
cron.start();
