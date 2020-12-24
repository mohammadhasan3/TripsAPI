const express = require("express");
const upload = require("../middleware/multer");
const router = express.Router();
const passport = require("passport");
const {
  profileUpdate,
  profilesList,
} = require("../controllers/profileController");

//Get Profiles
router.get("/", profilesList);

// Edit Profile
router.put(
  "/:profileId",
  passport.authenticate("jwt", { session: false }),
  upload.single("image"),
  profileUpdate
);

module.exports = router;
