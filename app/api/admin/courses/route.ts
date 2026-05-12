export const dynamic = 'force-dynamic'

import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { CourseModel } from "@/lib/models/Course"
import { withErrorHandling, successResponse } from "@/lib/api/apiUtils"
import { ApiErrors } from "@/lib/middleware/security"
import { verifyToken } from "@/lib/auth"

// Helper to check admin role
async function checkAdmin(request: NextRequest) {
  const authHeader = request.headers.get("authorization")
  if (!authHeader?.startsWith("Bearer ")) {
    throw ApiErrors.UNAUTHORIZED("Authentication required")
  }
  const token = authHeader.split(" ")[1]
  const decoded = verifyToken(token)
  if (!decoded || decoded.role !== "admin") {
    throw ApiErrors.FORBIDDEN("Only admins can access this resource")
  }
  return decoded
}

// GET all courses for admin
async function getAdminCoursesHandler(request: NextRequest) {
  await checkAdmin(request)
  await connectDB()

  const { searchParams } = new URL(request.url)
  const limit = parseInt(searchParams.get("limit") || "50")

  const courses = await CourseModel.find({})
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean()

  // Transform for frontend: convert enrolledStudents array to count
  const transformedCourses = courses.map(course => ({
    ...course,
    enrolledStudents: course.enrolledStudents?.length || 0
  }))

  return successResponse({ courses: transformedCourses })
}

// PATCH update course (publish/unpublish)
async function updateAdminCourseHandler(request: NextRequest) {
  await checkAdmin(request)
  await connectDB()

  const body = await request.json()
  const { courseId, ...updates } = body

  if (!courseId) {
    throw ApiErrors.BAD_REQUEST("Course ID is required")
  }

  const course = await CourseModel.findByIdAndUpdate(
    courseId,
    { $set: updates },
    { new: true }
  )

  if (!course) {
    throw ApiErrors.NOT_FOUND("Course not found")
  }

  return successResponse({ 
    message: "Course updated successfully",
    course 
  })
}

// DELETE course
async function deleteAdminCourseHandler(request: NextRequest) {
  await checkAdmin(request)
  await connectDB()

  const { searchParams } = new URL(request.url)
  const courseId = searchParams.get("courseId")

  if (!courseId) {
    throw ApiErrors.BAD_REQUEST("Course ID is required")
  }

  const course = await CourseModel.findByIdAndDelete(courseId)
  if (!course) {
    throw ApiErrors.NOT_FOUND("Course not found")
  }

  return successResponse({ message: "Course deleted successfully" })
}

export const GET = withErrorHandling(getAdminCoursesHandler)
export const PATCH = withErrorHandling(updateAdminCourseHandler)
export const DELETE = withErrorHandling(deleteAdminCourseHandler)
