const db = require("../connection");
const format = require("pg-format");
const { convertTimestampToDate, createRef } = require("./utils.js");

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
  username VARCHAR(50) NOT NULL PRIMARY KEY UNIQUE,
  name VARCHAR(100) NOT NULL,
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
      const formattedTopics = topicData.map((topic) => {
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
      const formattedUsers = userData.map((user) => {
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
      const formattedArticles = articleData.map((article) => {
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
  VALUES %L RETURNING *;`,
        formattedArticles
      );
      return db.query(insertArticlesQuery);
    })
    .then((result) => {
      const articlesRefObject = createRef(result.rows);
      const formattedComments = commentData.map((comment) => {
        const commentCorrected = convertTimestampToDate(comment);
        return [
          articlesRefObject[comment.article_title],
          commentCorrected.body,
          commentCorrected.votes,
          commentCorrected.author,
          commentCorrected.created_at,
        ];
      });
      const insertCommentsQuery = format(
        `INSERT INTO comments
    (article_id, body, votes, author, created_at)
    VALUES %L`,
        formattedComments
      );
      return db.query(insertCommentsQuery);
    })
    .then(() => {
      console.log("Seed complete");
    });
};

module.exports = seed;
