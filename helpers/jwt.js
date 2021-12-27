const jwt = require("express-jwt");
require("dotenv/config");
const api = process.env.API;

function auth() {
  return jwt({
    secret: process.env.SECRET,
    algorithms: ["HS256"],
  }).unless({
    path: [
      `${api}/users/login`,
      `${api}/users/register`,
      `${api}/users/forget-password`,
      /\/api\/v1\/users\/reset-password(.*)/,
      { url: /\/public\/uploads(.*)/, methods: ["GET", "OPTIONS"] },
    ],
  });
}

module.exports = auth;
