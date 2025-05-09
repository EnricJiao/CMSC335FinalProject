"use strict";
const nodemailer = require('nodemailer');
const express = require('express');
const app = express();
app.set('view engine', 'ejs');
app.set('views', './templates');
app.use(express.urlencoded({ extended: true }));

const Sentiment = require('sentiment');
const sentiment = new Sentiment();


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

app.post("/spam", async (req, res) => {
    let {email, numEmails} = req.body; // FIX THIS!!!!!!!!!!!!!!!!!!!!!!!!!!!!!J
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

        for (let i = 0; i < Number(numEmails); i++) {
            await transport.sendMail({
                from: 'kanyespams335@gmail.com',
                to: email,
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