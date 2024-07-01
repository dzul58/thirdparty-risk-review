const bcrypt = require("bcrypt");

function createHash(text) {
  const saltRounds = 10; 
  return bcrypt.hashSync(text, saltRounds);
}

function compareTextWithHash(text, hashedPassword) {
  return bcrypt.compareSync(text, hashedPassword);
}

module.exports = { createHash, compareTextWithHash };