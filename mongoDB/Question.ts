import mongoose, { Document, Schema, Types } from "mongoose";
import { IQuiz, QuizType } from "./Quiz";

export interface IQuestion extends Document {
  question: string;
  answer: string;
  quizId: Types.ObjectId;
  options?: Record<string, any>; // for mcq
  percentageCorrect?: number; // for open-ended
  isCorrect?: boolean; // for mcq
  questionType: QuizType;
  userAnswer?: string;
  quiz?: IQuiz; // virtual population
  createdAt: Date;
  updatedAt: Date;
}

const questionSchema: Schema = new Schema(
  {
    question: {
      type: String,
      required: true,
    },
    answer: {
      type: String,
      required: true,
    },
    quizId: {
      type: Schema.Types.ObjectId,
      ref: "Quiz",
      required: true,
      index: true,
    },
    options: {
      type: Schema.Types.Mixed, // flexible JSON-like structure
    },
    percentageCorrect: {
      type: Number,
    },
    isCorrect: {
      type: Boolean,
    },
    questionType: {
      type: String,
      enum: Object.values(QuizType),
      required: true,
    },
    userAnswer: {
      type: String,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for quiz relationship
questionSchema.virtual("quiz", {
  ref: "Quiz",
  localField: "quizId",
  foreignField: "_id",
  justOne: true,
});

const Question =
  mongoose.models.Question ||
  mongoose.model<IQuestion>("Question", questionSchema);
export default Question;
