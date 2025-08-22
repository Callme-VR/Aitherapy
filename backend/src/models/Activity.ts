import { timeStamp } from "console";
import mongoose, { Schema } from "mongoose";

export interface IActivity extends Document {
  userId: mongoose.Types.ObjectId;
  type: string;
  name: string;
  duration: number;
  description: string;
  timestamp: Date;
}

const activitySchema = new Schema<IActivity>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  type: {
    type: String,
    required: true,
    index: true,
    enum: [
      "Exercise",
      "Workout",
      "Yoga",
      "Meditation",
      "journaling",
      "breathing",
      "Therapy",
    ],
  },
  name: {
    type: String,
    required: true,
    index: true,
  },
  duration: {
    type: Number,
    min: 0,
  },
  description: {
    type: String,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

activitySchema.index({ userId: 1, timeStamp: -1 });

export const Activity=mongoose.model<IActivity>("Activity",activitySchema);
