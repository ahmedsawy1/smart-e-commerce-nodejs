const jwt = require("express-jwt");
require("dotenv/config");
const api = process.env.API;

function auth() {
  return jwt({
    secret: process.env.SECRET,
    algorithms: ["HS256"],
    // isRevoked: isRevoked,
  }).unless({
    path: [
      //   { url: "/api/v1/products", methods: ["GET", "OPTIONS"] },
      //   { url: /\/api\/v1\/products(.*)/, methods: ["GET", "OPTIONS"] },
      `${api}/users/login`,
    ],
  });
}

// async function isRevoked(req, payload, done) {
// if (!payload.isAdmin) {
//     done(null, true);
// }
// done();
// }

module.exports = auth;
