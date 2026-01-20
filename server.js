require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const connectDB = require("./configs/db");
const PORT = process.env.PORT || 5000;

const allowedOrigins = ["http://localhost:4200"];
const auth = require("./routes/auth.routes");
const users = require("./routes/users.routes");
const categories = require("./routes/categories.routes");
const products = require("./routes/products.routes");

connectDB();
app.use(express.json());
app.use(
  cors({
    origin: allowedOrigins,
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>API Status</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            background: linear-gradient(135deg, #4facfe, #00f2fe);
            height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            margin: 0;
          }
          .card {
            background: white;
            padding: 40px 60px;
            border-radius: 12px;
            box-shadow: 0 8px 20px rgba(0,0,0,0.15);
            text-align: center;
          }
          h1 {
            color: #333;
            margin-bottom: 10px;
          }
          p {
            color: #666;
            font-size: 16px;
          }
          .status {
            color: #28a745;
            font-weight: bold;
          }
        </style>
      </head>
      <body>
        <div class="card">
          <h1>🚀 API is Running</h1>
          <p>Status: <span class="status">Online</span></p>
          <p>Welcome to Stock Management System API</p>
        </div>
      </body>
    </html>
  `);
});

//! Routes
app.use("/api/auth", auth);
app.use("/api/users", users);
app.use("/api/categories", categories);
app.use("/api/products", products);

//! Upload Middleware
app.use("/uploads", express.static("uploads"));

//! Error Handling Middleware
app.use((err, req, res, next) => {
  if (err) {
    res.status(err.status || 500).json({
      message: err.message,
    });
  } else {
    next();
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server Running At ===> http://localhost:${PORT}`);
});
