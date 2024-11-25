const {getTopicData, getArticleIdData, getArticleData} = require('./models')
const app = require("./app");
const db = require('./db/connection');

function getTopics(req, res){
    getTopicData().then((result) => {
        res.status(200).send(result)
    })
    .catch((err) => {
        console.log(err)
    })
}

function getArticleId(req, res){
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

function getArticles(req, res){
    return getArticleData()
    .then((response) => {
        res.status(200).send(response)
    })
}
module.exports = {getTopics, getArticleId, getArticles}
    

