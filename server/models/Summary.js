import mongoose from "mongoose";

const SummarySchema = new mongoose.Schema(
  {
    originalText: {
      type: String,
      required: true,
    },
    summary: {
      type: String,
      required: true,
    },
    options: {
      length: String,
      format: String,
      tone: String,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Summary", SummarySchema);
