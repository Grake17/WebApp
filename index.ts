import express = require("express");
const app = express();

app.listen(3000, () => console.log("Listening at 3000"));

app.use(express.static("public"));
// Set limit of response
app.use(express.json({limit: "1mb"}));

app.post("/api", (request, response) => {
    const data = (request.body);
    console.log(`Request from ${data.email}`);    
    response.json({
        status: "Success!"
    })
});