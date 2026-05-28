const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

const theatreRoutes = require("./routes/theatreRoutes");
app.use("/api/theatres", theatreRoutes);

const showRoutes = require("./routes/showRoutes");
app.use("/api/shows", showRoutes);

const showtimeRoutes = require("./routes/showtimeRoutes");
app.use("/api/showtimes", showtimeRoutes);

const seatRoutes = require("./routes/seatRoutes");
app.use("/api/seats", seatRoutes);

const reservationRoutes = require("./routes/reservationRoutes");
app.use("/api/reservations", reservationRoutes);

app.get("/", (req, res) => {
  res.send("Theatre Reservation API is running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});