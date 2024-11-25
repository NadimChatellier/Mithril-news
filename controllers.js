const {getTopicData} = require('./models')
const app = require("./app");
const db = require('./db/connection');

function getTopics(req, res){
    getTopicData().then((result) => {
        console.log(result)
        res.status(200).send(result)
    })
    .catch((err) => {
        console.log(err)
    })
}
module.exports = {getTopics}
    

