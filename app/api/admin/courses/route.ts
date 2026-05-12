export const dynamic = 'force-dynamic'

import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import { requireRole } from "@/lib/middleware/auth"
import type { Course } from "@/lib/models/Course"

export async function GET(request: NextRequest) {
  try {
    requireRole(request, ["admin"])
    const db = await getDatabase()
    const courses = db.collection<Course>("courses")

    const allCourses = await courses
      .aggregate([
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
            description: 1,
            isPublished: 1,
            createdAt: 1,
            updatedAt: 1,
            lessonsCount: { $size: "$lessons" },
            enrolledStudents: { $size: "$enrolledStudents" },
            teacher: {
              $arrayElemAt: [
                {
                  $map: {
                    input: "$teacher",
                    as: "t",
                    in: {
                      username: "$$t.username",
                      email: "$$t.email",
                    },
                  },
                },
                0,
              ],
            },
          },
        },
        { $sort: { createdAt: -1 } },
      ])
      .toArray()

    return NextResponse.json({ courses: allCourses })
  } catch (error) {
    console.error("Error fetching courses:", error)
    if (error instanceof Error && error.message.includes("Authentication")) {
      return NextResponse.json({ error: error.message }, { status: 401 })
    }
    if (error instanceof Error && error.message.includes("permissions")) {
      return NextResponse.json({ error: error.message }, { status: 403 })
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
