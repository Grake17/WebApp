"use strict";
// ===================================================
// Env Script
// ===================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.env_var = void 0;
// Import DotEnv
require("dotenv").config();
// Define Variables
var variables = [
    "HOST_DB",
    "DATABASE",
    "USER_DB",
    "PASSWORD_DB",
    "SERVER_NAME",
    "HOST_MAIL",
    "USER_MAIL",
    "PASSWORD_MAIL"
];
// Export Function
function env_var() {
    // Verify null Env
    var outvar = variables.filter(
    // Check if process is !
    function (env_data) { return !process.env[env_data]; });
    // Check Lenght
    if (outvar.length) {
        // Error for missing Env Variables
        throw new Error("Missing Env Variables: " + outvar.join(", "));
    }
    // Return Env if success
    return {
        host_db: process.env.HOST_DB,
        database: process.env.DATABASE,
        user_db: process.env.USER_DB,
        password_db: process.env.PASSWORD_DB,
        server_name: process.env.SERVER_NAME,
        host_mail: process.env.HOST_MAIL,
        user_mail: process.env.USER_MAIL,
        password_mail: process.env.PASSWORD_MAIL // Process PASSWORD_MAIL
    };
}
exports.env_var = env_var;
