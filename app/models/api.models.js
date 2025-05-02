const db = require("../../db/connection.js");

exports.selectTopics = () => {
  return db
    .query("SELECT topics.slug, topics.description FROM topics")
    .then(({ rows }) => {
      return rows;
    });
};

exports.selectArticles = (sort_by, order, topic) => {
  const validSortColumns = [
    "article_id",
    "title",
    "topic",
    "author",
    "created_at",
    "votes",
    "comment_count",
  ];
  const validOrders = ["asc", "desc"];

  order = order || "desc";
  sort_by = sort_by || "created_at";

  if (!validSortColumns.includes(sort_by)) {
    return Promise.reject({ status: 400, msg: "Invalid sort_by query" });
  }

  if (!validOrders.includes(order.toLowerCase())) {
    return Promise.reject({ status: 400, msg: "Invalid order query" });
  }
  const queryValues = [];
  let queryStr = `SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.comment_id)::INT AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id`;

  if (topic) {
    queryStr += ` WHERE articles.topic =$1 `;
    queryValues.push(topic);
  }

  queryStr += ` GROUP BY articles.article_id, articles.title, articles.topic, articles.author,articles.created_at, articles.votes,articles.article_img_url `;

  const queryStrPlus = `SELECT * FROM (${queryStr}) AS article_data ORDER BY "${sort_by}" ${order.toUpperCase()}
  `;
  return db.query(queryStrPlus, queryValues).then(({ rows }) => {
    if (rows.length === 0 && topic) {
      return db
        .query("SELECT * FROM topics WHERE slug = $1", [topic])
        .then(({ rows: topicRows }) => {
          if (topicRows.length === 0) {
            return Promise.reject({ status: 404, msg: "Topic not found." });
          } else {
            return [];
          }
        });
    }

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

exports.selectUserByUsername = (username) => {
  return db
    .query("SELECT username, avatar_url, name FROM users WHERE username = $1", [
      username,
    ])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "No user found.",
        });
      } else {
        return rows[0];
      }
    });
};

exports.selectArticleById = (articleId) => {
  return db
    .query(
      "SELECT articles.*, COUNT(comments.comment_id):: INT AS comment_count FROM articles LEFT JOIN comments on articles.article_id = comments.article_id WHERE articles.article_id = $1 GROUP BY articles.article_id",
      [articleId]
    )
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
