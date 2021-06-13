const router = require('express').Router();
const pool = require('../db');
const authorization = require('../middleware/authorization');

router.get('/', authorization, async (req, res) => {
  try {
    const user = await pool.query(
      'SELECT user_name FROM users WHERE user_id = $1',
      [req.user]
    );

    res.status(200).json({
      message: ` Welcome To Your Dashboard ${user.rows[0].user_name}`,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json('server Error');
  }
});

module.exports = router;
