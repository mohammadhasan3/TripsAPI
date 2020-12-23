const express = require("express");
const upload = require("../middleware/multer");
const passport = require("passport");
const router = express.Router();
const {
  tripsList,
  fetchTrip,
  tripUpdate,
} = require("../controllers/tripController");

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

//Update Trip
router.put(
  "/:tripId",
  upload.single("image"),
  passport.authenticate("jwt", { session: false }),
  tripUpdate
);

module.exports = router;
