import User from "../models/user.model.js";

const getErrorMessage = (err) => {
  if (!err) return "Unknown error";
  if (err.errors) {
    const first = Object.values(err.errors)[0];
    return first && first.message ? first.message : String(err);
  }
  return err.message || String(err);
};

const create = async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    return res.status(200).json({ message: "Successfully signed up!" });
  } catch (err) {
    return res.status(400).json({ error: getErrorMessage(err) });
  }
};

const list = async (req, res) => {
  try {
    const users = await User.find().select("name email updated created");
    return res.json(users);
  } catch (err) {
    return res.status(400).json({ error: getErrorMessage(err) });
  }
};

const userByID = async (req, res, next, id) => {
  try {
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ error: "User not found" });
    req.profile = user;
    next();
  } catch (err) {
    return res.status(400).json({ error: "Could not retrieve user" });
  }
};

const read = (req, res) => {
  req.profile.hashed_password = undefined;
  req.profile.salt = undefined;
  return res.json(req.profile);
};

const update = async (req, res) => {
  try {
    let user = req.profile;
    user = Object.assign(user, req.body);
    user.updated = Date.now();
    await user.save();
    user.hashed_password = undefined;
    user.salt = undefined;
    return res.json(user);
  } catch (err) {
    return res.status(400).json({ error: getErrorMessage(err) });
  }
};

const remove = async (req, res) => {
  try {
    const deleted = await User.findByIdAndDelete(req.profile._id); 
    if (!deleted) return res.status(404).json({ error: "User not found" });
    deleted.hashed_password = undefined;
    deleted.salt = undefined;
    return res.json({ message: "User deleted", deleted });
  } catch (err) {
    return res.status(400).json({ error: getErrorMessage(err) });
  }
};

const removeAll = async (req, res) => {
  try {
    const result = await User.deleteMany({});
    return res.json({ message: "All users removed", deletedCount: result.deletedCount });
  } catch (err) {
    return res.status(400).json({ error: getErrorMessage(err) });
  }
};

export default { create, list, userByID, read, update, remove, removeAll };
