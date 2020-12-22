const express = require("express");
const passport = require("passport");
const { signup, usersList, signin } = require("../controllers/userController");
const router = express.Router();

//Sign up
router.post("/signup", signup);

//Users list
router.get("/", usersList);

//Sign in
router.post(
  "/signin",
  passport.authenticate("local", { session: false }),
  signin
);
module.exports = router;
