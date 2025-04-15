const db = require("../connection");
const topics = require("../data/test-data/topics.js");
const users = require("../data/test-data/users.js");
const articles = require("../data/test-data/articles.js");
const comments = require("../data/test-data/comments.js");
const format = require("pg-format");
const { convertTimestampToDate } = require("./utils.js");
// const format =

const seed = ({ topicData, userData, articleData, commentData }) => {
  return db
    .query(`DROP TABLE IF EXISTS comments;`)
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS articles;`);
    })
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS users;`);
    })
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS topics;`);
    })
    .then(() => {
      return db.query(
        `CREATE TABLE topics(
  description VARCHAR(200) NOT null,
  slug VARCHAR(50) PRIMARY KEY,
  img_url VARCHAR(1000)
  );`
      );
    })
    .then(() => {
      return db.query(
        `CREATE TABLE users(
  username VARCHAR(50) NOT NULL PRIMARY KEY,
  name VARCHAR(100),
  avatar_url VARCHAR(1000)
  );`
      );
    })
    .then(() => {
      return db.query(
        `CREATE TABLE articles(
  article_id SERIAL PRIMARY KEY,
  title VARCHAR(100),
  topic VARCHAR(100),
  FOREIGN KEY (topic) REFERENCES topics(slug),
  author VARCHAR(100),
  FOREIGN KEY (author) REFERENCES users(username),
  body TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  votes INT DEFAULT 0,
  article_img_url VARCHAR(1000)
  )`
      );
    })
    .then(() => {
      return db.query(
        `CREATE TABLE comments(
  comment_id SERIAL PRIMARY KEY,
  article_id INT,
  FOREIGN KEY (article_id) REFERENCES articles(article_id),
  body TEXT,
  votes INT DEFAULT 0,
  author VARCHAR(100),
  FOREIGN KEY (author) REFERENCES users(username),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`
      );
    })
    .then(() => {
      const formattedTopics = topics.map((topic) => {
        return [topic.description, topic.slug, topic.img_url];
      });
      const insertTopicsQuery = format(
        `INSERT INTO topics
  (description, slug, img_url)
  VALUES %L`,
        formattedTopics
      );
      return db.query(insertTopicsQuery);
    })
    .then(() => {
      const formattedUsers = users.map((user) => {
        return [user.username, user.name, user.avatar_url];
      });
      const insertUsersQuery = format(
        `INSERT INTO users
  (username, name, avatar_url)
  VALUES %L`,
        formattedUsers
      );
      return db.query(insertUsersQuery);
    })
    .then(() => {
      const formattedArticles = articles.map((article) => {
        const articleCorrected = convertTimestampToDate(article);
        return [
          articleCorrected.title,
          articleCorrected.topic,
          articleCorrected.author,
          articleCorrected.body,
          articleCorrected.created_at,
          articleCorrected.votes,
          articleCorrected.article_img_url,
        ];
      });
      const insertArticlesQuery = format(
        `INSERT INTO articles
  (title, topic, author, body, created_at, votes, article_img_url)
  VALUES %L`,
        formattedArticles
      );
      return db.query(insertArticlesQuery);
    })
    .then(() => {
      return db.query(`SELECT article_id, title FROM articles;`);
    })
    .then((article_data) => {
      const articleData = {};
      article_data.rows.forEach((row) => {
        articleData[row.title] = row.article_id;
      });
      const formattedComments = comments.map((comment) => {
        const commentsCorrected = convertTimestampToDate(comment);
        return [
          articleData[commentsCorrected.belongs_to],
          commentsCorrected.body,
          commentsCorrected.votes,
          commentsCorrected.author,
          commentsCorrected.created_at,
        ];
      });
      console.log(formattedComments);
      const insertCommentsQuery = format(
        `INSERT INTO comments
  (article_id, body, votes, author, created_at)
  VALUES %L`,
        formattedComments
      );
      return db.query(insertCommentsQuery);
    });
};

module.exports = seed;
