export const dynamic = 'force-dynamic'

import { type NextRequest } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { CourseModel } from "@/lib/models/Course"
import { withErrorHandling, successResponse } from "@/lib/api/apiUtils"
import { ApiErrors } from "@/lib/middleware/security"
import { verifyToken } from "@/lib/auth"

// Helper to check teacher role
async function checkTeacher(request: NextRequest) {
  const authHeader = request.headers.get("authorization")
  if (!authHeader?.startsWith("Bearer ")) {
    throw ApiErrors.UNAUTHORIZED("Authentication required")
  }
  const token = authHeader.split(" ")[1]
  const decoded = verifyToken(token)
  if (!decoded || (decoded.role !== "teacher" && decoded.role !== "admin")) {
    throw ApiErrors.FORBIDDEN("Only teachers can access this resource")
  }
  return decoded
}

// GET teacher's courses
async function getTeacherCoursesHandler(request: NextRequest) {
  const decoded = await checkTeacher(request)
  await connectDB()

  // Teachers see their own courses, Admins see all
  const query = decoded.role === "admin" ? {} : { teacherId: decoded.userId }
  
  const courses = await CourseModel.find(query)
    .sort({ createdAt: -1 })
    .lean()

  // Transform for frontend: convert enrolledStudents array to count
  const transformedCourses = courses.map(course => ({
    ...course,
    enrolledStudents: course.enrolledStudents?.length || 0
  }))

  return successResponse({ courses: transformedCourses })
}

// POST create course
async function createCourseHandler(request: NextRequest) {
  const decoded = await checkTeacher(request)
  await connectDB()

  const body = await request.json()
  
  const newCourse = await CourseModel.create({
    ...body,
    teacherId: decoded.userId,
    teacherName: decoded.email.split("@")[0], // Fallback if name not in token
    enrolledStudents: [],
    rating: 0,
    totalRatings: 0,
    isPublished: false
  })

  return successResponse({
    course: newCourse,
    message: "Course created successfully"
  })
}

export const GET = withErrorHandling(getTeacherCoursesHandler)
export const POST = withErrorHandling(createCourseHandler)