var express = require('express');
var app = express();
var LoanDAO = require('./loanDAO');
var validateLoan = require('./validateLoan');

module.exports = app;

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

app.post('/loan', function(req, res, next) {
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
