const pool = require("../config/db");

exports.getTheatres = async (req, res) => {
  let conn;

  try {
    conn = await pool.getConnection();

    const theatres = await conn.query("SELECT * FROM theatres");

    res.json(theatres);
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    if (conn) conn.release();
  }
};