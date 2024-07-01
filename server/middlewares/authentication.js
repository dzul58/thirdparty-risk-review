const { verifyToken } = require("../helpers/jwt");
const pool = require("../config/config");

const authentication = async (req, res, next) => {
  try {
    const { authorization } = req.headers;

    if (!authorization) {
      throw new Error('Authorization header is missing');
    }

    const accessToken = authorization.split(" ")[1];

    if (!accessToken) {
      throw new Error('Token is missing');
    }

    const jwtPayload = verifyToken(accessToken);
    const result = await pool.query('SELECT * FROM vendor_user_accounts WHERE username = $1', [username]);
    const user = result.rows[0];

    if (!user) {
      throw new Error('User not found');
    }

    req.userAccount = {
      username: user.username,
      vendor: user.cpdt_name 
    };

    console.log(req.userAccount, "ini isinya");

    next();
  } catch (error) {
    console.error('Authentication error:', error.message);
    res.status(401).json({ error: 'Unauthorized' });
  }
};

module.exports = authentication;
