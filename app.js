const {endpoints, testData, devData} = require("./index");
const express = require("express");
const fs = require("fs/promises");
const app = express();
const {getTopics} = require("./controllers")
const db = require('./db/connection');


app.get('/api', (req, res) => {
    res.status(200).send(endpoints)
})

app.get('/api/topics', getTopics)

module.exports = app