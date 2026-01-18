import mongoose, { Schema, Document } from 'mongoose';

export interface IExam extends Document {
  examName: string;
  department: string[];
  totalQuestions: number;
  duration: number;
  description: string;
  status: 'active' | 'inactive' | 'draft';
  language: string[];
  createdAt: Date;
  updatedAt: Date;
}

const ExamSchema = new Schema<IExam>(
  {
    examName: {
      type: String,
      required: true,
      index: true,
    },
    department: {
      type: [String],
      required: true,
    },
    totalQuestions: {
      type: Number,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'draft'],
      default: 'active',
    },
    language: {
      type: [String],
      default: ['en', 'hi'],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Exam || mongoose.model<IExam>('Exam', ExamSchema);
