import mongoose, { Document, Schema, Types } from "mongoose";
import { IUser } from "./User";

export interface ISession extends Document {
  sessionToken: string;
  userId: Types.ObjectId;
  expires: Date;
  user?: IUser; // Virtual population
  createdAt: Date;
  updatedAt: Date;
}

const sessionSchema: Schema = new Schema(
  {
    sessionToken: {
      type: String,
      required: true,
      unique: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    expires: {
      type: Date,
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
sessionSchema.virtual("user", {
  ref: "User",
  localField: "userId",
  foreignField: "_id",
  justOne: true, // Since it's a one-to-one relationship
});

export default mongoose.model<ISession>("Session", sessionSchema);
