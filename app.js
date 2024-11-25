const {endpoints, testData, devData} = require("./index");
const express = require("express");
const fs = require("fs/promises");
const app = express();
const {getTopics, getArticleId, getArticles, getCommentsByArticleId} = require("./controllers")
const db = require('./db/connection');


app.get('/api', (req, res) => {
    res.status(200).send(endpoints)
})

app.get('/api/topics', getTopics)

app.get('/api/articles/:article_id', getArticleId)

app.get('/api/articles', getArticles)

app.get("/api/articles/:article_id/comments", getCommentsByArticleId);


module.exports = app