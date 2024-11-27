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

function getArticleData(sortingQueries) {
    const { sort_by = "created_at", order = "desc" } = sortingQueries;

    // Define valid columns and orders
    const validColumns = ["author", "title", "article_id", "topic", "created_at", "votes", "article_img_url", "comment_count"];
    const validOrders = ["asc", "desc"];

    // Validate sort_by and order
    if (!validColumns.includes(sort_by)) {
        return Promise.reject({ status: 400, msg: "Invalid sort column" });
    }

    if (!validOrders.includes(order)) {
        return Promise.reject({ status: 400, msg: "Invalid order query" });
    }

    // Base query
    let query = `
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
            articles.article_id`;

    if (sort_by || order) {
        query += ` ORDER BY ${sort_by} ${order}`;
    }

    query += `;`; 

    // Execute query
    return db.query(query)
        .then((res) => {
            return res.rows;
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
  
  function updadeVoteData(idObj, votesObj){
    const {article_id} = idObj
    const {inc_votes} = votesObj
    if (!inc_votes || !/^-?\d+(\.\d+)?$/.test(inc_votes)) {
        return Promise.reject({ status: 400, msg: "Invalid or missing votes value" });
    }
    return db.query(`UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *;`, [inc_votes, Number(article_id)])
    .then(({rows}) => {
        if (rows.length === 0){
            return Promise.reject({status: 404, msg: "User does not exist"})
        }
        return rows[0]

    })
  }

  function deleteCommentData(id){
    return db.query(`DELETE FROM comments WHERE comment_id = $1 RETURNING *;`, [id])
    .then((response) => {
        if (response.rows.length === 0){
            return Promise.reject({status: 404, msg: "comment does not exist"})
        }
    })
  }

module.exports = {getTopicData, getArticleIdData, getArticleData, getCommentsByArticleIdData, insertCommentIntoDb, updadeVoteData, deleteCommentData}