const endpoints = require("../../endpoints.json");
const {
  selectTopics,
  selectArticlesyId,
  selectArticlebyId,
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

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  console.log(article_id, "article_id in the controller");
  selectArticlebyId(article_id)
    .then((article) => {
      console.log(article, "in the controller");
      res.status(200).send({ article: article });
    })
    .catch((err) => {
      console.log(err, "<< err in getArticleById controller");
      next(err);
    });
};
