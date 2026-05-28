const pool = require("../config/db");

exports.getSeatsByShowtime = async (req, res) => {
  let conn;

  try {
    const { showtimeId } = req.params;

    conn = await pool.getConnection();

    const seats = await conn.query(
      `
      SELECT 
        seat_id,
        showtime_id,
        seat_row,
        seat_number,
        category,
        is_reserved
      FROM seats
      WHERE showtime_id = ?
      ORDER BY seat_row, seat_number
      `,
      [showtimeId]
    );

    res.json(seats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    if (conn) conn.release();
  }
};