"use strict";
// Init Function
var init = function () {
    document.getElementById("button-send").addEventListener("click", send);
    document.getElementById("button-cancel").addEventListener("click", cancel);
};
// Send data Function
var send = function (ev) {
    ev.preventDefault();
    console.log("Funziona");
    ev.stopPropagation();
    var test = validate(ev);
    console.log(test);
    if (test.length == 0) {
        var data = {
            name: document.getElementById("nome").value,
            surname: document.getElementById("cognome").value,
            email: document.getElementById("email").value,
            selection: document.getElementById("select").value,
            number: document.getElementById("tickets").value
        };
        var options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        };
        fetch("/api", options).then(function (response) {
            console.log(response);
        }).catch(function (err) {
            console.log("Error on sending data.\n" + err);
        });
        var email = document.getElementById("email").value;
        window.alert("Richiesta inviata!\nArriver\u00E0 una mail a: " + email);
    }
    else {
        window.alert("Attenzione!\nCompilare tutti i campi.");
    }
    cancel(ev);
};
// Cancel Content Function
var cancel = function (ev) {
    ev.preventDefault();
    document.getElementById("user-input").reset();
    console.log("Data Reset");
};
// Validate Type of HTMLElement
var validate_type = function (id) {
    var element = document.getElementById(id);
    if (element instanceof HTMLInputElement)
        return element;
    return null;
};
// Validate if input != null
var validate = function (ev) {
    var invalid = [];
    // Get element by ID
    var name = validate_type("nome"); // Name 
    var surname = validate_type("cognome"); // Surname
    var email = validate_type("email"); // Email
    var tickets = validate_type("tickets"); // tickets   
    // Validate if values are null
    check_if_null(name, invalid);
    check_if_null(surname, invalid);
    check_if_null(email, invalid);
    check_if_null(tickets, invalid);
    return invalid;
};
// Check value if null
var check_if_null = function (x, invalid) {
    if (x.value == "") {
        x.parentElement.classList.add("error");
        invalid.push("Value " + x.name);
    }
};
// Await page load for addEventListener
window.addEventListener("load", function () {
    console.log("Tutto pronto!");
    init();
});
