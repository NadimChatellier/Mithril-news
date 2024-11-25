const db = require('./db/connection');

function getTopicData(){
    return db.query(`SELECT * FROM topics;`).then((res) => {
        return res.rows
    })   
}

module.exports = {getTopicData}