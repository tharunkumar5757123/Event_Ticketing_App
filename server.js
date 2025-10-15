const express = require("express");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 8080;
const { connectDB } = require("./config/db.js");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");


// Routes
const authRoutes = require("./routes/authRoutes.js");
const eventRoutes = require("./routes/eventRoutes.js");
const ticketRoutes = require("./routes/ticketRoutes.js");
const scanRoutes = require("./routes/scanRoutes.js");
const statsRoutes = require("./routes/statsRoutes.js");
const adminRoutes = require("./routes/adminRoutes.js");
const paymentRoutes = require("./routes/paymentRoutes.js");

// Connect DB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// HTTP server + Socket.io
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } }); // ✅ only once

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);
  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

// Routes
app.get("/", (req, res) => res.send("Hello World"));
app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/tickets", ticketRoutes);
app.use("/api/scan", scanRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/payment", paymentRoutes);

// 404 Handler
app.use((req, res, next) => {
  res.status(404).json({ message: "Endpoint not found", status: 404 });
});

// Start server
server.listen(port, () => {
  console.log("Server started on port " + port);
});

module.exports = { app, io }; // ✅ export io for other modules
