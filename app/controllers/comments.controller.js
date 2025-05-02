// const endpoints = require("../../endpoints.json");
const { deleteComment } = require("../models/api.models.js");

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
