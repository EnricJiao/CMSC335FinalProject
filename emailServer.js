"use strict";
const nodemailer = require('nodemailer');
const express = require('express');
const app = express();
app.set('view engine', 'ejs');
app.set('views', './templates');
app.use(express.urlencoded({ extended: true }));


//temporary port for local development
const port = process.env.PORT || 4000;

app.listen(port, () => {
    console.log(`Web server started and running at http://localhost:${port}`);
});

app.get("/", (request, response) => {
    response.render("emailSpam");
});

app.get("/signup", (request, response) => {

});

app.post("/send-email", async (req, res) => {
    const userEmail = "form input that doesn't exist yet"; // FIX THIS!!!!!!!!!!!!!!!!!!!!!!!!!!!!!J
    try {
        const quoteRes = await fetch('https://api.kanye.rest');
        const data = await quoteRes.json();
        const quote = data.quote;

        // sentiment analysis

        //send emails
        const transport = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'kanyespams335@gmail.com',
                pass: 'cghz biru njou gyyt'
            }
        });

        for (let i = 0; i < 5; i++) { // send 5 spam emails, change later with form input
            await transport.sendMail({
                from: 'kanyespams335@gmail.com',
                to: userEmail,
                subject: 'kanye says...',
                text: quote
            });
        }

        res.send("rip email recipient");
    } catch (error) {
        console.error("there was an error :/");
        console.error(error);
    }
});