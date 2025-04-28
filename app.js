const express = require("express");
const app = express();
const db = require("./db/connection");
const {
  getApi,
  getTopics,
  getArticleById,
  getArticles,
} = require("./app/controllers/api.controllers.js");

app.use(express.json());

app.get("/api", getApi);

app.get("/api/topics", getTopics);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id", getArticleById);

app.all("/api/*wrong", (req, res) => {
  res.status(404).send({ msg: "Path not found" });
});

app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Bad request" });
  } else {
    res.status(500).send({
      msg: "Internal Server Error",
    });
  }
});

app.use((err, req, res, next) => {
  res.status(500).send({
    msg: "Internal server error",
  });
});

module.exports = app;
