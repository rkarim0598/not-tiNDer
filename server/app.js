let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');
let cors = require('cors');
let graphqlHTTP = require('express-graphql');
const { graphqlUploadExpress: graphqlUpload } = require('graphql-upload')
const exjwt = require('express-jwt');
let schema = require('./schema');
let root = require('./root');
let Photo = require('./models/photo');
const oracledb = require('oracledb');
const dbConfig = require('./dbconfig');
require('dotenv').config();

var app = express();

const jwtMW = exjwt({
  secret: 'shouldchangethis',
  credentialsRequired: false, // if set to true then EVERY query is authenticated
  getToken: function getTokenFromCookie(req) {
    return req.cookies['jwtAuth'];
  }
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cookieParser());

app.use(jwtMW);
app.use(cors({origin: process.env.VUE_APP_DOMAIN, credentials: true}));
app.use('/graphql', graphqlUpload({ maxFileSize: 10000000, maxFiles: 10 }), graphqlHTTP((req, res) => ({
  schema: schema,
  rootValue: root,
  graphiql: true,
  context: { // theoretically should pass user info to server after logged in
    req,
    res,
    user: !!req ? !!req.user ? req.user.id : undefined : undefined
  }
})));

app.get('/photo/:photo_id', async function (req, res) {
  let connection = await oracledb.getConnection(dbConfig);
  const result = await Photo.findById(req.params.photo_id, connection);
  if(!result) {
    res.set(400);
    res.end();
  }
  res.set("Content-Type", result.mimetype);
  res.set(200);
  for await(let chunk of result.photo) {
    res.write(chunk);
  }
  res.end();
  await connection.close();
})

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
