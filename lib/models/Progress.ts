import mongoose from "mongoose"

export interface IProgress {
  _id?: string
  userId: string
  courseId: string
  lessonId: string
  completed: boolean
  completedAt?: Date
  quizScore?: number
  timeSpent?: number // in minutes
}

const progressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    lessonId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    completedAt: {
      type: Date,
    },
    quizScore: {
      type: Number,
      min: 0,
      max: 100,
    },
    timeSpent: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
)

// Compound index to ensure one progress record per user per lesson
progressSchema.index({ userId: 1, courseId: 1, lessonId: 1 }, { unique: true })

export const Progress = mongoose.models.Progress || mongoose.model("Progress", progressSchema)
