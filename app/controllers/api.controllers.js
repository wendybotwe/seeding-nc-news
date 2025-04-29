const endpoints = require("../../endpoints.json");
const {
  selectTopics,
  selectArticleById,
  selectArticles,
  selectArticleCommentsByArticleId,
  insertComment,
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
  return selectArticles()
    .then((articles) => {
      res.status(200).send({ articles });
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
  const { article_id, username, body } = req.body;
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
