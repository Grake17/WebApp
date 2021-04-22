// ==================================
// Set Server Script
// ==================================

// Import FS
import * as fs from "fs";
// Import Join Path
import path from "path";

// Import DB
import * as mysql from "mysql";

// Import .ENV
import { env_var } from "../env"
const env = env_var(); 

// Function file set up
const file_promise = async function (): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        // Take Path Script 
        const src = path.resolve("./dist/script/script.js");
        const cpy = path.resolve("./public/js/script.js");
        console.log(`${src}\n${cpy}`);
        // Copy File Script.js Public
        fs.copyFile(src,cpy, (err) => {
            // Check Error
            if(err) reject(err);
            // Check successfull
            resolve("Moving File Success");
        });
    });    
}

// Function check DB connection
const db_promise = async function (): Promise<string> {
    return new Promise<string>((resolve, reject) => {
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
            if (err) reject(err);
            else {
                resolve("Connect to DB!");
                // Close connetion 
                db.destroy();   
            };            
        });         
    }); 
}


// Promise File Set
let file_test = file_promise();
// Resolve Promise File
file_test
    .then(() => console.log("File setup Complete!!!"))
    .catch(err => console.log(err));

// Promise DB
let db_check = db_promise();
// Resolve Promise DB
db_check
    .then(() => console.log("DB connection Complete!!!"))
    .catch(err => console.log(err));

