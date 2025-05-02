const express = require("express");
const { getTopics } = require("../controllers/topics.controller.js");

const router = express.Router();

router.get("/", getTopics);

module.exports = router;
