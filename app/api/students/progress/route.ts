export const dynamic = 'force-dynamic'

import { type NextRequest } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { authenticateRequest, requireRole } from "@/lib/middleware/security"
import { ProgressService } from "@/lib/services/progressService"
import { withErrorHandling, successResponse, getQueryParams } from "@/lib/api/apiUtils"

async function getStudentProgress(request: NextRequest) {
  const user = authenticateRequest(request)
  
  // Only students can access their own progress
  if (user.role !== "student") {
    throw new Error("Access denied. Only students can view their progress.")
  }

  await connectDB()

  const courseProgress = await ProgressService.getUserCourseProgress(user.userId)

  return successResponse({
    progress: courseProgress,
    totalCourses: courseProgress.length,
    completedCourses: courseProgress.filter(cp => cp.progressPercentage === 100).length,
  })
}

async function updateProgress(request: NextRequest) {
  const user = authenticateRequest(request)
  
  if (user.role !== "student") {
    throw new Error("Access denied. Only students can update their progress.")
  }

  const body = await request.json()
  const { courseId, lessonId, completed, quizScore, timeSpent } = body

  if (!courseId || !lessonId) {
    throw new Error("Course ID and Lesson ID are required")
  }

  await connectDB()

  const progress = await ProgressService.updateLessonProgress(
    user.userId,
    courseId,
    lessonId,
    {
      completed,
      quizScore,
      timeSpent,
    }
  )

  return successResponse({
    message: "Progress updated successfully",
    progress,
  })
}

export const GET = withErrorHandling(getStudentProgress)
export const POST = withErrorHandling(updateProgress)
