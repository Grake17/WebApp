// ===================================================
// Env Script
// ===================================================

// Import DotEnv
require("dotenv").config();

// Define Variables
const variables = [
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
export function env_var() {
    // Verify null Env
    const outvar = variables.filter(
        // Check if process is !
        (env_data) => !process.env[env_data]
    );
    // Check Lenght
    if (outvar.length) {
        // Error for missing Env Variables
        throw new Error(
            `Missing Env Variables: ${outvar.join(
              ", "
            )}`
        );
    }
    // Return Env if success
    return {
        host_db: process.env.HOST_DB,               // Process Host_DB
        database: process.env.DATABASE,             // Process DATABASE
        user_db: process.env.USER_DB,               // Process USER_DB
        password_db: process.env.PASSWORD_DB,       // Process PASSWORD_DB
        server_name: process.env.SERVER_NAME,       // Process SERVER_NAME
        host_mail: process.env.HOST_MAIL,           // Process HOST_MAIL
        user_mail: process.env.USER_MAIL,           // Process USER_MAIL
        password_mail: process.env.PASSWORD_MAIL         // Process PASSWORD_MAIL
    }
}