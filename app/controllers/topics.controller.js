// const endpoints = require("../../endpoints.json");
const { selectTopics } = require("../models/api.models.js");

exports.getTopics = (req, res, next) => {
  return selectTopics()
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch((err) => {
      next(err);
    });
};
