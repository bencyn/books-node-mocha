var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

const MongoClient= require('mongodb').MongoClient;
// connect URL
const url = 'mongodb://localhost:27017';
const dbName ='booksdb';

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// register your middleware for initiating global
// mongo db connection object.


app.use(function(req,res,next){
  if(!app.db){
    console.log("Connected correctly to server");
    MongoClient.connect(url).then(client =>{
      console.log("Connnected correctly to server");
      const db = client.db(dbName);
      console.log("Getting the DB object");
      app.db = db;
      next()
    },error =>{
      console.log(error)
      next()
    });
  }else{
    next()
  }
})



module.exports = app;
