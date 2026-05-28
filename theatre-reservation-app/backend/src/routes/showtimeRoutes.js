const express = require("express");
const router = express.Router();
const showtimeController = require("../controllers/showtimeController");

router.get("/:showId", showtimeController.getShowtimesByShow);

module.exports = router;