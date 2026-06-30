import mongoose, { Document, Schema } from 'mongoose';

export interface IUrl extends Document {
  _id: mongoose.Types.ObjectId;
  originalUrl: string;
  shortCode: string;
  customAlias?: string;
  title?: string;
  clicks: number;
  isActive: boolean;
  expiresAt?: Date;
  userId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const urlSchema = new Schema<IUrl>(
  {
    originalUrl: {
      type: String,
      required: [true, 'Original URL is required'],
      trim: true,
      maxlength: [2048, 'URL must not exceed 2048 characters'],
    },
    shortCode: {
      type: String,
      required: [true, 'Short code is required'],
      unique: true,
      trim: true,
      lowercase: true,
      minlength: [3, 'Short code must be at least 3 characters'],
      maxlength: [50, 'Short code must not exceed 50 characters'],
      match: [
        /^[a-zA-Z0-9_-]+$/,
        'Short code can only contain letters, numbers, hyphens, and underscores',
      ],
    },
    customAlias: {
      type: String,
      trim: true,
      lowercase: true,
      sparse: true,
      minlength: [3, 'Custom alias must be at least 3 characters'],
      maxlength: [50, 'Custom alias must not exceed 50 characters'],
      match: [
        /^[a-zA-Z0-9_-]+$/,
        'Alias can only contain letters, numbers, hyphens, and underscores',
      ],
    },
    title: {
      type: String,
      trim: true,
      maxlength: [100, 'Title must not exceed 100 characters'],
    },
    clicks: {
      type: Number,
      default: 0,
      min: [0, 'Clicks cannot be negative'],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    expiresAt: {
      type: Date,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_doc, ret) => {
        const { _id, __v, ...rest } = ret as unknown as {
          _id: mongoose.Types.ObjectId;
          __v: number;
        } & Record<string, unknown>;
        return { id: _id.toString(), ...rest };
      },
    },
  },
);

urlSchema.index({ shortCode: 1 }, { unique: true });
urlSchema.index({ customAlias: 1 }, { unique: true, sparse: true });
urlSchema.index({ userId: 1 });
urlSchema.index({ createdAt: -1 });
urlSchema.index({ clicks: -1 });

export const Url = mongoose.model<IUrl>('Url', urlSchema);
