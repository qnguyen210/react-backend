import Project from "../models/project.model.js";

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
    const project = new Project(req.body);
    await project.save();
    return res.status(200).json({ message: "Project saved successfully" });
  } catch (err) {
    return res.status(400).json({ error: getErrorMessage(err) });
  }
};

const list = async (req, res) => {
  try {
    const projects = await Project.find().sort("-created");
    return res.json(projects);
  } catch (err) {
    return res.status(400).json({ error: getErrorMessage(err) });
  }
};

const projectByID = async (req, res, next, id) => {
  try {
    const project = await Project.findById(id);
    if (!project) return res.status(404).json({ error: "Project not found" });
    req.project = project;
    next();
  } catch (err) {
    return res.status(400).json({ error: "Could not retrieve project" });
  }
};

const read = (req, res) => {
  return res.json(req.project);
};

const update = async (req, res) => {
  try {
    const project = Object.assign(req.project, req.body);
    await project.save();
    return res.json(project);
  } catch (err) {
    return res.status(400).json({ error: getErrorMessage(err) });
  }
};

const remove = async (req, res) => {
  try {
    const deleted = await Project.findByIdAndDelete(req.project._id || req.project.id);
    if (!deleted) return res.status(404).json({ error: "Project not found" });
    return res.json({ message: "Project deleted", deleted });
  } catch (err) {
    return res.status(400).json({ error: getErrorMessage(err) });
  }
};

const removeAll = async (req, res) => {
  try {
    const result = await Project.deleteMany({});
    return res.json({ message: "All projects removed", deletedCount: result.deletedCount });
  } catch (err) {
    return res.status(400).json({ error: getErrorMessage(err) });
  }
};

export default { create, list, projectByID, read, update, remove, removeAll };