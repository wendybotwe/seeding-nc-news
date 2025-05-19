const express = require("express");
const app = express();
app.use(express.json());

const cors = require('cors');
app.use(cors());

const apiRouter = require("./app/routes/api.router.js");
const topicsRouter = require("./app/routes/topics.router.js");
const usersRouter = require("./app/routes/users.router.js");
const commentsRouter = require("./app/routes/comments.router.js");
const articlesRouter = require("./app/routes/articles.router.js");

app.use("/api", apiRouter);
app.use("/api/topics", topicsRouter);
app.use("/api/users", usersRouter);
app.use("/api/comments", commentsRouter);
app.use("/api/articles", articlesRouter);

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
