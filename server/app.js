let createError = require('http-errors');
let express = require('express');
let path = require('path');
let logger = require('morgan');
let cors = require('cors');
const {jwtMW, cookieParser} = require('./security');
const schema = require('./schema');
const root = require('./root');
const graphqlHTTP = require('express-graphql');
const { graphqlUploadExpress: graphqlUpload } = require('graphql-upload');

require('dotenv').config();

var app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser);
app.use(jwtMW);
/**
 * Allow cross domain requests from the client
 */
app.use(cors({origin: process.env.VUE_APP_DOMAIN, credentials: true}));

/**
 * Set-up graphql endpoint
 */
const subscriptionsEndpoint = `ws://localhost:${process.env.PORT}/subscriptions`;
app.use('/graphql', graphqlUpload({ maxFileSize: 100000, maxFiles: 5 }), graphqlHTTP((req, res) => ({
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

module.exports = app;