const { Pool } = require("pg");

const ENV = process.env.NODE_ENV || "development";

const path = `./.env.${ENV}`;

const dotenv = require("dotenv").config({ path: path });
console.log(process.env.PGDATABASE);

if (!process.env.PGDATABASE) {
  throw new Error("No PGDATABASE configured");
}
const db = new Pool();

// Get all of the users
db.query("SELECT users.name FROM users")
  .then((data) => {
    console.log(data.rows);
  })
  .catch((err) => {
    console.log(err);
  });

// Get all of the articles where the topic is coding
db.query("SELECT * FROM topics where slug='coding'")
  .then((data) => {
    console.log(data.rows);
  })
  .catch((err) => {
    console.log(err);
  });

// Get all of the comments where the votes are less than zero
db.query("SELECT comments.body, comments.votes FROM comments where votes <0")
  .then((data) => {
    console.log(data.rows);
  })
  .catch((err) => {
    console.log(err);
  });
// Get all of the topics
db.query("SELECT topics.slug FROM topics")
  .then((data) => {
    console.log(data.rows);
  })
  .catch((err) => {
    console.log(err);
  });
// Get all of the articles by user grumpy19
db.query("SELECT articles.title FROM articles WHERE articles.author='grumpy19'")
  .then((data) => {
    console.log(data.rows);
  })
  .catch((err) => {
    console.log(err);
  });
// Get all of the comments that have more than 10 votes
db.query("SELECT comments.body, comments.votes FROM comments WHERE votes>10")
  .then((data) => {
    console.log(data.rows);
  })
  .catch((err) => {
    console.log(err);
  });

module.exports = db;
