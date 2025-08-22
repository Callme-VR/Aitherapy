import mongoose, { Schema, Document, Model } from "mongoose";

export interface IMood extends Document {
  userId: mongoose.Types.ObjectId;
  score: number;
  note?: string;
  timestamp: Date;
}

const moodSchema = new Schema<IMood>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    score: {
      type: Number,
      required: true,
      index: true,
      min: 0,
      max: 100,
    },
    note: {
      type: String,
      trim: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

moodSchema.index({ userId: 1, timestamp: -1 });

const Mood: Model<IMood> = mongoose.model("Mood", moodSchema);

export default Mood;
