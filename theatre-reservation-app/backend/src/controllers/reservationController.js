const pool = require("../config/db");

exports.createReservation = async (req, res) => {
  let conn;

  try {
    const userId = req.user.userId;
    const { showtimeId, seatIds } = req.body;

    if (!showtimeId || !seatIds || seatIds.length === 0) {
      return res.status(400).json({ error: "Showtime and seats are required" });
    }

    conn = await pool.getConnection();
    await conn.beginTransaction();

    const selectedSeats = await conn.query(
      `
      SELECT seat_id, is_reserved
      FROM seats
      WHERE showtime_id = ?
      AND seat_id IN (?)
      FOR UPDATE
      `,
      [showtimeId, seatIds]
    );

    if (selectedSeats.length !== seatIds.length) {
      await conn.rollback();
      return res.status(400).json({ error: "Some seats do not exist" });
    }

    const alreadyReserved = selectedSeats.some((seat) =>
      Boolean(seat.is_reserved)
    );

    if (alreadyReserved) {
      await conn.rollback();
      return res.status(400).json({ error: "Some seats are already reserved" });
    }

    const priceRows = await conn.query(
      "SELECT price FROM showtimes WHERE showtime_id = ?",
      [showtimeId]
    );

    if (priceRows.length === 0) {
      await conn.rollback();
      return res.status(400).json({ error: "Showtime not found" });
    }

    const price = Number(priceRows[0].price);
    const totalPrice = price * seatIds.length;

    const result = await conn.query(
      `
      INSERT INTO reservations (user_id, showtime_id, total_price)
      VALUES (?, ?, ?)
      `,
      [userId, showtimeId, totalPrice]
    );

    const reservationId = Number(result.insertId);

    for (const seatId of seatIds) {
      await conn.query(
        `
        INSERT INTO reservation_seats (reservation_id, seat_id)
        VALUES (?, ?)
        `,
        [reservationId, seatId]
      );

      await conn.query(
        `
        UPDATE seats
        SET is_reserved = TRUE
        WHERE seat_id = ?
        `,
        [seatId]
      );
    }

    await conn.commit();

    res.status(201).json({
      message: "Reservation created successfully",
      reservationId,
      totalPrice,
    });
  } catch (err) {
    if (conn) await conn.rollback();
    res.status(500).json({ error: err.message });
  } finally {
    if (conn) conn.release();
  }
};

exports.getMyReservations = async (req, res) => {
  let conn;

  try {
    const userId = req.user.userId;

    conn = await pool.getConnection();

    const reservations = await conn.query(
      `
      SELECT
        r.reservation_id,
        r.total_price,
        r.status,
        r.created_at,

        st.showtime_id,
        st.show_date,
        st.show_time,
        st.hall,
        st.price,

        s.show_id,
        s.title AS show_title,

        t.name AS theatre_name,
        t.location AS theatre_location,

        GROUP_CONCAT(
          CONCAT(se.seat_row, se.seat_number)
          ORDER BY se.seat_row, se.seat_number
          SEPARATOR ', '
        ) AS seats

      FROM reservations r
      JOIN showtimes st ON r.showtime_id = st.showtime_id
      JOIN shows s ON st.show_id = s.show_id
      JOIN theatres t ON s.theatre_id = t.theatre_id
      JOIN reservation_seats rs ON r.reservation_id = rs.reservation_id
      JOIN seats se ON rs.seat_id = se.seat_id

      WHERE r.user_id = ?

      GROUP BY r.reservation_id
      ORDER BY r.created_at DESC
      `,
      [userId]
    );

    res.json(reservations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    if (conn) conn.release();
  }
};

exports.cancelReservation = async (req, res) => {
  let conn;

  try {
    const userId = req.user.userId;
    const { id } = req.params;

    conn = await pool.getConnection();
    await conn.beginTransaction();

    const reservationRows = await conn.query(
      `
      SELECT reservation_id, status
      FROM reservations
      WHERE reservation_id = ?
      AND user_id = ?
      `,
      [id, userId]
    );

    if (reservationRows.length === 0) {
      await conn.rollback();
      return res.status(404).json({ error: "Reservation not found" });
    }

    if (reservationRows[0].status === "CANCELLED") {
      await conn.rollback();
      return res.status(400).json({ error: "Reservation is already cancelled" });
    }

    const seatRows = await conn.query(
      `
      SELECT seat_id
      FROM reservation_seats
      WHERE reservation_id = ?
      `,
      [id]
    );

    for (const seat of seatRows) {
      await conn.query(
        `
        UPDATE seats
        SET is_reserved = FALSE
        WHERE seat_id = ?
        `,
        [seat.seat_id]
      );
    }

    await conn.query(
      `
      UPDATE reservations
      SET status = 'CANCELLED'
      WHERE reservation_id = ?
      `,
      [id]
    );

    await conn.commit();

    res.json({ message: "Reservation cancelled successfully" });
  } catch (err) {
    if (conn) await conn.rollback();
    res.status(500).json({ error: err.message });
  } finally {
    if (conn) conn.release();
  }
};

exports.getReservationStats = async (req, res) => {
  let conn;

  try {
    const userId = req.user.userId;

    conn = await pool.getConnection();

    const totalReservationsRows = await conn.query(
      `
      SELECT COUNT(*) AS total_reservations
      FROM reservations
      WHERE user_id = ?
      AND status = 'ACTIVE'
      `,
      [userId]
    );

    const totalSeatsRows = await conn.query(
      `
      SELECT COUNT(rs.seat_id) AS total_seats
      FROM reservations r
      JOIN reservation_seats rs ON r.reservation_id = rs.reservation_id
      WHERE r.user_id = ?
      AND r.status = 'ACTIVE'
      `,
      [userId]
    );

    const favoriteShowRows = await conn.query(
      `
      SELECT s.title AS favorite_show, COUNT(*) AS times_booked
      FROM reservations r
      JOIN showtimes st ON r.showtime_id = st.showtime_id
      JOIN shows s ON st.show_id = s.show_id
      WHERE r.user_id = ?
      AND r.status = 'ACTIVE'
      GROUP BY s.show_id, s.title
      ORDER BY times_booked DESC
      LIMIT 1
      `,
      [userId]
    );

    const favoriteTheatreRows = await conn.query(
      `
      SELECT t.name AS favorite_theatre, COUNT(*) AS times_booked
      FROM reservations r
      JOIN showtimes st ON r.showtime_id = st.showtime_id
      JOIN shows s ON st.show_id = s.show_id
      JOIN theatres t ON s.theatre_id = t.theatre_id
      WHERE r.user_id = ?
      AND r.status = 'ACTIVE'
      GROUP BY t.theatre_id, t.name
      ORDER BY times_booked DESC
      LIMIT 1
      `,
      [userId]
    );

    res.json({
      totalReservations: Number(totalReservationsRows[0].total_reservations),
      totalSeats: Number(totalSeatsRows[0].total_seats),
      favoriteShow: favoriteShowRows[0]?.favorite_show || "No favorite yet",
      favoriteTheatre:
        favoriteTheatreRows[0]?.favorite_theatre || "No favorite yet",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    if (conn) conn.release();
  }
};