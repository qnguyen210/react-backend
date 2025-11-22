// models/contact.js
import mongoose from "mongoose";

const contactSchema = new mongoose.Schema({
  firstname: { type: String, required: true, trim: true },
  lastname:  { type: String, required: true, trim: true },
  email:     { type: String, required: true, lowercase: true, trim: true, unique: true },
 
}, { timestamps: true });

export default mongoose.model("Contact", contactSchema);
