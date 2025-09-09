import mongoose, { Document, Model, Schema, Types } from "mongoose";
import { IAccount } from "./Account";
import { ISession } from "./Session";

export interface IUser extends Document {
  _id: Types.ObjectId;
  name?: string;
  email?: string;
  emailVerified?: Date;
  image?: string;
  accounts: Types.ObjectId[] | IAccount[];
  sessions: Types.ObjectId[] | ISession[];
  createdAt: Date;
  updatedAt: Date;
}

const userSchema: Schema = new Schema(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
      unique: true,
      sparse: true,
    },
    emailVerified: {
      type: Date,
    },
    image: {
      type: String,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for accounts
userSchema.virtual("accounts", {
  ref: "Account",
  localField: "_id",
  foreignField: "userId",
});

// Virtual for sessions
userSchema.virtual("sessions", {
  ref: "Session",
  localField: "_id",
  foreignField: "userId",
});

// Check if the model already exists before compiling and exporting
const User = (mongoose.models.User ||
  mongoose.model<IUser>("User", userSchema)) as Model<IUser>;

export default User;
