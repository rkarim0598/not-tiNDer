#!/usr/bin/env node

/**
 * Module dependencies.
 */
var app = require('./app');
var debug = require('debug')('test-dir:server');
var http = require('http');

/**
 * Get port from environment and store in Express.
 */
var port = normalizePort(process.env.PORT);
app.set('port', port);

/**
 * Create HTTP server.
 */
var server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port);
console.log(`Serving at http://localhost:${process.env.PORT}`);

/**
 * Subscription dependencies
 */
const { SubscriptionServer } = require('subscriptions-transport-ws');
const { execute, subscribe } = require('graphql');
const schema = require('./schema');
const root = require('./root');
const {jwtMW, cookieParser} = require('./security');

/**
 * Subscriptions set-up
 */
new SubscriptionServer({
  execute,
  subscribe,
  schema,
  rootValue: root,
  onConnect: async (connectionParams, webSocket, context) => {
    let request = context.request;
    // resolve jwt token and pass along to subscription resolvers
    return await new Promise((resolve) => {
      cookieParser(request, null, () => {
        jwtMW(request, null, () => {
          resolve({user: request.user});
        });
      });
    });
  }
}, {
  server: server,
  path: '/subscriptions',
});

/**
 * Normalize a port into a number, string, or false.
 */
function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}