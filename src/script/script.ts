// ==================================
// Page Script
// ==================================

// Import config.json
const config = require ("../../config.json")

// Init Function
const init = function () {
    // Get Button for Submit
    document.getElementById("button-send").addEventListener("click", send);
    // Get button for cancel entry
    document.getElementById("button-cancel").addEventListener("click", cancel);
};

// Send data Function
const send = function (ev: any) {
    ev.preventDefault();
    console.log("Funziona");
    ev.stopPropagation();
    // Validate Imput Function
    let test = validate(ev);
    // Test if Valid
    if (test.length == 0) {
        // Save the data
        const data = {
            name: (<HTMLInputElement>document.getElementById("nome")).value,              // Get the name
            surname: (<HTMLInputElement>document.getElementById("cognome")).value,        // Get the surname
            email: (<HTMLInputElement>document.getElementById("email")).value,            // Get the email
            selection: (<HTMLSelectElement>document.getElementById("select")).value,      // Get the selection
            number: (<HTMLInputElement>document.getElementById("tickets")).value          // Get the Number
        };
        // Set POST Request
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        }
        // Send the POST Request & Callback
        fetch("/api", options).then(response => {
            console.log(response);
        }).catch(err => {
            console.log(`Error on sending data.\n${err}`)
        });
        // Confirm Alert
        let email = (<HTMLInputElement>document.getElementById("email")).value;
        console.log(config);
        window.alert(`Richiesta inviata! Elaborata dal ${config.server_name}\nArriverà una mail a: ${email}`);
    } else {
        // Warning Alert
        window.alert(`Attenzione!\nCompilare tutti i campi.`);
    }
    // Delete Entry Function
    cancel(ev);
};

// Cancel Content Function
const cancel = function (ev: any): void {
    ev.preventDefault();
    // Reset Forms
    (<HTMLFormElement>document.getElementById("user-input")).reset();
    // Confirmation Log
    console.log("Data Reset");
};

// Validate Type of HTMLElement
const validate_type = function (id: string): HTMLInputElement | null {
    // Get Object By ID
    const element = document.getElementById(id);
    // Test the type and return null if false 
    if (element instanceof HTMLInputElement) return element;
    return null;
}

// Validate if input != null
const validate = function (ev: any) {
    let invalid: string[] = [];
    // Get element by ID
    let name = validate_type("nome");               // Name 
    let surname = validate_type("cognome");         // Surname
    let email = validate_type("email");             // Email
    let tickets = validate_type("tickets");         // tickets   

    // Validate if values are null
    check_if_null(name, invalid);
    check_if_null(surname, invalid);
    check_if_null(email, invalid);
    check_if_null(tickets, invalid);
    // Callback
    return invalid;
}

// Check value if null
const check_if_null = function (x: HTMLInputElement, invalid: string[]): void {
    // Push Empty in Array 
    if (x.value == "") {
        x.parentElement.classList.add("error");
        invalid.push(`Value ${x.name}`);
    }
}

// Await page load for addEventListener
window.addEventListener("load", () => {
    console.log("Tutto pronto!");
    init();
});



