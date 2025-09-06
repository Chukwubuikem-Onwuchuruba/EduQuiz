import mongoose, { Document, Schema, Types } from "mongoose";
import { IUser } from "./User";

export interface IAccount extends Document {
  userId: Types.ObjectId;
  type: string;
  provider: string;
  providerAccountId: string;
  refresh_token?: string;
  access_token?: string;
  expires_at?: number;
  token_type?: string;
  scope?: string;
  id_token?: string;
  session_state?: string;
  user?: IUser; // Virtual population
  createdAt: Date;
  updatedAt: Date;
}

const accountSchema: Schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    type: {
      type: String,
      required: true,
    },
    provider: {
      type: String,
      required: true,
    },
    providerAccountId: {
      type: String,
      required: true,
    },
    refresh_token: {
      type: String,
    },
    access_token: {
      type: String,
    },
    expires_at: {
      type: Number,
    },
    token_type: {
      type: String,
    },
    scope: {
      type: String,
    },
    id_token: {
      type: String,
    },
    session_state: {
      type: String,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for user relationship
accountSchema.virtual("user", {
  ref: "User",
  localField: "userId",
  foreignField: "_id",
  justOne: true, // Since it's a one-to-one relationship
});

// Compound index for provider + providerAccountId uniqueness
accountSchema.index({ provider: 1, providerAccountId: 1 }, { unique: true });

export default mongoose.model<IAccount>("Account", accountSchema);
