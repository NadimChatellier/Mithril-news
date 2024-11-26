const {endpoints, testData, devData} = require("./index");
const express = require("express");
const fs = require("fs/promises");
const app = express();
const {getTopics, getArticleId, getArticles, getCommentsByArticleId, postCommentsOnArticle} = require("./controllers")
const db = require('./db/connection');

app.use(express.json());

app.get('/api', (req, res) => {
    res.status(200).send(endpoints)
})

app.get('/api/topics', getTopics)

app.get('/api/articles/:article_id', getArticleId)

app.get('/api/articles', getArticles)

app.get("/api/articles/:article_id/comments", getCommentsByArticleId);

app.post("/api/articles/:article_id/comments", postCommentsOnArticle)

app.use((err, req, res, next) =>{
    if(err.code === '22P02'){
        res.status(400).send('bad request')
    }
    else{
       next(err)
    }
})

app.use((err, req, res, next) =>{
    if (err.message && err.error){
        res.status(err.error).send(err.message)
    }
    else{
        next(err)
    }
})

app.use((err, req, res, next) =>{
    res.status(500).send("internal server error")
})
module.exports = app