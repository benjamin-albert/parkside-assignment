var bodyParser = require('body-parser');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var flash = require('connect-flash');
var express = require('express');
var app = express();

var routes = require('./routes');

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
app.use(bodyParser.urlencoded({extended: false}));
app.set('view engine', 'pug');

app.use( routes );

module.exports = app;