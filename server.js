require("dotenv").config();
const express = require("express");
const cors = require("cors");
const sequelize = require("./db");

// ✅ Load all models and associations (creates UserId, relations, etc.)
require("./models");

const app = express();

// =======================
// Middleware
// =======================
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true
  })
);

app.use(express.json());

// =======================
// Routes
// =======================
app.use("/auth", require("./routes/auth"));
app.use("/tablet", require("./routes/tablet"));

// =======================
// Health Check
// =======================
app.get("/", (req, res) => {
  res.send("Backend is running");
});

// =======================
// Start Server AFTER DB Sync
// =======================
const PORT = process.env.PORT || 5000;

/*
  ✅ alter:true → safe for development
  ❌ NEVER use force:true (it deletes data)
*/
sequelize
  .sync({ alter: true })
  .then(() => {
    console.log("Database synced successfully");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Database sync failed:", err);
  });
