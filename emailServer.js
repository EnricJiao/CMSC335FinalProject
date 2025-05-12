"use strict";
const nodemailer = require('nodemailer');
const express = require('express');
const app = express();
app.set('view engine', 'ejs');
app.set('views', './templates');
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

const Sentiment = require('sentiment');
const sentiment = new Sentiment();

const { MongoClient, ServerApiVersion } = require("mongodb");
const path = require('path');
require("dotenv").config({
    path: path.resolve(__dirname, ".env"),
});
 
process.stdin.setEncoding("utf8");


//temporary port for local development
const port = process.env.PORT || 4000;

app.listen(port, () => {
    console.log(`Web server started and running at http://localhost:${port}`);
});

app.get("/", async (request, response) => {
   

    response.render("signup");
    
    
});

app.post("/signup", (request, response) => {
    let {name, email} = request.body;

    try {
        response.render("emailSpam", {
            name
        })

    }catch(e){

    }

});

app.get("/home", (req, res) => {
    res.render("signup")
})

app.post("/spam", async (req, res) => {
    let {email, numEmails} = req.body; // FIX THIS!!!!!!!!!!!!!!!!!!!!!!!!!!!!!J
    const databaseName = process.env.MONGO_DB_NAME;
    const collectionName = process.env.MONGO_COLLECTION;
    const uri = process.env.MONGO_CONNECTION_STRING;
    const client = new MongoClient(uri, { serverApi: ServerApiVersion.v1 });

    
    try {
        
        await client.connect();
        const database = client.db(databaseName);
        const collection = database.collection(collectionName);

        let result = await collection.insertOne({email});

        

        //send emails
        const transport = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'kanyespams335@gmail.com',
                //app password
                pass: 'cghz biru njou gyyt'
            }
        });

        for (let i = 0; i < Number(numEmails); i++) { 
            let isGoodQuote = false;
            let quote;
            
            while(!isGoodQuote){
                const quoteRes = await fetch('https://api.kanye.rest');
                const data = await quoteRes.json();
                quote = data.quote;

                const result = sentiment.analyze(quote);
                if(result.score > -4){
                    isGoodQuote = true;
                }
                
                if(quote.includes("#%") || quote.includes("Taylor might")){
                    isGoodQuote = false;
                }
            }
            


            await transport.sendMail({
                from: 'kanyespams335@gmail.com',
                to: email,
                subject: 'kanye says...',
                text: quote
            });
        }
        //finds 5 most recent entries
        const recentEntries = await collection
            .find()
            .sort({ _id: -1 })
            .limit(5)
            .toArray();

        let list = "<ol>"
        recentEntries.forEach(x => {
            list += "<li>" + x.email + "</li>";
        });
        list += "</ol>";

        res.render("confirmation", {
            numEmails, 
            destination:email,
            victimList:list
        });
    } catch (error) {
        console.error("there was an error :/");
        console.error(error);
    }
});