const endpoints = require("./index")
const express = require("express");
const fs = require("fs/promises");
const app = express();


app.get('/api', (req, res) => {
    res.status(200).send(endpoints)
})


module.exports = app