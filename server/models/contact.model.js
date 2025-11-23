// models/contact.model.js
import mongoose from "mongoose";

// Align the schema with the frontend form (name, email, message)
const contactSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true, index: true },
    message: { type: String, required: true, trim: true, maxlength: 2000 },

    // Legacy fields kept optional for backward compatibility with any old data
    firstname: { type: String, trim: true },
    lastname: { type: String, trim: true },
  },
  { timestamps: true }
);

// If name missing but legacy fields exist, compose name automatically
contactSchema.pre("save", function (next) {
  if (!this.name && (this.firstname || this.lastname)) {
    this.name = [this.firstname, this.lastname].filter(Boolean).join(" ").trim();
  }
  next();
});

export default mongoose.model("Contact", contactSchema);
