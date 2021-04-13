"use strict";
// ==================================
// Page Script
// ==================================
// Import config.json
var config = require("../../config.json");
// Init Function
var init = function () {
    // Get Button for Submit
    document.getElementById("button-send").addEventListener("click", send);
    // Get button for cancel entry
    document.getElementById("button-cancel").addEventListener("click", cancel);
};
// Send data Function
var send = function (ev) {
    ev.preventDefault();
    console.log("Funziona");
    ev.stopPropagation();
    // Validate Imput Function
    var test = validate(ev);
    // Test if Valid
    if (test.length == 0) {
        // Save the data
        var data = {
            name: document.getElementById("nome").value,
            surname: document.getElementById("cognome").value,
            email: document.getElementById("email").value,
            selection: document.getElementById("select").value,
            number: document.getElementById("tickets").value // Get the Number
        };
        // Set POST Request
        var options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        };
        // Send the POST Request & Callback
        fetch("/api", options).then(function (response) {
            console.log(response);
        }).catch(function (err) {
            console.log("Error on sending data.\n" + err);
        });
        // Confirm Alert
        var email = document.getElementById("email").value;
        console.log(config);
        window.alert("Richiesta inviata! Elaborata dal " + config.server_name + "\nArriver\u00E0 una mail a: " + email);
    }
    else {
        // Warning Alert
        window.alert("Attenzione!\nCompilare tutti i campi.");
    }
    // Delete Entry Function
    cancel(ev);
};
// Cancel Content Function
var cancel = function (ev) {
    ev.preventDefault();
    // Reset Forms
    document.getElementById("user-input").reset();
    // Confirmation Log
    console.log("Data Reset");
};
// Validate Type of HTMLElement
var validate_type = function (id) {
    // Get Object By ID
    var element = document.getElementById(id);
    // Test the type and return null if false 
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
    // Callback
    return invalid;
};
// Check value if null
var check_if_null = function (x, invalid) {
    // Push Empty in Array 
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
