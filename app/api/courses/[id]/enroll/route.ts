export const dynamic = 'force-dynamic'

import { type NextRequest } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { CourseModel } from "@/lib/models/Course"
import { UserModel } from "@/lib/models/User"
import { withErrorHandling, successResponse } from "@/lib/api/apiUtils"
import { ApiErrors } from "@/lib/middleware/security"
import { requireAuth } from "@/lib/middleware/security"

async function enrollHandler(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id: courseId } = await params
  const user = await requireAuth(request)

  await connectDB()

  // Check if course exists and is published
  const course = await CourseModel.findById(courseId)
  if (!course) {
    throw ApiErrors.NOT_FOUND("Course not found")
  }

  if (!course.isPublished) {
    throw ApiErrors.FORBIDDEN("Course is not available for enrollment")
  }

  // Check if user is already enrolled
  const userDoc = await UserModel.findById(user.userId)
  if (!userDoc) {
    throw ApiErrors.NOT_FOUND("User not found")
  }

  if (userDoc.coursesEnrolled.includes(courseId as any)) {
    throw ApiErrors.CONFLICT("User is already enrolled in this course")
  }

  // Enroll user in course
  userDoc.coursesEnrolled.push(courseId as any)
  await userDoc.save()

  // Add user to course's enrolled students
  course.enrolledStudents.push(user.userId as any)
  await course.save()

  return successResponse({
    message: "Successfully enrolled in course",
    courseId,
    courseTitle: course.title
  })
}

export const POST = withErrorHandling(enrollHandler)