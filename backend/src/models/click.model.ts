import mongoose, { Document, Schema } from 'mongoose';

export interface IClick extends Document {
  _id: mongoose.Types.ObjectId;
  urlId: mongoose.Types.ObjectId;
  ip: string;
  browser: string;
  os: string;
  device: string;
  referrer: string;
  country: string;
  createdAt: Date;
}

const clickSchema = new Schema<IClick>(
  {
    urlId: {
      type: Schema.Types.ObjectId,
      ref: 'Url',
      required: [true, 'URL ID is required'],
    },
    ip: {
      type: String,
      default: 'unknown',
    },
    browser: {
      type: String,
      default: 'unknown',
    },
    os: {
      type: String,
      default: 'unknown',
    },
    device: {
      type: String,
      default: 'unknown',
      enum: ['desktop', 'mobile', 'tablet', 'unknown'],
    },
    referrer: {
      type: String,
      default: 'direct',
    },
    country: {
      type: String,
      default: 'unknown',
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
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

clickSchema.index({ urlId: 1 });
clickSchema.index({ createdAt: -1 });
clickSchema.index({ urlId: 1, createdAt: -1 });

export const Click = mongoose.model<IClick>('Click', clickSchema);
