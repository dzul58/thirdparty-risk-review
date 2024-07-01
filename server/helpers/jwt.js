const jwt = require("jsonwebtoken");

const jwtSecret = 'ThirdPartyRiskReview';
const signToken = (payload) => {
  return jwt.sign(payload, jwtSecret);
};

const verifyToken = (token) => {
  return jwt.verify(token, jwtSecret);
};

module.exports = { signToken, verifyToken };
