import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import apiRoutes from "./routes/api.js";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

app.use(cors());
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use("/api", apiRoutes);

app.use(express.static(path.join(__dirname, "../dist")));

app.use((req, res) => {
  res.sendFile(path.join(__dirname, "../dist/index.html"));
});

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () =>
      console.log(`Server running on port ${PORT}`)
    );
  })
  .catch((err) => console.error("MongoDB connection error:", err));
