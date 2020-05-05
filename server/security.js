const exjwt = require('express-jwt');
let cookieParser = require('cookie-parser');
require('dotenv').config();

module.exports = {
  /**
   * Handles parsing the cookie header provided in HTTP requests
   */
  cookieParser: cookieParser(),
  /**
   * Loads the user data stored in the JWT cookie
   */
  jwtMW: exjwt({
    secret: process.env.JWT_SECRET,
    credentialsRequired: false, // if set to true then EVERY query is authenticated
    getToken: function getTokenFromCookie(req) {
      return req.cookies['jwtAuth'];
    }
  }),
}