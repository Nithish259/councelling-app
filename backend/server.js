const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const http = require("http");
const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");

dotenv.config({ path: "./.env" });

const connectDB = require("./config/mongodb");
const connectCloudinary = require("./config/cloudinary");

const clientRouter = require("./routes/clientRoutes");
const councellorRouter = require("./routes/councellorRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
const sessionRoutes = require("./routes/sessionRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const sessionNoteRoutes = require("./routes/sessionNoteRoutes");
const chatRoutes = require("./routes/chatRoutes");

const app = express();
const port = process.env.PORT || 4000;

// DB & Cloud
connectDB();
connectCloudinary();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/client", clientRouter);
app.use("/api/councellor", councellorRouter);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/session", sessionRoutes);
app.use("/api/session-notes", sessionNoteRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/chat", chatRoutes);

app.get("/", (req, res) => {
  res.send("API WORKING");
});

// Create HTTP server
const server = http.createServer(app);

// Socket.IO setup
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

/* 🔐 GLOBAL SOCKET AUTH MIDDLEWARE */
io.use((socket, next) => {
  try {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error("No token provided"));

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.userId = decoded.id;
    socket.role = decoded.role;

    next();
  } catch (err) {
    next(new Error("Authentication error"));
  }
});

// Socket modules
require("./socket/signaling")(io);
require("./socket/chatSocket")(io);

// Start server
server.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
