import express from "express";
import cors from "cors";
import compression from "compression";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import { createYoga } from "graphql-yoga";
import { schema } from "./graphql/index.js";

const app = express();

// Middlewares
app.use(cors());
app.use(helmet());
app.use(compression());
app.use(express.json({ limit: "1mb" }));
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Yoga setup
const yoga = createYoga({
  schema,
  graphiql: process.env.NODE_ENV !== "production",
  context: ({ request }) => ({
    userAgent: request.headers["user-agent"],
  }),
});

// Route
app.use("/graphql", yoga);

// Health check endpoint
app.get("/", (_, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

export default app;
