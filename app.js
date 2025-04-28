const express = require("express");
const app = express();
const db = require("./db/connection");
const { getApi } = require("./app/controllers/api.controllers.js");

app.use(express.json());

app.get("/api", getApi);

module.exports = app;
