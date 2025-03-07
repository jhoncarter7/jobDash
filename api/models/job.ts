import { Schema, model } from "mongoose";

interface jobInter {
  title: string;
  description: string;
  status: "open" | "close";
  recruiterId: Schema.Types.ObjectId;
}

const jobSchema = new Schema<jobInter>({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["open", "close"],
    default: "open",
  },
  recruiterId: {
    type: Schema.Types.ObjectId,
    ref: "user",
    required: true
  },
});

export const Job = model<jobInter>("Job", jobSchema);
