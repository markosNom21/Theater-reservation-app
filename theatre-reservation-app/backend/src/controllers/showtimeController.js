const pool = require("../config/db");

exports.getShowtimesByShow = async (req, res) => {
  let conn;

  try {
    const { showId } = req.params;

    conn = await pool.getConnection();

    const showtimes = await conn.query(
  `
  SELECT 
    st.showtime_id,
    st.show_id,
    st.show_date,
    st.show_time,
    st.hall,
    st.price,
    s.title AS show_title
  FROM showtimes st
  JOIN shows s ON st.show_id = s.show_id
  WHERE st.show_id = ?
    AND st.show_date >= CURDATE()
  ORDER BY st.show_date, st.show_time
  `,
  [showId]
);

    res.json(showtimes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    if (conn) conn.release();
  }
};