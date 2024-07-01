const { compareTextWithHash, createHash } = require("../helpers/bcrypt");
const { signToken } = require("../helpers/jwt");
const poolNisa = require('../config/configNisa');
const pool = require('../config/config');

class LoginController {
  static async login(req, res, next) {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res.status(400).json({ error: "Username and password are required" });
      }

      const result = await pool.query('SELECT * FROM vendor_user_accounts WHERE username = $1', [username]);
      const user = result.rows[0];

      if (!user || !compareTextWithHash(password, user.password)) {
        return res.status(401).json({ error: "Invalid username or password" });
      }

      const payload = { vendor: user.cpdt_name, username: user.username };
      const accessToken = signToken(payload);

      res.json({ access_token: accessToken });
    } catch (error) {
      next(error);
    }
  }

  static async createVendorAccount(req, res, next) {
    try {
      const { username, password, cpdt_name } = req.body;

      if (!username || !password || !cpdt_name) {
        return res.status(400).json({ error: "Username, password, and cpdt_name are required" });
      }

      if (username.length > 50 || cpdt_name.length > 255) {
        return res.status(400).json({ error: "Username or cpdt_name exceeds maximum length" });
      }

      const hashedPassword = createHash(password);

      const result = await pool.query(
        'INSERT INTO vendor_user_accounts (username, password, cpdt_name) VALUES ($1, $2, $3) RETURNING *',
        [username, hashedPassword, cpdt_name]
      );

      const newUser = result.rows[0];

      res.status(201).json({
        message: "Vendor account created successfully",
        user: {
          username: newUser.username,
          cpdt_name: newUser.cpdt_name
        }
      });
    } catch (error) {
      if (error.code === '23505') { // unique constraint violation
        return res.status(409).json({ error: "Username already exists" });
      }
      next(error);
    }
  }


  // static async autoLogin(req, res, next) {
  //   try {
  //     const { username, password } = req.query;

  //     if (!username || !password) {
  //       return res.status(400).json({ error: "Username and password are required" });
  //     }

  //     const result = await poolNisa.query('SELECT * FROM mst_user WHERE muse_code = $1', [username]);
  //     const user = result.rows[0];

  //     if (!user || password !== user.muse_password) {
  //       return res.status(401).json({ error: "Invalid username or password" });
  //     }

  //     const payload = { email: user.muse_email};
  //     const accessToken = signToken(payload);

  //     res.json({ access_token: accessToken });
  //   } catch (error) {
  //     next(error);
  //   }
  // }
}

module.exports = LoginController;
