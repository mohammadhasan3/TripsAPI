const express = require("express");
const router = express.Router();
const passport = require("passport");
const { signup, usersList, signin } = require("../controllers/userController");

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
