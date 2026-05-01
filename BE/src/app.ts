import express, { Request, Response } from "express";
import cors from "cors";
import path from "path";
import { config } from "./config/config.js";
import router from "./routes/index.js";

const app = express();

// CORS - Allow Frontend
app.use(cors({
  origin: config.corsOrigins,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}));

// Body Parser
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Serve static files (images)
const uploadPath = path.join(process.cwd(), 'uploads');
console.log(`📂 [Static] Serving files from: ${uploadPath}`);
app.use('/uploads', express.static(uploadPath));

// Health Check
app.get("/health", (req: Request, res: Response) => {
  res.json({ 
    status: "ok", 
    timestamp: new Date().toISOString(),
    message: "JM Fashion API is running!"
  });
});

// API Routes
app.use("/api", router);

// 404 Handler - phải đặt cuối cùng
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: "API endpoint not found",
    path: req.originalUrl
  });
});

export default app;