import mongoose, { Schema, Document } from 'mongoose'

export interface IUser extends Document {
  supabaseId: string
  email: string
  name: string
  department?: string
  examHistory: Array<{
    examId: string
    paperId: string
    score: number
    totalQuestions: number
    correctAnswers: number
    wrongAnswers: number
    skippedQuestions: number
    timeSpent: number
    completedAt: Date
  }>
  createdAt: Date
  lastActive: Date
}

const UserSchema = new Schema<IUser>(
  {
    supabaseId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    department: {
      type: String,
      required: false,
      enum: [
        'Civil',
        'Mechanical',
        'Electrical',
        'Commercial',
        'Personnel',
        'Operating',
        'S&T',
        'DFCCIL/Metro',
      ],
    },
    examHistory: [
      {
        examId: { type: String, required: true },
        paperId: { type: String, required: true },
        score: { type: Number, required: true },
        totalQuestions: { type: Number, required: true },
        correctAnswers: { type: Number, required: true },
        wrongAnswers: { type: Number, required: true },
        skippedQuestions: { type: Number, required: true },
        timeSpent: { type: Number, required: true },
        completedAt: { type: Date, default: Date.now },
      },
    ],
    lastActive: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
)

// Indexes for faster queries
UserSchema.index({ supabaseId: 1 })
UserSchema.index({ email: 1 })
UserSchema.index({ department: 1 })

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema)
