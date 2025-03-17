require("dotenv").config();
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const sequelize = require("./config/database");

const noteRoutes = require("./routes/noteRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();

app.use(helmet());
app.use(express.json());
app.use(cookieParser());

const allowedOrigins = process.env.NODE_ENV === "production" ? ["https://online-notepad.yildizsalih.net"] : ["http://localhost:3001"];
console.log("Allowed origins:", allowedOrigins)

app.use(cors(
  {
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        var msg = "The CORS policy for this site does not allow access from the specified Origin.";
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    credentials: true
  }
));

app.use("/api/auth", authRoutes);
app.use("/api/note", noteRoutes);

sequelize
  .authenticate()
  .then(() => {
    console.log("Successfully connected to the database!");
    return sequelize.sync();
  })
  .then(() => {
    console.log("All models were synchronized successfully.");
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });

// Test Endpoint
app.get("/", (req, res) => {
  res.send("Online notepad api is running...");
});

// Start Server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}!`));
