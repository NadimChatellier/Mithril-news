const {getTopicData, getArticleIdData, getArticleData, getCommentsByArticleIdData, insertCommentIntoDb, updadeVoteData, deleteCommentData, getUsersData, getUserByIdData} = require('./models')
const app = require("./app");
const db = require('./db/connection');

function getTopics(req, res){
    getTopicData().then((result) => {
        res.status(200).send(result)
    })
    .catch((err) => {
        next(err)
    })
}

function getArticleId(req, res, next){
    const id = req.params.article_id
    getArticleIdData(id).then((result) =>{
        res.status(200).send(result)
    })
    .catch((err) => {
        if (err.code === '22003'){
            res.status(404).send({error: 404, msg :`article ${id} does not exist`})
        }
        else {
            res.status(400).send({error: 400, msg :`bad request`})
        }
        
    })
}

function getArticles(req, res, next){
    return getArticleData(req.query)
    .then((response) => {
        res.status(200).send(response)
    })
    .catch((err) => {
        next(err)
    })
}

function getCommentsByArticleId(req, res, next){
    const id = req.params.article_id
    getCommentsByArticleIdData(id).then((response)=>{
        res.status(200).send(response)
    })
    .catch((err) => {
        next(err)
    })
}

function postCommentsOnArticle(req, res, next){
    const {article_id} = req.params
    insertCommentIntoDb(article_id, req.body).then((response) =>{
        res.status(201).send(response)
    })
    .catch((err) => {
        next(err)
    })
}

function updateVotes(req, res, next){
    updadeVoteData(req.params, req.body)
    .then((response) =>{
        res.status(200).send(response)
    })
    .catch((err) =>{
        next(err)
    })
}

function deleteComment(req, res, next){
    deleteCommentData(req.params.comment_id)
    .then((response) =>{
        res.status(204).send()
    })
    .catch((err) =>{
        next(err)
    })
}

function getUsers(req, res, next){
    getUsersData()
    .then((response) =>{
        res.status(200).send(response)
    })
    .catch((err) =>{
        next(err)
    })
}

function getUsersById(req, res, next){
    getUserByIdData(req.params)
    .then((response) =>{
        res.status(200).send(response)
    })
    .catch((err) =>{
        next(err)
    })
}

function updateCommentVotes(req, res, next){
    console.log("TODO")
}
module.exports = {getTopics, getArticleId, getArticles, getCommentsByArticleId, postCommentsOnArticle, updateVotes, deleteComment, getUsers, getUsersById}
    

