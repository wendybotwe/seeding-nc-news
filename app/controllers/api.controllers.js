const endpoints = require("../../endpoints.json");
const { selectTopics } = require("../models/api.models.js");

exports.getApi = (req, res) => {
  res.status(200).send(endpoints);
};

exports.getTopics = (req, res, next) => {
  return selectTopics()
    .then((topics) => {
      console.log(topics, "<< topics in the controller");
      res.status(200).send({ topics });
    })
    .catch((err) => {
      console.log(err, "err in the controller");
      next(err);
    });
};
