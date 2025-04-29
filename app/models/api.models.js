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

exports.selectArticleById = (articleId) => {
  return db
    .query("SELECT * FROM articles WHERE article_id = $1", [articleId])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: `No article found for article_id: ${articleId}`,
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
        msg: `No article or comments found for article_id: ${articleId}`,
      });
    } else {
      return rows;
    }
  });
};
