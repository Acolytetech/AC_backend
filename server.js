import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import propertyRoutes from "./routes/propertyRoutes.js";
import leadRoutes from "./routes/leadRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import cookieParser from "cookie-parser";


dotenv.config();
connectDB();

const app = express();
app.use(cookieParser());

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5000",
  "https://ac-frontend-ctfa.vercel.app",
  "https://ac-backendnew.onrender.com/api"
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);
app.use(express.json());
app.use("/api/properties", propertyRoutes);
app.use("/api/leads", leadRoutes);
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("API is running...");
});

// Routes (we will add soon)
// app.use("/api/auth", authRoutes);
// app.use("/api/properties", propertyRoutes);
// app.use("/api/leads", leadRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT} 🚀`));

