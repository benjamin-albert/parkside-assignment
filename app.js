var BigNumber = require('bignumber.js');
var bodyParser = require('body-parser');
var express = require('express');
var app = express();
var Loan = require('./schemas/loan');

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

app.get('/', function(req, res, next) {
  Loan.find(function(err, loans) {
    if (err) {
      return next(err);
    }
// console.log(req.flash('message')[0]);
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
  var locals = { error: {} };
  locals.value = req.body;

  if (!req.body.amount) {
    locals.error.amount = 'You must enter an amount';
  } else if (Number(req.body.amount) != req.body.amount) {
    locals.error.amount = 'Amount must be a number';
  } else if (Number(req.body.amount) < 1) {
    locals.error.amount = 'You must enter an amount';
  }

  if (!req.body.value) {
    locals.error.value = 'You must enter a property value';
  } else if (Number(req.body.value) != req.body.value) {
    locals.error.value = 'Property value must be a number';
  } else if (Number(req.body.value) < 1) {
    locals.error.value = 'You must enter a property value';
  }

  if (!req.body.ssn) {
    locals.error.ssn = 'You must enter an SSN';
  } else if (!/^\d{3}-?\d{2}-?\d{4}$/.test(req.body.ssn)) {
    locals.error.ssn = 'You must enter a valid SSN';
  } else {
    var digitGroups = req.body.ssn.split('-');
    var validGroups = digitGroups.filter(function(group) {
      return !!(group.replace(/0/g, ''));
    });
    
    if (validGroups.length !== 3) {
      locals.error.ssn = 'SSN cannot have a group with just zeros';
    } else if (validGroups[0] >= 900 || validGroups[0] == 666) {
      locals.error.ssn = 'First group cannot start with 666 or 900-999';
    }
  }

  if (!Object.keys(locals.error).length) {
    // I prefer decimal arithmetic over floating point arithmetic
    // whenever money is involved.
    var approved = 
      new BigNumber(req.body.amount)
        .dividedBy(req.body.value)
        .gt(0.4);

    var loan = new Loan({
      amount: req.body.amount,
      value: req.body.value,
      ssn: req.body.ssn,
      status: approved ? 0 : 1
    });

    loan.save(function(err) {
      if (err) {
        return next(err);
      }

      // res.render('dashboard', locals);
      req.flash('message', 'Loan request successfully saved.');
      res.redirect('/');
    });
  } else {
    res.render('loan', locals);
  }
});

module.exports = app;