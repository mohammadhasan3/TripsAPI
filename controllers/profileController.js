const { Profile } = require("../db/models");

//FetchProfiles
exports.fetchProfile = async (profileId, next) => {
  try {
    const profile = await Profile.findByPk(profileId);
    return profile;
  } catch (error) {
    next(error);
  }
};

//ProfilesList
exports.profilesList = async (req, res) => {
  try {
    const profiles = await Profile.findAll({
      attributes: { exclude: ["createdAt", "updatedAt"] },
    });
    res.json(profiles);
  } catch (err) {
    next(err);
  }
};

//Update Profiles
exports.profileUpdate = async (req, res, next) => {
  const { profileId } = req.params;

  try {
    const foundProfile = await Profile.findOne({
      where: {
        userId: req.user.id,
      },
    });
    if (req.file) {
      req.body.image = `${req.protocol}://${req.get("host")}/media/${
        req.file.filename
      }`;
    }
    if (foundProfile) {
      await foundProfile.update(req.body);
      res.status(204).end();
    } else {
      const err = new Error("Profile Not Found");
      err.status = 404;
      next(err);
    }
  } catch (error) {
    next(error);
  }
};
