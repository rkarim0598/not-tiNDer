let createError = require('http-errors');
let express = require('express');
let path = require('path');
let logger = require('morgan');
let cors = require('cors');
let graphqlHTTP = require('express-graphql');
const { graphqlUploadExpress: graphqlUpload } = require('graphql-upload')
const {jwtMW, cookieParser} = require('./middleware');

let schema = require('./schema');
let root = require('./root');
let Photo = require('./models/photo');
const getConnection = require('./db/pool');
require('dotenv').config();

var app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cookieParser);
app.use(jwtMW);

const subscriptionsEndpoint = `ws://localhost:${process.env.PORT}/subscriptions`;

app.use(cors({origin: process.env.VUE_APP_DOMAIN, credentials: true}));
app.use('/graphql', graphqlUpload({ maxFileSize: 10000000, maxFiles: 10 }), graphqlHTTP((req, res) => ({
  schema: schema,
  rootValue: root,
  graphiql: true,
  subscriptionsEndpoint: subscriptionsEndpoint,
  context: {
    req,
    res,
    user: !!req ? !!req.user ? req.user.id : undefined : undefined
  }
})));

app.get('/photo/:photo_id', async function (req, res) {
  let connection;
  try {
    connection = await getConnection();
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
    result.photo.destroy();
    res.end();
  } finally {
    try {
        await connection.close();
    } catch (err) {
        console.error(err);
    }
  }
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
