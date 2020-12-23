const { Trip } = require("../db/models");

//FetchTrips
exports.fetchTrip = async (tripId, next) => {
  try {
    const trip = await Trip.findByPk(tripId);
    return trip;
  } catch (error) {
    next(error);
  }
};

//TripsList
exports.tripsList = async (req, res) => {
  try {
    const trips = await Trip.findAll({
      attributes: { exclude: ["createdAt", "updatedAt"] },
    });
    res.json(trips);
  } catch (err) {
    next(err);
  }
};

//Trip create
exports.tripCreate = async (req, res) => {
  try {
    if (req.file) {
      req.body.image = `http://${req.get("host")}/media/${req.file.filename}`;
    }
    req.body.userId = req.user.id;
    const newTrip = await Trip.create(req.body);
    res.status(201).json(newTrip);
  } catch (error) {
    next(error);
  }
};

//Update Trips
exports.tripUpdate = async (req, res, next) => {
  const { tripId } = req.params;

  try {
    if (req.user.id === req.trip.userId) {
      const foundTrip = await this.fetchTrip(tripId, next);
      if (req.file) {
        req.body.image = `${req.protocol}://${req.get("host")}/media/${
          req.file.filename
        }`;
      }
      if (foundTrip) {
        await foundTrip.update(req.body);
        // for (const key in req.body) foundTrip[key] = req.body[key];
        res.status(204).end();
      } else {
        const err = new Error("Trip Not Found");
        err.status = 404;
        next(err);
      }
    } else {
      const err = new Error("Unauthorized");
      err.status = 401;
      next(err);
    }
  } catch (error) {
    next(error);
  }
};

//Delete Trip
exports.tripDelete = async (req, res, next) => {
  const { tripId } = req.params;
  try {
    const foundTrip = await Trip.findByPk(tripId);
    if (req.user.id === req.trip.userId) {
      if (foundTrip) {
        await foundTrip.destroy();
        res.status(204).end();
      } else {
        res.status(404).json({ message: "Trip not found" });
      }
    } else {
      const err = new Error("Unauthorized");
      err.status = 401;
      next(err);
    }
  } catch (err) {
    next(err);
  }
};
