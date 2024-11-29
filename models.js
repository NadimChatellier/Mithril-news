const db = require('./db/connection');

function getTopicData(){
    return db.query(`SELECT * FROM topics;`).then((res) => {
        return res.rows
    })   
}

function getArticleIdData(id){
    return db.query(`SELECT articles.*, COUNT(comments.comment_id) AS comment_count
    FROM 
        articles
    LEFT JOIN 
        comments
    ON 
        articles.article_id = comments.article_id
    WHERE   
        articles.article_id = $1
    GROUP BY 
        articles.article_id;`, [id] )
        .then((res)=>{
        if (res.rows.length === 0) {
            return Promise.reject({ error: 404, message: `Article with id ${id} does not exist.` });
        }
        return res.rows[0]
    })
    
}

function getArticleData(sortingQueries) {
    const { sort_by = "created_at", order = "desc", topic, limit = 10, p = 1 } = sortingQueries;
    const validColumns = ["author", "title", "article_id", "topic", "created_at", "votes", "article_img_url", "comment_count"];
    const validOrders = ["asc", "desc"];
    if (!validColumns.includes(sort_by)) {
        return Promise.reject({ status: 400, msg: "Invalid sort column" });
    }

    if (!validOrders.includes(order)) {
        return Promise.reject({ status: 400, msg: "Invalid order query" });
    }

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
    `;

    let queryParams = []; 

    if (topic) {
        query += ` WHERE articles.topic = $1`; 
        queryParams.push(topic);  
    }

    query += ` GROUP BY articles.article_id`;

    if (sort_by && order) {
        query += ` ORDER BY ${sort_by} ${order}`; 
    }

    query += ` LIMIT $${queryParams.length + 1} OFFSET $${queryParams.length + 2}`;
    queryParams.push(limit); 
    queryParams.push((p - 1) * limit); 

    query += `;`;
    return db.query(query, queryParams)
        .then((res) => {
            if (res.rows.length === 0){
                return Promise.reject({ status: 404, msg: `bad request`});
            }
            return db.query(`SELECT COUNT(*) AS total_count FROM articles`).then((count) =>{
                const obj = {articles: res.rows, total_count: Number(count.rows[0].total_count)}
                return obj;
            })
            
        });
}



function getCommentsByArticleIdData(id, optionalQuery) {
    const { limit = 1, p = 1 } = optionalQuery || {};
    const offset = (p - 1) * limit; 

    const numRegex = /^\d+$/;

    if (!numRegex.test(limit.toString()) || !numRegex.test(p.toString())) {
        return Promise.reject({
            status: 400,
            msg: "Invalid query parameters: 'limit' and 'p' must be positive integers."
        });
    }

    let query = `
        SELECT comment_id, votes, created_at, author, body, article_id
        FROM comments
        WHERE article_id = $1
        ORDER BY created_at DESC
        LIMIT $2 OFFSET $3`;

    return db.query(query, [id, limit, offset]).then((res) => {
        if (res.rows.length === 0) {
            return Promise.reject({
                status: 404,
                msg: `Comments for Article with id ${id} does not exist.`
            });
        }
        return res.rows;
    });
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

  function getUsersData(){
    return db.query(`SELECT * FROM users;`)
    .then(({rows}) => {
        return rows
    })
  }

  function getUserByIdData(user){
    const {username} = user

    return db.query(`SELECT * FROM users WHERE username = $1;`, [username])
    .then(({rows}) => {
        if (!rows[0]){
            return Promise.reject({status: 404, msg: `${username} does not appear to be a user`})
        }
        return rows[0]
    })
  }

  function updateCommentVotesData(id, incVotesBy){
    const {comment_id} = id
    const {inc_votes} = incVotesBy
    return db.query(`UPDATE comments SET votes = votes + $1 WHERE comment_id = $2 RETURNING *;`, [inc_votes, comment_id])
    .then(({rows}) => {
        if (rows.length === 0){
            return Promise.reject({status: 404, msg: "Comment does not exist"})
        }
        return rows[0]
    })
  }

  function postArticleData(article){
    const defaultIMG = "https://t4.ftcdn.net/jpg/08/02/80/49/240_F_802804966_xBLll6ZNXekZkC9pXHkicTX04EYCNU2u.jpg"
    const {author, title, body, topic = defaultIMG} = article
    const article_img_url = article.article_img_url || defaultIMG;
    if (!author || !title || !body || !topic){
        return Promise.reject({status: 400, msg: "Missing essential fields"})
    }
    return db.query(`INSERT INTO articles (author, title, body, topic, article_img_url) VALUES ($1, $2, $3, $4, $5) RETURNING *;`, [author, title, body, topic, article_img_url])
    .then((res) => {
       return res.rows[0]
    })
    .catch((err) => {
        next(err)
    })
  }

  function postTopicData(newTopic){
    const {slug, description} = newTopic
    return db.query(`INSERT INTO topics (slug, description) VALUES ($1, $2) RETURNING *;`, [slug, description])
    .then(({rows}) =>{
        return rows[0]
    })
  }
module.exports = {getTopicData, getArticleIdData, getArticleData, getCommentsByArticleIdData, insertCommentIntoDb, updadeVoteData, deleteCommentData, getUsersData, getUserByIdData, updateCommentVotesData, postArticleData, postTopicData}