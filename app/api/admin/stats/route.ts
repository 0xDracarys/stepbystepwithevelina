export const dynamic = 'force-dynamic'

import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import { requireRole } from "@/lib/middleware/auth"
import type { User } from "@/lib/models/User"
import type { Course } from "@/lib/models/Course"

export async function GET(request: NextRequest) {
  try {
    requireRole(request, ["admin"])
    const db = await getDatabase()
    const users = db.collection<User>("users")
    const courses = db.collection<Course>("courses")

    // Get user statistics
    const totalUsers = await users.countDocuments()
    const totalStudents = await users.countDocuments({ role: "student" })
    const totalTeachers = await users.countDocuments({ role: "teacher" })

    // Get course statistics
    const totalCourses = await courses.countDocuments()
    const publishedCourses = await courses.countDocuments({ isPublished: true })

    // Get total enrollments
    const enrollmentStats = await courses
      .aggregate([
        {
          $group: {
            _id: null,
            totalEnrollments: { $sum: { $size: "$enrolledStudents" } },
          },
        },
      ])
      .toArray()

    const totalEnrollments = enrollmentStats[0]?.totalEnrollments || 0

    // Get recent users (last 10)
    const recentUsers = await users
      .find({}, { projection: { password: 0 } })
      .sort({ createdAt: -1 })
      .limit(10)
      .toArray()

    // Get recent courses with teacher info
    const recentCourses = await courses
      .aggregate([
        { $sort: { createdAt: -1 } },
        { $limit: 10 },
        {
          $lookup: {
            from: "users",
            localField: "teacherId",
            foreignField: "_id",
            as: "teacher",
          },
        },
        {
          $project: {
            title: 1,
            createdAt: 1,
            enrolledStudents: { $size: "$enrolledStudents" },
            teacher: {
              $arrayElemAt: [
                {
                  $map: {
                    input: "$teacher",
                    as: "t",
                    in: "$$t.username",
                  },
                },
                0,
              ],
            },
          },
        },
      ])
      .toArray()

    return NextResponse.json({
      totalUsers,
      totalStudents,
      totalTeachers,
      totalCourses,
      publishedCourses,
      totalEnrollments,
      recentUsers: recentUsers.map((user) => ({
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      })),
      recentCourses,
    })
  } catch (error) {
    console.error("Error fetching admin stats:", error)
    if (error instanceof Error && error.message.includes("Authentication")) {
      return NextResponse.json({ error: error.message }, { status: 401 })
    }
    if (error instanceof Error && error.message.includes("permissions")) {
      return NextResponse.json({ error: error.message }, { status: 403 })
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
