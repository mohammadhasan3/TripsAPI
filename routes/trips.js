const express = require("express");
const upload = require("../middleware/multer");
const passport = require("passport");

const router = express.Router();
const {
  tripsList,
  fetchTrip,
  tripCreate,
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

//Trip create
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  upload.single("image"),
  tripCreate
);

//Read Trip
router.get("/", tripsList);

module.exports = router;
