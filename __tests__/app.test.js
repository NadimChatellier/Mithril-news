const endpointsJson = require("../endpoints.json");
/* Set up your test imports here */
const app = require("../app")
const request = require("supertest");
const {testData} = require("../index")
const {topicData, userData, articleData, commentData} = testData
const db = require("../db/connection")
const seed = require("../db/seeds/seed");
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
          // expect(typeof element.description).toEqual('string');
          // expect(typeof element.slug).toEqual('string');
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


