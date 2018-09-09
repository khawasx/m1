const express = require('express');
const path = require('path');
const nunjucks = require('nunjucks');
const bodyParser = require('body-parser');
const moment = require('moment');

const app = express();

nunjucks.configure('views', {
  autoescape: true,
  express: app,
});

app.set('view engine', 'njk');
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  res.render('main');
});

app.post('/check', (req, res) => {
  const { nome, idade } = req.body;

  if (moment().diff(moment(idade, 'YYYY-MM-DD'), 'years') > 18) {
    res.render('major', { nome, idade });
  } else {
    res.render('minor', { nome, idade });
  }
});

const dataMiddleware = (req, res, next) => {
  if (!req.body.nome || !req.body.idade) {
    res.redirect('/');
  } else {
    next();
  }
};

app.get('/major', dataMiddleware, (req, res) => {
  res.render('major');
});

app.get('/minor', dataMiddleware, (req, res) => {
  res.render('minor');
});

app.listen(3000);
