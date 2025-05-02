const express = require("express");
const {
  getArticles,
  getArticleById,
  getArticleCommentsByArticleId,
  postCommentByArticleId,
  patchVotesByArticleId,
} = require("../controllers/articles.controller.js");

const router = express.Router();

router.get("/", getArticles);
router.get("/:article_id", getArticleById);
router.get("/:article_id/comments", getArticleCommentsByArticleId);
router.post("/:article_id/comments", postCommentByArticleId);
router.patch("/:article_id", patchVotesByArticleId);

module.exports = router;
