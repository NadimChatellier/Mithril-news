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

function getArticleData(){
    //long query 
    const query = `
    SELECT 
        articles.author,
        articles.title,
        articles.article_id,
        articles.topic,
        articles.created_at,
        articles.votes,
        articles.article_img_url,
        COUNT(comments.comment_id) AS comment_count
    FROM 
        articles
    LEFT JOIN 
        comments
    ON 
        articles.article_id = comments.article_id
    GROUP BY 
        articles.article_id;`;

    return db.query(query)
    .then((res) => {
        return res.rows
    })
    .catch((err) => {
        throw err
    })
}

function getCommentsByArticleIdData(id){
    return db.query(`SELECT comment_id, votes, created_at, author, body, article_id
    FROM comments
    WHERE article_id = $1
    ORDER BY created_at DESC;`, [id]).then((res) =>{
        return res.rows
    })
}


module.exports = {getTopicData, getArticleIdData, getArticleData, getCommentsByArticleIdData}