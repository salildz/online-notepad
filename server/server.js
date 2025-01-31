require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoutes");
const noteRoutes = require("./routes/noteRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use("/api/notes", noteRoutes);
app.use("/api/auth", authRoutes);

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connection successful"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Test Endpoint
app.get("/", (req, res) => {
  res.send("Secure Notes API is running!");
});

// Start Server
app.listen(PORT, () => console.log(`Server is running on port ${PORT}...`));
