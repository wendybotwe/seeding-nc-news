const express = require("express");
const {
  deleteCommentByCommentId,
} = require("../controllers/comments.controller.js");

const router = express.Router();

router.delete("/:comment_id", deleteCommentByCommentId);

module.exports = router;
