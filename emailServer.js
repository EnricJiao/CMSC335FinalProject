"use strict";

const express = require('express');
const app = express();
app.set('view engine', 'ejs');
app.set('views', './templates');


//temporary port for local development
const port = process.env.PORT || 4000;

app.listen(port, () => {
    console.log(`Web server started and running at http://localhost:${port}`);
});

app.get("/", (request, response) => {
    response.render("emailSpam.ejs");
});

app.get("/signup", (request, response) => {

});