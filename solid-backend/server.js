import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB error:", err));

// Models
const userSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  password: String
});
const User = mongoose.model("User", userSchema);

const gallerySchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  images: [
    { id: String, src: String, title: String }
  ]
});
const Gallery = mongoose.model("Gallery", gallerySchema);

// Helpers
const authMiddleware = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) return res.status(401).json({ error: "No token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
};

// 🔑 Auth routes
app.post("/api/signup", async (req, res) => {
  const { username, password } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  try {
    const user = await User.create({ username, password: hashed });
    res.json({ message: "User created" });
  } catch (err) {
    res.status(400).json({ error: "Username already exists" });
  }
});

app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) return res.status(400).json({ error: "User not found" });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(400).json({ error: "Invalid password" });

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
  res.json({ token });
});

// 🎨 Gallery routes (protected)
app.get("/api/gallery", authMiddleware, async (req, res) => {
  let gallery = await Gallery.findOne({ userId: req.user.userId });
  if (!gallery) gallery = await Gallery.create({ userId: req.user.userId, images: [] });
  res.json(gallery);
});

app.post("/api/gallery", authMiddleware, async (req, res) => {
  const { image } = req.body;
  let gallery = await Gallery.findOne({ userId: req.user.userId });
  if (!gallery) gallery = await Gallery.create({ userId: req.user.userId, images: [] });

  if (!gallery.images.find((i) => i.id === image.id)) {
    gallery.images.push(image);
    await gallery.save();
  }
  res.json(gallery);
});

app.delete("/api/gallery/:imageId", authMiddleware, async (req, res) => {
  let gallery = await Gallery.findOne({ userId: req.user.userId });
  if (!gallery) return res.status(404).json({ error: "Gallery not found" });

  gallery.images = gallery.images.filter((i) => i.id !== req.params.imageId);
  await gallery.save();
  res.json(gallery);
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
