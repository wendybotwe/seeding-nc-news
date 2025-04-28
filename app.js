const express = require("express");
const app = express();
const db = require("./db/connection");
const { getApi, getTopics } = require("./app/controllers/api.controllers.js");

app.use(express.json());

app.get("/api", getApi);

app.get("/api/topics", getTopics);

app.all("/api/*wrong", (req, res) => {
  res.status(404).send({ msg: "Path not found" });
});

app.use((err, req, res, next) => {
  res.status(500).send({
    msg: "Internal server error",
  });
});

module.exports = app;
