import mongoose from 'mongoose'

const ProjectSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  link: String,
  github: String,
  image: String,
  created: { type: Date, default: Date.now },
})

export default mongoose.model('Project', ProjectSchema)