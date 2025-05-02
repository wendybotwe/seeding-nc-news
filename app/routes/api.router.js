const express = require("express");
const { getApi } = require("../controllers/api.controller.js");

const router = express.Router();

router.get("/", getApi);

module.exports = router;
