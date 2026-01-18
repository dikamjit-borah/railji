import mongoose, { Schema, Document } from 'mongoose';

export interface IOption {
  en: string;
  hi: string;
}

export interface IQuestion {
  ques: string;
  ques_hi: string;
  options: IOption[];
  correct: number;
}

export interface IPaper extends Document {
  examName: string;
  department: string;
  year: string;
  location: string;
  questions: IQuestion[];
  createdAt: Date;
  updatedAt: Date;
}

const OptionSchema = new Schema<IOption>(
  {
    en: {
      type: String,
      required: true,
    },
    hi: {
      type: String,
      required: true,
    },
  },
  { _id: false }
);

const QuestionSchema = new Schema<IQuestion>(
  {
    ques: {
      type: String,
      required: true,
    },
    ques_hi: {
      type: String,
      required: true,
    },
    options: {
      type: [OptionSchema],
      required: true,
      validate: {
        validator: function (options: IOption[]) {
          return options.length === 4;
        },
        message: 'Each question must have exactly 4 options',
      },
    },
    correct: {
      type: Number,
      required: true,
      min: 0,
      max: 3,
    },
  },
  { _id: false }
);

const PaperSchema = new Schema<IPaper>(
  {
    examName: {
      type: String,
      required: true,
      index: true,
    },
    department: {
      type: String,
      required: true,
      index: true,
    },
    year: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    questions: {
      type: [QuestionSchema],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for efficient queries
PaperSchema.index({ examName: 1, department: 1, year: 1 });

export default mongoose.models.Paper || mongoose.model<IPaper>('Paper', PaperSchema);
