const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const reservationController = require("../controllers/reservationController");

router.post("/", authMiddleware, reservationController.createReservation);
router.get("/my", authMiddleware, reservationController.getMyReservations);
router.put("/:id/cancel", authMiddleware, reservationController.cancelReservation);
router.get("/stats", authMiddleware, reservationController.getReservationStats);

module.exports = router;