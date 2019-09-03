require('dotenv').config();

const express = require('express');
const http = require('http');
const morgan = require('morgan');

const app = express();

app.set('view engine', 'ejs');

app.use(morgan('combined'));

app.get('/', (req, res) => {
  res.render('home');
});

app.get('/expenses', (req, res) => {
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
