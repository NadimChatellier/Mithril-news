const endpointsJson = require("../endpoints.json");
/* Set up your test imports here */
const app = require("../app")
const request = require("supertest");
const {testData} = require("../index")
const {topicData, userData, articleData, commentData} = testData
const db = require("../db/connection")
const seed = require("../db/seeds/seed");
const { convertTimestampToDate } = require("../db/seeds/utils");
/* Set up your beforeEach & afterAll functions here */

beforeEach(() => seed({topicData, userData, articleData, commentData}))

afterAll(() => db.end());

describe("GET /api", () => {
  test("200: Responds with an object detailing the documentation for each endpoint", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body } ) => {
        expect(body).toEqual(endpointsJson);
      });
  });
});
describe("GET /api/topics", () => {
  test("200: Responds with an array of topic objects with expected keys and values", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        body.forEach(element => {  
          expect(Object.keys(element)).toEqual([ 'slug', 'description' ]);
          expect(typeof element.description).toEqual('string');
          expect(typeof element.slug).toEqual('string');
        });
      });
  });
});

describe("GET /api/articles/:article_id", () => {
  test("200: Responds with an article obj with expected keys and values", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {

        expect(Object.keys(body)).toEqual(
          expect.arrayContaining([
            "author",
            "title",
            "article_id",
            "body",
            "topic",
            "created_at",
            "votes",
            "article_img_url" 
          ])
        );
      });
  });

  test("404: Responds with an error if id is valid but out of range of database", () => {
    return request(app)
      .get("/api/articles/274902849832094823480923840923809482093804928")
      .expect(404)
      .then(({ body }) => {

        expect(body.error).toEqual(404);
        expect(body.msg).toEqual("article 274902849832094823480923840923809482093804928 does not exist");
      });
  });

  test("400: Responds with an error if id is not valid", () => {
    return request(app)
      .get("/api/articles/banana")
      .expect(400)
      .then(({ body }) => {
        expect(body.error).toEqual(400);
        expect(body.msg).toEqual("bad request");
      });
  });
});


describe("GET /api/articles", () => {
  test("200: Responds with an array containing objects with expected values", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        expect(Array.isArray(body)).toEqual(true)
        body.forEach((article) => {
          expect(typeof article).toEqual("object")
          expect(Object.keys(article)).toEqual(expect.arrayContaining([
            "author",
            "title",
            "article_id",
            "topic",
            "created_at",
            "votes",
            "article_img_url",
             "comment_count"
          ]))
          expect(typeof article.author).toEqual("string")
          expect(typeof article.title).toEqual("string")
          expect(typeof article.article_id).toEqual("number")
          expect(typeof article.topic).toEqual("string")
          expect(typeof article.created_at).toEqual("string")
          expect(typeof article.votes).toEqual("number")
          expect(typeof article.article_img_url).toEqual("string")
          //future proofing this in case a number should be returned instead of a string
          expect(!isNaN(Number(article.comment_count))).toEqual(true);
        })
      });
  });
});


describe("GET /api/articles/:article_id/comments", () => {
  test("200: Responds with an array containing objects with expected values", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        body.forEach((comment) => {
          expect(typeof comment).toEqual("object")
          expect(Object.keys(comment).length).toEqual(6)
          expect(Object.keys(comment)).toEqual(expect.arrayContaining([
            "comment_id",
            "votes",
            "created_at",
            "author",
            "body",
            "article_id",
          ]))})
      });
  });

  test("404: Responds with expected error if id is not within range of ", () => {
    return request(app)
      .get("/api/articles/99/comments")
      .expect(404)
      .then((res) => {
        expect(JSON.parse(res.error.text)).toEqual({ msg: "Comments for Article with id 99 does not exist."})
      });
  });

  test("400: Responds with expected error if id is not within range of ", () => {
    return request(app)
      .get("/api/articles/Banana/comments")
      .expect(400)
      .then((res) => {
        expect(JSON.parse(res.error.text)).toEqual({msg: 'bad request'})
      });
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  test("201: comments are successfully posted", () => {
    const newComment = {
      username: "lurker",
      body: "All is good here!"
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment) 
      .expect(201) 
      .then(({body}) => {
        
        expect(Object.keys(body).length).toEqual(6)
        expect(body.body).toEqual("All is good here!")
        expect(body.author).toEqual("lurker")
        expect(body.article_id).toEqual(1)
        expect(typeof body.article_id && typeof body.votes && typeof body.comment_id).toEqual("number")
        expect(Object.keys(body)).toEqual(
          expect.arrayContaining(["comment_id", "body", "article_id", "author", "votes", "created_at"])
        );
      });
  });


   test("400: missing 'username'", () => {
    const newComment = {
      body: "All is good here!"
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(400)
      .then(({body}) => {
        expect(body.msg).toBe("bad request");
      });
  });

 
  test("400: missing 'body'", () => {
    const newComment = {
      username: "lurker"
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(400)
      .then(({body}) => {
        expect(body.msg).toBe("bad request");
      });
  });

 
  test("404: user does not exist", () => {
    const newComment = {
      username: "nonexistent_user",
      body: "This comment is invalid."
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(404)
      .then(({body}) => {
        expect(body.msg).toBe("User does not exist.");
      });
  });

  test("404: article not found", () => {
    const newComment = {
      username: "lurker",
      body: "This article doesn't exist."
    };
    return request(app)
      .post("/api/articles/999/comments")  
      .send(newComment)
      .expect(404)
      .then(({body}) => {
        expect(body.msg).toBe("Article not found.");
      });
  });

  test("400: empty request body", () => {
    return request(app)
      .post("/api/articles/1/comments")
      .send({})
      .expect(400)
      .then(({body}) => {
        expect(body.msg).toBe("bad request");
      });
  });

  test("400: invalid article_id type", () => {
    const newComment = {
      username: "lurker",
      body: "This is a test comment."
    };
    return request(app)
      .post("/api/articles/invalid_id/comments")
      .send(newComment)
      .expect(400)
      .then(({body}) => {
        expect(body.msg).toBe("bad request");
      });
  });
});

