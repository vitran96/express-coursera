var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var FileStore = require('session-file-store')(session);
var passport = require('passport');
var authenticate = require('./authenticate');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const dishRouter = require('./routes/dishRouter');
const promoRouter = require('./routes/promoRouter');
const leaderRouter = require('./routes/leaderRouter');

const mongoose = require('mongoose');

const URL = 'mongodb://localhost:27017/conFusion';
const connect = mongoose.connect(URL);

const SECRET = '12345-67890-09876-54321';

connect.then(db => {
  console.log("Connected to database");
}, err => console.log(error));

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(session({
  name: 'session-id'
  , secret: SECRET
  , saveUninitialized: false
  , resave: false
  , store: new FileStore()
}))

app.use(passport.initialize());
app.use(passport.session());

const auth = (req, res, next) => {
  // console.log(req.user);

  if (!req.user) {
    var err = Error('You are not authenticated!');
    err.status = 403;
    next(err);
  } else {
    next();
  }
}

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/dishes', auth, dishRouter);
app.use('/promotions', auth, promoRouter);
app.use('/leaders', auth, leaderRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
