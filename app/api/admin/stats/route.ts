export const dynamic = 'force-dynamic'

import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { UserModel } from "@/lib/models/User"
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

async function getAdminStatsHandler(request: NextRequest) {
  await checkAdmin(request)
  await connectDB()

  // Get user statistics
  const totalUsers = await UserModel.countDocuments()
  const totalStudents = await UserModel.countDocuments({ role: "student" })
  const totalTeachers = await UserModel.countDocuments({ role: "teacher" })
  
  // New users this month
  const startOfMonth = new Date()
  startOfMonth.setDate(1)
  startOfMonth.setHours(0, 0, 0, 0)
  const newUsersThisMonth = await UserModel.countDocuments({ createdAt: { $gte: startOfMonth } })

  // Get course statistics
  const totalCourses = await CourseModel.countDocuments()
  const publishedCourses = await CourseModel.countDocuments({ isPublished: true })
  const draftCourses = totalCourses - publishedCourses

  // Get total enrollments and avg progress
  const courses = await CourseModel.find({}).lean()
  const totalEnrollments = courses.reduce((sum, course) => sum + (course.enrolledStudents?.length || 0), 0)
  
  // System metrics (mocked or calculated)
  const averageCourseProgress = 68 // This would normally be calculated from progress records

  return successResponse({
    totalUsers,
    totalStudents,
    totalTeachers,
    newUsersThisMonth,
    totalCourses,
    publishedCourses,
    draftCourses,
    totalEnrollments,
    averageCourseProgress,
    activeUsers: Math.floor(totalUsers * 0.4) // Mocked active user stat
  })
}

export const GET = withErrorHandling(getAdminStatsHandler)
