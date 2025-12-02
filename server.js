import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors';
import config from './config/config.js'
import contactRoutes from "./server/routes/contact.routes.js";
import userRoutes from "./server/routes/user.routes.js";
import educationRoutes from "./server/routes/education.routes.js";
import projectRoutes from "./server/routes/project.routes.js";
import authRoutes from "./server/routes/auth.routes.js"; // Import auth routes



const app = express()
// allow requests from frontend (dev)
// simplest for assignment:
app.use(cors());
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// simple logger
app.use((req, res, next) => {
  console.log(new Date().toISOString(), req.method, req.originalUrl)
  next()
})

// root route for snapshot
app.get('/', (req, res) => {
  return res.json({ message: 'Welcome to My Portfolio application.' })
})

// connect to MongoDB and log result
// Mongoose v6+ includes newer driver defaults; passing
// useNewUrlParser/useUnifiedTopology is deprecated and unnecessary.
mongoose.set('strictQuery', false)
mongoose
  .connect(config.mongoUri)
  .then(() => {
    console.log('MongoDB connected:', config.mongoUri.split('@').pop()) // partial info for privacy
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err.message || err)
 
  })

app.get("/", (req, res) => {
res.json({ message: "Welcome to User application." });
});

app.use("/api", contactRoutes);
app.use("/api", userRoutes);
app.use("/api", educationRoutes);
app.use("/api", projectRoutes);
app.use("/api", authRoutes);

const port = process.env.PORT || 4000
app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
