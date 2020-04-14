let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');
let cors = require('cors');
let graphqlHTTP = require('express-graphql');
const exjwt = require('express-jwt');
let schema = require('./schema');
let root = require('./root');
require('dotenv').config();

var app = express();

const jwtMW = exjwt({
  secret: 'shouldchangethis',
  credentialsRequired: false // if set to true then EVERY query is authenticated
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(jwtMW);
app.use(cors());
app.use('/graphql', graphqlHTTP(req => ({
  schema: schema,
  rootValue: root,
  graphiql: true,
  context: { // theoretically should pass user info to server after logged in
    user: req.user
  }
})));

module.exports = app;

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');

// app.use(logger('dev'));
// app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));

// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404));
// });

// // error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });
