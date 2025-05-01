const endpoints = require("../../endpoints.json");
const {
  selectTopics,
  selectArticleById,
  selectArticles,
  selectArticleCommentsByArticleId,
  insertComment,
  updateVotesByArticleId,
  deleteComment,
  selectUsers,
} = require("../models/api.models.js");

exports.getApi = (req, res) => {
  res.status(200).send(endpoints);
};

exports.getTopics = (req, res, next) => {
  return selectTopics()
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getArticles = (req, res, next) => {
  const { sort_by, order, topic } = req.query;
  return selectArticles(sort_by, order, topic)
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getUsers = (req, res, next) => {
  return selectUsers()
    .then((users) => {
      res.status(200).send({ users });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  selectArticleById(article_id)
    .then((article) => {
      res.status(200).send({ article: article });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getArticleCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  selectArticleCommentsByArticleId(article_id)
    .then((comments) => {
      res.status(200).send({ comments: comments });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postCommentByArticleId = (req, res, next) => {
  const { username, body } = req.body;
  const { article_id } = req.params;
  return insertComment(article_id, username, body)
    .then((newComment) => {
      if (newComment) {
        res.status(201).send({ newComment: newComment });
      }
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchVotesByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;
  if (typeof inc_votes !== "number") {
    return res.status(400).send({ msg: "Bad request" });
  }
  updateVotesByArticleId(article_id, inc_votes)
    .then((updatedArticle) => {
      res.status(200).send({ article: updatedArticle });
    })
    .catch(next);
};

exports.deleteCommentByCommentId = (req, res, next) => {
  const { comment_id } = req.params;
  const parsedCommentId = Number(comment_id);
  if (typeof parsedCommentId !== "number") {
    return res.status(400).send({ msg: "Bad request" });
  }
  deleteComment(comment_id)
    .then(() => {
      res.status(204).send(res.body);
    })
    .catch(next);
};
