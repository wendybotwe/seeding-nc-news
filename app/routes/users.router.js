const express = require("express");
const {
  getUsers,
  getUserByUsername,
} = require("../controllers/users.controller.js");

const router = express.Router();

router.get("/", getUsers);
router.get("/:username", getUserByUsername);

module.exports = router;
