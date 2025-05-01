# Welcome to NC News By Wendy

NC News by Wendy is a hosted backend database project created as part of the Northcoders Software Development Bootcamp. Users can view articles and view and create comments on those articles.

RESTful server made with Express.js using a postgres database. Created using TDD with Jest. Full list of endpoints is available in the endpoints.json file.

## Hosted version

https://nc-news-by-wendy.onrender.com

## Set up info

### Node

Install node.js

Minimum requirements: v23.9.0

(Check which version you currently have installed using `node -v`)

### Postgres

Minimum requirements: v8.13.3

(Check which version you currently have installed using `postgres -V`)

### GitHub

https://github.com/wendybotwe/seeding-nc-news

Clone this repo using

`git clone https://github.com/wendybotwe/seeding-nc-news`

### Install dependencies

`npm install`

### Create .env files

.env.test

`PGDATABASE=nc_news_test`

.env.development

`PGDATABASE=nc_news`

### Seed local database

To run the run-seed script (which calls the seed function with development data) use:

`npm run seed-dev`

### Run tests

`npm test`
