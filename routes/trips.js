const express = require("express");
const upload = require("../middleware/multer");
const router = express.Router();
const { tripsList, fetchTrip } = require("../controllers/tripController");

router.param("tripId", async (req, res, next, tripId) => {
  const trip = await fetchTrip(tripId, next);
  if (trip) {
    req.trip = trip;
    next();
  } else {
    const err = new Error("Trip Not Found");
  }
});

//Read Trip
router.get("/", tripsList);

module.exports = router;
