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
