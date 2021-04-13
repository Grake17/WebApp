// ==================================
// Page Script
// ==================================

// Init Function
const init = function () {
    // Get Button for Submit
    const button = document.getElementById("button-send");
    if(button != null){
        button.addEventListener("click", send);
    }
};

// Send data Function
const send = function (ev: any) {
    ev.preventDefault();
    console.log("Funziona");
    ev.stopPropagation();
    // Validate Imput Function
    let test = validate();
    // Test if Valid
    console.log(test)
    if (test.length == 0) {
        // Save the data
        const data = {
            name: validate_type("nome")?.value,                                         // Get the name
            surname: validate_type("cognome")?.value,                                   // Get the surname
            email: validate_type("email")?.value,                                       // Get the email
            selection: (<HTMLSelectElement>document.getElementById("select")).value,    // Get the selection
            number: validate_type("tickets")?.value                                     // Get the Number
        };
        console.log(data);
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
            console.log(`Error on sending data.\n${err}`);
        });
        // Confirm Alert
        window.alert(`Richiesta inviata!\nArriverà una mail a: ${validate_type("email")?.value}`);
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
    (<HTMLFormElement>document.getElementById("input")).reset();
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
const validate = function () {
    let invalid: string[] = [];
    // Get element by ID
    let name = validate_type("nome");               // Name 
    let surname = validate_type("cognome");         // Surname
    let email = validate_type("email");             // Email
    let tickets = validate_type("tickets");         // tickets   

    // Validate if values are null
    check_if_null(name, invalid);
    check_if_null(surname, invalid);
    check_mail(email, invalid);
    check_if_null(tickets, invalid);
    // Callback
    return invalid;
}

// Check value if null
const check_if_null = function (x: HTMLInputElement | null, invalid: string[]): void {   
    // Push Empty in Array
    if(x == null) invalid.push(`Value null`);
    else if (x.value == "") invalid.push(`Value ${x.name}`);    
}

// Validate mail
const check_mail = function (x: HTMLInputElement | null, invalid: string[]): void {
    // Validate fromat
    const mailformat = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/;
    // Check mail 
    if (x == null)
        invalid.push("Value null");
    else if (x.value.match(mailformat)) {
        console.log("The Mail is valid");
    }
    else
        invalid.push("Ivalid mail");
};

// Await page load for addEventListener
window.addEventListener("load", () => {
    console.log("Tutto pronto!");
    init();
});



