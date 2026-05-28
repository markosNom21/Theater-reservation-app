const express = require("express");
const router = express.Router();
const seatController = require("../controllers/seatController");

router.get("/:showtimeId", seatController.getSeatsByShowtime);

module.exports = router;