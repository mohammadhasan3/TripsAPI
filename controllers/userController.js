const bcrypt = require("bcrypt");
const { User, Profile } = require("../db/models");
const jwt = require("jsonwebtoken");
const { JWT_SECRET, JWT_EXPIRATION_MS } = require("../config/keys");

//UsersList
exports.usersList = async (req, res, next) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ["createdAt", "updatedAt"] },
      include: [
        {
          model: Shop,
          as: "shop",
          attributes: ["id"],
        },
      ],
    });
    res.json(users);
  } catch (err) {
    next(err);
  }
};

//Sign up
exports.signup = async (req, res, next) => {
  const { password } = req.body;
  const saltRounds = 10;
  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    req.body.password = hashedPassword;
    const newUser = await User.create(req.body);
    const newProfile = await Profile.create({
      userId: newUser.id,
    });
    const payload = {
      id: newUser.id,
      username: newUser.username,
      exp: Date.now() + parseInt(JWT_EXPIRATION_MS),
      userProfile: newProfile,
    };

    const newProfile = await Profile.create({
      userId: newUser.id,
      username: newUser.username,
    });

    const token = jwt.sign(JSON.stringify(payload), JWT_SECRET);
    res.status(201).json({ token, newProfile });
  } catch (error) {
    next(error);
  }
};

//Sign in
exports.signin = async (req, res) => {
  console.log("exports.signin -> req", req);
  const { user } = req;
  const userProfile = await Profile.findOne({
    where: {
      userId: user.id,
    },
  });
  const payload = {
    id: user.id,
    username: user.username,
    exp: Date.now() + parseInt(JWT_EXPIRATION_MS),
    userProfile: userProfile,
  };
  const token = jwt.sign(JSON.stringify(payload), JWT_SECRET);
  res.status(201).json({ token });
};
