var BigNumber = require('bignumber.js');
var bodyParser = require('body-parser');
var express = require('express');
var app = express();
var validateLoan = require('./validateLoan');
var LoanDAO = require('./loanDAO');

var session = require('express-session');
var cookieParser = require('cookie-parser');
var flash = require('connect-flash');

var sessionStore = new session.MemoryStore();

app.use(cookieParser('81503F44-1D9A-4DB5-8A03-E70EF379C64C'));
app.use(session({
    cookie: { maxAge: 60000 },
    store: sessionStore,
    saveUninitialized: true,
    resave: 'true',
    secret: '81503F44-1D9A-4DB5-8A03-E70EF379C64C'
}));
app.use(flash());


app.set('view engine', 'pug');

var blankForm = { error: {}, value: {} };
var loanDAO = new LoanDAO();

app.get('/', function(req, res, next) {
  loanDAO.find(function(err, loans) {
    if (err) return next(err);

    res.render('dashboard', {
      loans: loans, 
      message: req.flash('message')[0]
    });
  });
});

app.get('/loan', function(req, res) {
  res.render('loan', blankForm);
});

var parseUrlEncoded = bodyParser.urlencoded({extended: false});
app.post('/loan', parseUrlEncoded, function(req, res, next) {
  var locals = { error: validateLoan(req.body), value: req.body };

  if (!Object.keys(locals.error).length) {
    loanDAO.save(req.body, function(err) {
      if (err) return next(err);

      req.flash('message', 'Loan request successfully saved.');
      res.redirect('/');
    });
  } else {
    res.render('loan', locals);
  }
});

module.exports = app;