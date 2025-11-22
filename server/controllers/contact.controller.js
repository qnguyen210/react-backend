import Contact from "../models/contact.model.js";

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
    const contact = new Contact(req.body);
    await contact.save();
    return res.status(200).json({ message: "Contact saved successfully" });
  } catch (err) {
    return res.status(400).json({ error: getErrorMessage(err) });
  }
};

const list = async (req, res) => {
  try {
    const contacts = await Contact.find().sort("-created");
    return res.json(contacts);
  } catch (err) {
    return res.status(400).json({ error: getErrorMessage(err) });
  }
};

const contactByID = async (req, res, next, id) => {
  try {
    const contact = await Contact.findById(id);
    if (!contact) return res.status(404).json({ error: "Contact not found" });
    req.contact = contact;
    next();
  } catch (err) {
    return res.status(400).json({ error: "Could not retrieve contact" });
  }
};

const read = (req, res) => {
  return res.json(req.contact);
};

const update = async (req, res) => {
  try {
    const contact = Object.assign(req.contact, req.body);
    await contact.save();
    return res.json(contact);
  } catch (err) {
    return res.status(400).json({ error: getErrorMessage(err) });
  }
};

const remove = async (req, res) => {
  try {
    const deleted = await Contact.findByIdAndDelete(req.contact._id || req.contact.id);
    if (!deleted) return res.status(404).json({ error: "Contact not found" });
    return res.json({ message: "Contact deleted", deleted });
  } catch (err) {
    return res.status(400).json({ error: getErrorMessage(err) });
  }
};

const removeAll = async (req, res) => {
  try {
    const result = await Contact.deleteMany({});
    return res.json({ message: "All contacts removed", deletedCount: result.deletedCount });
  } catch (err) {
    return res.status(400).json({ error: getErrorMessage(err) });
  }
};


export default { create, list, contactByID, read, update, remove, removeAll };