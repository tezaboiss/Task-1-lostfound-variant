import mongoose from 'mongoose';

// 1. Define the Item Schema
const itemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      enum: ['electronics', 'clothing', 'documents', 'keys', 'other'],
    },
    status: {
      type: String,
      required: true,
      enum: ['lost', 'found'],
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// 2. Define the Uniqueness Constraint separately
itemSchema.index({ title: 1, location: 1 }, { unique: true });

// 3. Compile and Export the Model

export const Item = mongoose.model('Item', itemSchema);

