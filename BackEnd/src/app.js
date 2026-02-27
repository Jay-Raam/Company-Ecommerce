import express from "express";
import cors from "cors";
import compression from "compression";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import { createYoga } from "graphql-yoga";
import { schema } from "./graphql/index.js";
import {
  setAuthCookies,
  extractTokenFromCookie,
} from "./middleware/cookieMiddleware.js";

const app = express();

// CORS configuration for cookies
const corsOptions = {
  origin: (origin, callback) => {
    // 🔧 Allow specific origins with credentials
    const allowedOrigins = [
      "http://localhost:5173", // Vite dev server
      "http://localhost:3000", // Alternative
      "http://localhost:5174", // Alternative
      "http://127.0.0.1:5173",
    ];

    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log("⚠️ CORS rejected origin:", origin);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true, // Allow credentials (cookies) - CRITICAL for httpOnly cookies
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  exposedHeaders: ["Set-Cookie"],
  optionsSuccessStatus: 200,
  maxAge: 86400, // 24 hours
};

// Middlewares (order matters!)
app.use(cors(corsOptions)); // CORS FIRST
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }, // Allow CORS
  }),
);
app.use(compression());
app.use(cookieParser()); // Parse cookies from requests
app.use(express.json({ limit: "1mb" }));
app.use(extractTokenFromCookie); // Extract token from cookie to Authorization header
app.use(setAuthCookies); // Intercept responses to set cookies
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Yoga setup
const yoga = createYoga({
  schema,
  graphiql: process.env.NODE_ENV !== "production",
  context: ({ req, res }) => ({
    req,
    res,
  }),
});

// Route
app.use("/graphql", yoga);

// Health check endpoint
app.get("/", (_, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

export default app;
