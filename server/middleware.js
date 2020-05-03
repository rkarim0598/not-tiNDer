const exjwt = require('express-jwt');
let cookieParser = require('cookie-parser');

module.exports = { 
  jwtMW: exjwt({
    secret: 'shouldchangethis',
    credentialsRequired: false, // if set to true then EVERY query is authenticated
    getToken: function getTokenFromCookie(req) {
      return req.cookies['jwtAuth'];
    }
  }),
  cookieParser: cookieParser()
}