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
        next(err)
    })
}

function getCommentsByArticleIdData(id){
    return db.query(`SELECT comment_id, votes, created_at, author, body, article_id
    FROM comments
    WHERE article_id = $1
    ORDER BY created_at DESC;`, [id]).then((res) =>{
        if (res.rows.length === 0){
            return Promise.reject({ status: 404, msg: `Comments for Article with id ${id} does not exist.`});
        }
        return res.rows
    })

}

function insertCommentIntoDb(id, comment) {
    const { username, body } = comment;

    if (!username || !body) {
        return Promise.reject({ status: 400, msg: 'bad request' });
    }

    return db.query(`SELECT * FROM articles WHERE article_id = $1;`, [id])
      .then((articleRes) => {
        if (articleRes.rows.length === 0) {
          return Promise.reject({ status: 404, msg: 'Article not found.' });
        }
        return db.query(`SELECT * FROM users WHERE username = $1;`, [username]);
      })
      .then((userRes) => {
        if (userRes.rows.length === 0) {
          return Promise.reject({ status: 404, msg: 'User does not exist.' });
        }
        return db.query(
          `INSERT INTO comments (article_id, author, body) 
           VALUES ($1, $2, $3) RETURNING *;`,
          [id, username, body]
        );
      })
      .then((res) => {
        return res.rows[0]; 
      })
      .catch((err) => {
        return Promise.reject(err);
      });
  }
  

  

module.exports = {getTopicData, getArticleIdData, getArticleData, getCommentsByArticleIdData, insertCommentIntoDb}