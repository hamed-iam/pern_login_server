const router = require('express').Router();
const pool = require('../db');
const bcrypt = require('bcrypt');
const jwtGenerator = require('../utils/jwtGenerator');
const authorization = require('../middleware/authorization');
const validInfo = require('../middleware/validInfo');
router.post('/register', validInfo, async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const user = await pool.query('SELECT * FROM users WHERE user_email = $1', [
      email,
    ]);

    if (user.rows.length !== 0) {
      return res.status(401).json('User Already exists !');
    }

    const saltRound = 10;
    const salt = await bcrypt.genSalt(saltRound);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await pool.query(
      'INSERT INTO users(user_name,user_email,user_password) VALUES($1,$2,$3) RETURNING *',
      [name, email, hashedPassword]
    );

    const token = jwtGenerator(newUser.rows[0].user_id);

    return res.status(201).json({ token });
  } catch (err) {
    console.error(err.message);
    res.status(500).json('Server Error');
  }
});

router.post('/login', validInfo, async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await pool.query('SELECT * FROM users WHERE user_email = $1', [
      email,
    ]);

    if (user.rows.length === 0) {
      return res.status(401).json('User Does Not Exist');
    }

    const validPassword = await bcrypt.compare(
      password,
      user.rows[0].user_password
    );

    console.log(validPassword);
    if (!validPassword) {
      return res.status(401).json('Incorrect Email Or Password !');
    }

    const token = jwtGenerator(user.rows[0].user_id);

    res.json({ token });
  } catch (err) {
    console.error(err.message);
    res.status(500).json('Server Error');
  }
});

router.get('/is-verify', authorization, async (req, res) => {
  try {
    res.json(true);
  } catch (err) {
    console.error(err.message);
    res.status(500).json('Server Error');
  }
});

module.exports = router;
