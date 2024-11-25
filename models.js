const db = require('./db/connection');

function getTopicData(){
    return db.query(`SELECT * FROM topics;`).then((res) => {
        return res.rows
    })   
}

function getArticleIdData(id){
    return db.query(`SELECT * FROM articles WHERE article_id = $1`, [id] ).then((res)=>{
        if (res.rows.length === 0) {
            // Handle 404 error when no article is found
            return Promise.reject({ error: 404, message: `Article with id ${id} does not exist.` });
        }
        return res.rows[0]
    })
    
}

module.exports = {getTopicData, getArticleIdData}