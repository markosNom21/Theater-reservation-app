const pool = require("../config/db");

exports.getShows = async (req, res) => {
  let conn;

  try {
    const { theatreId } = req.query;

    conn = await pool.getConnection();

    let query = `
      SELECT s.*, t.name AS theatre_name
      FROM shows s
      JOIN theatres t ON s.theatre_id = t.theatre_id
    `;

    let params = [];

    if (theatreId) {
      query += " WHERE s.theatre_id = ?";
      params.push(theatreId);
    }

    const shows = await conn.query(query, params);

    res.json(shows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    if (conn) conn.release();
  }
};