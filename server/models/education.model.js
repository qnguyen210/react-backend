import mongoose from 'mongoose'

const EducationSchema = new mongoose.Schema({
  school: { type: String, required: true, trim: true },
  degree: { type: String, trim: true },
  fieldOfStudy: { type: String, trim: true },
  startDate: Date,
  endDate: Date,
  description: String,
  created: { type: Date, default: Date.now },
})

export default mongoose.model('Education', EducationSchema)