const db = require("../../db/connection.js");

exports.selectTopics = () => {
  return db
    .query("SELECT topics.slug, topics.description FROM topics")
    .then(({ rows }) => {
      return rows;
    });
};

exports.selectArticles = () => {
  return db
    .query(
      "SELECT articles.article_id, articles.title, articles.topic, articles.author,articles.created_at, articles.votes,articles.article_img_url, COUNT(comments.comment_id)::INT AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id GROUP BY articles.article_id ORDER BY articles.created_at DESC"
    )
    .then(({ rows }) => {
      rows.forEach((row) => delete row.body);
      return rows;
    });
};

exports.selectUsers = () => {
  return db
    .query("SELECT users.username, users.name, users.avatar_url FROM users")
    .then(({ rows }) => {
      return rows;
    });
};

exports.selectArticleById = (articleId) => {
  return db
    .query("SELECT * FROM articles WHERE article_id = $1", [articleId])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "No article found.",
        });
      } else {
        return rows[0];
      }
    });
};

exports.selectArticleCommentsByArticleId = (articleId) => {
  const queryStr =
    "SELECT comment_id, votes, created_at, author, body, article_id FROM comments WHERE article_id = $1 ORDER BY created_at DESC";
  return db.query(queryStr, [articleId]).then(({ rows }) => {
    if (rows.length === 0) {
      return Promise.reject({
        status: 404,
        msg: "No article Found.",
      });
    } else {
      return rows;
    }
  });
};
exports.insertComment = (article_id, username, body) => {
  return db
    .query(
      `INSERT INTO comments (article_id, author, body) VALUES ($1, $2, $3) RETURNING *`,
      [article_id, username, body]
    )
    .then(({ rows }) => {
      return rows[0];
    })
    .catch((err) => {
      return Promise.reject(err);
    });
};

exports.updateVotesByArticleId = (article_id, inc_votes) => {
  return db
    .query(
      "UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *",
      [inc_votes, article_id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Article not found." });
      }
      return rows[0];
    });
};

exports.deleteComment = (comment_id) => {
  return db
    .query("DELETE FROM comments WHERE comment_id = $1 RETURNING *", [
      comment_id,
    ])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Comment not found." });
      }
    });
};
