require('dotenv').config();

const express = require('express');
const http = require('http');
const morgan = require('morgan');

const session = require('cookie-session');
const { auth, requiresAuth } = require('express-openid-connect');

const app = express();

app.set('view engine', 'ejs');

app.use(morgan('combined'));

app.use(express.urlencoded({
  extended: false
}));

app.use(session({
  name: process.env.SESSION_NAME,
  secret: process.env.COOKIE_SECRET
}));

app.use(auth({
  required: false
}));

app.get('/', (req, res) => {
  res.render('home', { user: req.openid && req.openid.user });
});

app.get('/expenses', requiresAuth(), (req, res) => {
  res.render('expenses', {
    expenses: [
      {
        date: new Date(),
        description: 'Coffee for a Coding Dojo session.',
        value: 42,
      }
    ]
  });
});

http.createServer(app).listen(process.env.PORT, () => {
  console.log(`listening on http://localhost:${process.env.PORT}`);
});
