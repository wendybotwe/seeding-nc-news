const db = require("../../db/connection.js");

exports.selectTopics = () => {
  return db
    .query("SELECT topics.slug, topics.description FROM topics")
    .then(({ rows }) => {
      console.log(rows, "<<< rows in the model");
      return rows;
    });
};
