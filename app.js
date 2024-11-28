const {endpoints, testData, devData} = require("./index");
const express = require("express");
const fs = require("fs/promises");
const app = express();
const { getTopics, getArticleId, getArticles, getCommentsByArticleId, 
        postCommentsOnArticle, updateVotes, deleteComment, getUsers,
        getUsersById, updateCommentVotes} = require("./controllers")
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

app.patch("/api/articles/:article_id", updateVotes)

app.delete("/api/comments/:comment_id", deleteComment)

app.get("/api/users", getUsers)

app.get("/api/users/:username", getUsersById)

app.patch("/api/comments/:comment_id", updateCommentVotes)



app.use((err, req, res, next) => {
    const pgErrors = ['22P02', '23502'];
    if (pgErrors.includes(err.code)) {
      return res.status(400).send({ msg: 'bad request' });
    }
    next(err);  
  });
  
app.use((err, req, res, next) => {
    if (err.status && err.msg) {
      return res.status(err.status).send({msg: err.msg });
    }
    next(err);  
  });
  
app.use((err, req, res, next) => {
    res.status(500).send({ msg: 'Internal server error' });
  });
  

module.exports = app