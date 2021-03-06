const express = require("express");
const db = require("./db/models");
const bodyParser = require("body-parser");
const passport = require("passport");
const { localStrategy, jwtStrategy } = require("./middleware/passport");
const tripRoutes = require("./routes/trips");
const userRoutes = require("./routes/users");
const profileRoutes = require("./routes/profiles");
const cors = require("cors");
const app = express();
const path = require("path");

//Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(passport.initialize()); //Passport setup
passport.use(localStrategy);
passport.use(jwtStrategy);

//Routes
app.use("/trips", tripRoutes);
app.use(userRoutes);
app.use("/profiles", profileRoutes);
app.use("/media", express.static(path.join(__dirname, "media")));

app.use((req, res, next) => {
  res.status(404).json({ message: "Path not found" });
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    message: err.message || "Internal Server Error",
  });
});

const run = async () => {
  try {
    await db.sequelize.sync({ alter: true });
    // await db.sequelize.sync({ force: true });
    console.log("Connection to the database successful!");
    await app.listen(8001, () => {
      console.log("The application is running on localhost:8001");
    });
  } catch (error) {
    console.error("Error connecting to the database: ", error);
  }
};

run();
