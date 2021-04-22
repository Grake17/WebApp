// ==================================
// Cron Server Script
// ==================================

// Import Module
import { CronJob } from "cron";
// Import Date Formatter
import moment from "moment";

// Import Email Date
import * as nodemailer from "nodemailer";

// Import .ENV
import { env_var } from "../env"
const env = env_var(); 

// Set Cred to mail
const transporter = nodemailer.createTransport({
    host: env.host_mail,
    auth: {
        user: env.user_mail,
        pass: env.password_mail
    },
    secure: false
});

// Import Templete (Mail Templete)
import Email = require("email-templates");
import path from "path";
let path_email = path.join(__dirname,"../../emails");
// Create Templete
const email = new Email({
    transport: transporter,
    send: true,
    preview: false,
    views: {
        root: path.resolve(path_email),      
    }
})

// Import DB
import * as mysql from "mysql";

// Create connection
const db = mysql.createConnection({
    host: env.host_db,
    database: env.database,
    user: env.user_db,
    password: env.password_db
});

// Connect to DB
db.connect((err) => {
    // Check Connection Healt
    if (err) console.log(err);
    else { 
        console.log("Connect to DB!");
        // Start Cron
        cron.start();
    };
});

// CRON Script every 10 minutes
const cron = new CronJob("*/1 * * * *", () => {
    // MySQL Query
    let sql = 'SELECT * FROM tickets.tickets WHERE processed = 0;';
    // Execute Query
    db.query(sql, function (err, rows, fields) {
        // Check if Rows length
        if (rows.length == 0) return console.log("Nothing to update!");
        // Start Elaborate
        console.log(`Starting update: ${rows.length} rows`);
        for (var i of rows) {
            // Trasform RowDataType to String[]
            let data: string[] = Object.values((JSON.parse(JSON.stringify(i))));
            // Create Promise for mail check
            const promise: Promise<string> = setup_mail(data);
            // Promise for check mail
            console.log(moment(data[7]).format('YYYY/MM/DD HH:mm:ss'))
            promise
                .then(() => elaborate(data))  // Promise Resolve
                .catch(n => console.log(n));  // Promise Reject           
        }
    });
})

// Function Update DB
const elaborate = function (m: string[]):void {
    // Get Date
    let date_proc = moment().format('YYYY/MM/DD HH:mm:ss');
    // MySQL Query
    let sql = `UPDATE tickets.tickets 
               SET processed = '1', processat = ?
               WHERE id = '?';`
    // Take Values
    let option = [date_proc,m[0]];
    // Format Query
    sql = db.format(sql, option);
    // Execute Query
    db.query(sql, (err) => {
        if (!err) console.log("Successfully edit on DB");
        else console.log(err);
    });
}

// Function Send Mail
const setup_mail = function (m: string[]): Promise<string> {
    // Promise for check error
    return new Promise((resolve, rejects) => {
        // Send Mail    
        email.send({
            template: 'tickets',                // Specify Emails Template
            locals: {
                name: m[1],                                         // Name
                surname: m[2],                                      // Surname
                email: m[3],                                        // Email used for register 
                position: m[4],                                     // Stadio Position 
                number: m[5],                                       // Tickets number
                data: moment(m[7]).format('YYYY/MM/DD HH:mm:ss')    // Data registration
            },
            message: {
                from: env.user_mail,            // Email Sender
                to: m[3],                       // Email Reciver
            },            
        }).then(() => {
            // Mail send succesfully
            console.log(`Email sent to ${m[3]}!`);
            resolve("yes");
        }).catch((err) => {
            // Mail Error
            rejects(err);
        });
    });   
}

