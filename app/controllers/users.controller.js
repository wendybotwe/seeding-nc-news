// const endpoints = require("../../endpoints.json");
const { selectUsers } = require("../models/api.models.js");

exports.getUsers = (req, res, next) => {
  return selectUsers()
    .then((users) => {
      res.status(200).send({ users });
    })
    .catch((err) => {
      next(err);
    });
};
