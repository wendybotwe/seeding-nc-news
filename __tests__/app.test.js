const endpointsJson = require("../endpoints.json");
const db = require("../db/connection.js");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");
const request = require("supertest");
const express = require("express");
const app = require("../app.js");

beforeEach(() => {
  return seed(data);
});

afterAll(() => {
  return db.end();
});
describe("GET /api", () => {
  test("200: responds with an object detailing the documentation for each endpoint", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then((res) => {
        const endpoints = res.body;
        expect(endpoints).toEqual(endpointsJson);
      });
  });
});
describe("Error /api/notapath", () => {
  test("404; reponds with path not found msg", () => {
    return request(app)
      .get("/api/notapath")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Path not found");
      });
  });
});
describe("GET /api/topics", () => {
  test("200: responds with array of topics with the properties slug and description", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then((res) => {
        const topicsOutput = res.body.topics;
        expect(topicsOutput).toHaveLength(3);
        topicsOutput.forEach((topic) => {
          expect(topic).toHaveProperty("slug");
          expect(topic).toHaveProperty("description");
        });
      });
  });
});
describe("GET /api/article/:article_id", () => {
  test("200: responds with article object for correct article_id", () => {
    const articleId = 5;
    return request(app)
      .get(`/api/articles/${articleId}`)
      .expect(200)
      .then((response) => {
        const articleIdOutput = response.body.article;
        expect(articleIdOutput.article_id).toBe(5);
        expect(articleIdOutput.title).toBe(
          "UNCOVERED: catspiracy to bring down democracy"
        );
        expect(articleIdOutput.author).toBe("rogersop");
        expect(articleIdOutput.body).toBe(
          "Bastet walks amongst us, and the cats are taking arms!"
        );
        expect(articleIdOutput.topic).toBe("cats");
        expect(articleIdOutput.votes).toBe(0);
        expect(articleIdOutput.article_img_url).toBe(
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
        );
      });
  });
  test("404: responds with helpful msg when given valid type of article_id but article with that id does not exist", () => {
    const articleId = 99;
    return request(app)
      .get(`/api/articles/${articleId}`)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("No article found for article_id: 99");
      });
  });
  test("400: responds with bad request msg  if sent invalid article_id type", () => {
    return request(app)
      .get("/api/articles/bestone")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
});
describe.skip("GET /api/articles", () => {
  test("200: responds with array of articles with multiple specific properties", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((res) => {
        const articlesOutput = res.body.articles;
        expect(articlesOutput).toHaveLength(13);
        topicsOutput.forEach((article) => {
          expect(article).toHaveProperty("author");
          expect(article).toHaveProperty("title");
          expect(article).toHaveProperty("article_id");
          expect(article).toHaveProperty("topic");
          expect(article).toHaveProperty("created_at");
          expect(article).toHaveProperty("votes");
          expect(article).toHaveProperty("article_img_url");
          expect(article).toHaveProperty("comment_count");
        });
      });
  });
});
