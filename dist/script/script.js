"use strict";
// ==================================
// Page Script
// ==================================
// Init Function
var init = function () {
    // Get Button for Submit
    var button = document.getElementById("button-send");
    if (button != null) {
        button.addEventListener("click", send);
    }
};
// Send data Function
var send = function (ev) {
    var _a, _b, _c, _d, _e;
    ev.preventDefault();
    console.log("Funziona");
    ev.stopPropagation();
    // Validate Imput Function
    var test = validate();
    // Test if Valid
    console.log(test);
    if (test.length == 0) {
        // Save the data
        var data = {
            name: (_a = validate_type("nome")) === null || _a === void 0 ? void 0 : _a.value,
            surname: (_b = validate_type("cognome")) === null || _b === void 0 ? void 0 : _b.value,
            email: (_c = validate_type("email")) === null || _c === void 0 ? void 0 : _c.value,
            selection: document.getElementById("select").value,
            number: (_d = validate_type("tickets")) === null || _d === void 0 ? void 0 : _d.value // Get the Number
        };
        console.log(data);
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
        window.alert("Richiesta inviata!\nArriver\u00E0 una mail a: " + ((_e = validate_type("email")) === null || _e === void 0 ? void 0 : _e.value));
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
    document.getElementById("input").reset();
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
var validate = function () {
    var invalid = [];
    // Get element by ID
    var name = validate_type("nome"); // Name 
    var surname = validate_type("cognome"); // Surname
    var email = validate_type("email"); // Email
    var tickets = validate_type("tickets"); // tickets   
    // Validate if values are null
    check_if_null(name, invalid);
    check_if_null(surname, invalid);
    check_mail(email, invalid);
    check_if_null(tickets, invalid);
    // Callback
    return invalid;
};
// Check value if null
var check_if_null = function (x, invalid) {
    // Push Empty in Array
    if (x == null)
        invalid.push("Value null");
    else if (x.value == "")
        invalid.push("Value " + x.name);
};
// Validate mail
var check_mail = function (x, invalid) {
    // Validate fromat
    var mailformat = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/;
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
window.addEventListener("load", function () {
    console.log("Tutto pronto!");
    init();
});
