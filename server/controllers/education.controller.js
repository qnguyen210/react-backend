import Education from "../models/education.model.js";

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
    const education = new Education(req.body);
    await education.save();
    return res.status(200).json({ message: "Qualification saved successfully" });
  } catch (err) {
    return res.status(400).json({ error: getErrorMessage(err) });
  }
};

const list = async (req, res) => {
  try {
    const items = await Education.find().sort("-created");
    return res.json(items);
  } catch (err) {
    return res.status(400).json({ error: getErrorMessage(err) });
  }
};

const qualificationByID = async (req, res, next, id) => {
  try {
    const qualification = await Education.findById(id);
    if (!qualification) return res.status(404).json({ error: "Qualification not found" });
    req.qualification = qualification;
    next();
  } catch (err) {
    return res.status(400).json({ error: "Could not retrieve qualification" });
  }
};

const read = (req, res) => {
  return res.json(req.qualification);
};

const update = async (req, res) => {
  try {
    const qualification = Object.assign(req.qualification, req.body);
    await qualification.save();
    return res.json(qualification);
  } catch (err) {
    return res.status(400).json({ error: getErrorMessage(err) });
  }
};

const remove = async (req, res) => {
  try {
    const deleted = await Education.findByIdAndDelete(req.qualification._id || req.qualification.id);
    if (!deleted) return res.status(404).json({ error: "Qualification not found" });
    return res.json({ message: "Qualification deleted", deleted });
  } catch (err) {
    return res.status(400).json({ error: getErrorMessage(err) });
  }
};

const removeAll = async (req, res) => {
  try {
    const result = await Education.deleteMany({});
    return res.json({ message: "All qualifications removed", deletedCount: result.deletedCount });
  } catch (err) {
    return res.status(400).json({ error: getErrorMessage(err) });
  }
};

export default { create, list, qualificationByID, read, update, remove, removeAll };