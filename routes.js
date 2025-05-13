"use strict";

const express = require('express');
const router = express.Router();

router.get("/", async (request, response) => {
   

    response.render("signup");
    
    
});


module.exports = router;