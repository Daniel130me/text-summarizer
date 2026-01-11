import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import apiRoutes from "./routes/api.js";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

app.use(cors());
app.use(express.json());

app.use("/api", apiRoutes);
if (process.env.NODE_ENV === "production") {
	app.use(express.static(path.join(__dirname, "/dist")));

	app.get("*", (req, res) => {
		res.sendFile(path.resolve(__dirname, "dist", "index.html"));
	});
}
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("mongoDB Connected");
    app.listen(PORT, () => console.log(`running on port the ${PORT}`));
  })
  .catch((err) => console.error("mongoDB onnection on Error:", err));
