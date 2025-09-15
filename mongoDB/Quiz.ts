import mongoose, { Document, Schema, Types } from "mongoose";
import { IUser } from "./User";
import { IQuestion } from "./Question";

export enum QuizType {
  MCQ = "mcq",
  OPEN_ENDED = "open_ended",
}

export interface IQuiz extends Document {
  userId: Types.ObjectId;
  questions: Types.ObjectId[] | IQuestion[];
  timeStarted: Date;
  timeEnded?: Date;
  topic: string;
  quizType: QuizType;
  user?: IUser; // virtual population
  createdAt: Date;
  updatedAt: Date;
}

const quizSchema: Schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
      index: true,
    },
    questions: [
      {
        type: Schema.Types.ObjectId,
        ref: "Question",
      },
    ],
    timeStarted: {
      type: Date,
      required: true,
    },
    timeEnded: {
      type: Date,
    },
    topic: {
      type: String,
      required: true,
    },
    quizType: {
      type: String,
      enum: Object.values(QuizType),
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for user relationship
quizSchema.virtual("user", {
  ref: "User",
  localField: "userId",
  foreignField: "_id",
  justOne: true,
});

export default mongoose.model<IQuiz>("Quiz", quizSchema);
