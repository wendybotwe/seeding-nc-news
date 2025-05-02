const express = require("express");
const app = express();

const {
  getApi,
  getTopics,
  getArticleById,
  getArticles,
  getArticleCommentsByArticleId,
  postCommentByArticleId,
  patchVotesByArticleId,
  deleteCommentByCommentId,
  getUsers,
} = require("./app/controllers/api.controllers.js");

app.use(express.json());

app.get("/api", getApi);

app.get("/api/topics", getTopics);

app.get("/api/articles", getArticles);

app.get("/api/users", getUsers);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles/:article_id/comments", getArticleCommentsByArticleId);

app.post("/api/articles/:article_id/comments", postCommentByArticleId);

app.patch("/api/articles/:article_id", patchVotesByArticleId);

app.delete("/api/comments/:comment_id", deleteCommentByCommentId);

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
    next(err);
  }
});

app.use((err, req, res, next) => {
  if (err.code === "23503") {
    res.status(404).send({ msg: "Item not found." });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  res.status(500).send({
    msg: "Internal server error",
  });
});

module.exports = app;
