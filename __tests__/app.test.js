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
    const nonExistantArticleId = 99;
    return request(app)
      .get(`/api/articles/${nonExistantArticleId}`)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("No article found.");
      });
  });
  test("400: responds with bad request msg  if sent invalid article_id type", () => {
    const invalidArticleId = "bestone";
    return request(app)
      .get(`/api/articles/${invalidArticleId}`)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
});
describe("GET /api/articles", () => {
  test("200: responds with array of articles with multiple specific properties", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((res) => {
        const articlesOutput = res.body.articles;
        expect(articlesOutput).toHaveLength(13);
        articlesOutput.forEach((article) => {
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
describe("GET /api/articles/:article_id/comments", () => {
  test("200: responds with array of comments for given article_id", () => {
    const articleId = 1;
    return request(app)
      .get(`/api/articles/${articleId}/comments`)
      .expect(200)
      .then((res) => {
        const commentsOutput = res.body.comments;
        expect(commentsOutput).toHaveLength(11);
        commentsOutput.forEach((comment) => {
          expect(comment).toHaveProperty("comment_id");
          expect(comment).toHaveProperty("votes");
          expect(comment).toHaveProperty("created_at");
          expect(comment).toHaveProperty("author");
          expect(comment).toHaveProperty("body");
          expect(comment).toHaveProperty("article_id");
        });
      });
  });
  test("404: responds with msg when given valid type of article_id but article with that id does not exist", () => {
    const nonExistantArticleId = 99;
    return request(app)
      .get(`/api/articles/${nonExistantArticleId}/comments`)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("No article Found.");
      });
  });
  test("400: responds with bad request msg if sent invalid article_id type", () => {
    const invalidArticleId = "random";
    return request(app)
      .get(`/api/articles/${invalidArticleId}/comments`)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  test("201: responds with new comment info", () => {
    const newComment = {
      article_id: 2,
      username: "lurker",
      body: "This is a newly added comment. How marvellous!",
    };
    return request(app)
      .post(`/api/articles/${newComment.article_id}/comments`)
      .send(newComment)
      .expect(201)
      .then(({ body }) => {
        const newlyCreatedComment = body.newComment;
        expect(newlyCreatedComment.article_id).toBe(2);
        expect(newlyCreatedComment.author).toBe("lurker");
        expect(newlyCreatedComment.body).toBe(
          "This is a newly added comment. How marvellous!"
        );
      });
  });
  test("400: responds with bad request msg if sent invalid article_id type", () => {
    const newComment = {
      article_id: "first",
      username: "lurker",
      body: "This is a newly added comment. How marvellous!",
    };
    return request(app)
      .post(`/api/articles/${newComment.article_id}/comments`)
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
  test("404: responds with msg if sent non-existant article_id of correct type", () => {
    const newComment = {
      article_id: 99,
      username: "lurker",
      body: "This is a newly added comment. How marvellous!",
    };
    return request(app)
      .post(`/api/articles/${newComment.article_id}/comments`)
      .send(newComment)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Article or comment not found.");
      });
  });
});
describe("PATCH /api/articles/:article_id", () => {
  test("200: returns updated article when vote count is increased", () => {
    const articleId = 9;
    const IncreaseVotesBy = { inc_votes: 10 };
    return request(app)
      .patch(`/api/articles/${articleId}`)
      .send(IncreaseVotesBy)
      .expect(200)
      .then((response) => {
        const updatedArticle = response.body.article;
        expect(updatedArticle.article_id).toBe(articleId);
        expect(updatedArticle.votes).toBe(10);
      });
  });
  test("200: returns updated article when vote count is decreased", () => {
    const articleId = 1;
    const IncreaseVotesBy = { inc_votes: -50 };
    return request(app)
      .patch(`/api/articles/${articleId}`)
      .send(IncreaseVotesBy)
      .expect(200)
      .then((response) => {
        const updatedArticle = response.body.article;
        expect(updatedArticle.article_id).toBe(articleId);
        expect(updatedArticle.votes).toBe(50);
      });
  });
  test("404: responds with bad request msg when non-existant article_id is used", () => {
    const articleId = 99;
    const IncreaseVotesBy = { inc_votes: 100 };
    return request(app)
      .patch(`/api/articles/${articleId}`)
      .send(IncreaseVotesBy)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Article not found.");
      });
  });
  test("400: responds with bad request msg if sent invalid inc_votes type", () => {
    const articleId = 1;
    const IncreaseVotesBy = { inc_votes: "loads" };
    return request(app)
      .patch(`/api/articles/${articleId}`)
      .send(IncreaseVotesBy)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
});
describe("DELETE /api/comments/:comment_id", () => {
  test("204: comment is deleted, no content is returned", () => {
    const commentId = 1;
    return request(app)
      .delete(`/api/comments/${commentId}`)
      .expect(204)
      .then(({ body }) => {
        expect(body).toEqual({});
      });
  });
  test("404: responds with bad request msg when non-existant comment_id is used", () => {
    const commentId = 99;
    return request(app)
      .delete(`/api/comments/${commentId}`)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Comment not found.");
      });
  });
  test("400: responds with bad request msg if sent invalid comment_id type", () => {
    const commentId = "something";
    return request(app)
      .delete(`/api/comments/${commentId}`)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
});
describe("GET /api/users", () => {
  test("200: responds with array of users with the properties username, name and avatar_url", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then((res) => {
        const usersOutput = res.body.users;
        expect(usersOutput).toHaveLength(4);
        usersOutput.forEach((user) => {
          expect(user).toHaveProperty("username");
          expect(user).toHaveProperty("name");
          expect(user).toHaveProperty("avatar_url");
        });
      });
  });
});
