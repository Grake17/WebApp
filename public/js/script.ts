

// Init Function
const init = function () {
    document.getElementById("button-send").addEventListener("click", send);
    document.getElementById("button-cancel").addEventListener("click", cancel);
};

// Send data Function
const send = function (ev: any) {
    ev.preventDefault();
    console.log("Funziona");
    ev.stopPropagation();

    let test = validate(ev);
    console.log(test);
    if (test.length == 0) {
        const data = {
            name: (<HTMLInputElement>document.getElementById("nome")).value,
            surname: (<HTMLInputElement>document.getElementById("cognome")).value,
            email: (<HTMLInputElement>document.getElementById("email")).value,
            selection: (<HTMLSelectElement>document.getElementById("select")).value,
            number: (<HTMLInputElement>document.getElementById("tickets")).value
        };
        const options = {
            method : "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        }

        fetch("/api", options).then(response => {
            console.log(response);
        }).catch(err => {
            console.log(`Error on sending data.\n${err}`)
        });

        let email = (<HTMLInputElement>document.getElementById("email")).value;
        window.alert(`Richiesta inviata!\nArriverà una mail a: ${email}`);
    } else {
        window.alert(`Attenzione!\nCompilare tutti i campi.`);
    }   
    cancel(ev);
};

// Cancel Content Function
const cancel = function(ev: any): void{
    ev.preventDefault();
    (<HTMLFormElement>document.getElementById("user-input")).reset();
    console.log("Data Reset");
};

// Validate Type of HTMLElement
const validate_type = function (id: string): HTMLInputElement | null {
    const element = document.getElementById(id);
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

    return invalid;
}

// Check value if null
const check_if_null = function (x: HTMLInputElement, invalid: string[]): void {
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



