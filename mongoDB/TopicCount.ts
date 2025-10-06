// import mongoose, { Document, Schema, Types } from "mongoose";

// export interface ITopicCount extends Document {
//   _id: Types.ObjectId;
//   topic: string;
//   count: number;
// }

// const topicCountSchema: Schema = new Schema({
//   topic: {
//     type: String,
//     required: true,
//     unique: true,
//   },
//   count: {
//     type: Number,
//     required: true,
//     default: 0,
//   },
// });

// // Index for faster queries (unique index is already created by the unique constraint)
// topicCountSchema.index({ topic: 1 });

// export default mongoose.model<ITopicCount>("TopicCount", topicCountSchema);

import mongoose, { Document, Schema, Types } from "mongoose";

export interface ITopicCount extends Document {
  _id: Types.ObjectId;
  topic: string;
  count: number;
}

const topicCountSchema: Schema = new Schema({
  topic: {
    type: String,
    required: true,
    unique: true,
  },
  count: {
    type: Number,
    required: true,
    default: 0,
  },
});

// Index for faster queries
topicCountSchema.index({ topic: 1 });

// ✅ Check if model already exists before creating it
const TopicCount =
  mongoose.models.TopicCount ||
  mongoose.model<ITopicCount>("TopicCount", topicCountSchema);

export default TopicCount;
