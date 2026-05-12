export const dynamic = 'force-dynamic'

import { type NextRequest, NextResponse } from "next/server"
import { ObjectId } from "mongodb"
import { getDatabase } from "@/lib/mongodb"
import { requireAuth } from "@/lib/middleware/auth"
import type { User } from "@/lib/models/User"

export async function GET(request: NextRequest) {
  try {
    const user = requireAuth(request)
    const db = await getDatabase()
    const users = db.collection<User>("users")

    const userData = await users
      .aggregate([
        { $match: { _id: new ObjectId(user.userId) } },
        {
          $lookup: {
            from: "courses",
            localField: "coursesEnrolled",
            foreignField: "_id",
            as: "enrolledCourses",
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "enrolledCourses.teacherId",
            foreignField: "_id",
            as: "teachers",
          },
        },
        {
          $project: {
            progress: 1,
            enrolledCourses: {
              $map: {
                input: "$enrolledCourses",
                as: "course",
                in: {
                  _id: "$$course._id",
                  title: "$$course.title",
                  description: "$$course.description",
                  lessonsCount: { $size: "$$course.lessons" },
                  teacher: {
                    $arrayElemAt: [
                      {
                        $filter: {
                          input: "$teachers",
                          cond: { $eq: ["$$this._id", "$$course.teacherId"] },
                        },
                      },
                      0,
                    ],
                  },
                },
              },
            },
          },
        },
      ])
      .toArray()

    if (userData.length === 0) {
      return NextResponse.json({ courses: [] })
    }

    const userProgress = userData[0].progress || {}
    const coursesWithProgress = userData[0].enrolledCourses.map((course: any) => {
      const courseProgress = userProgress[course._id.toString()] || {
        completedLessons: [],
        overallProgress: 0,
      }

      return {
        ...course,
        progress: courseProgress.overallProgress,
        completedLessons: courseProgress.completedLessons.length,
        teacher: {
          username: course.teacher?.username || "Unknown",
        },
      }
    })

    return NextResponse.json({ courses: coursesWithProgress })
  } catch (error) {
    console.error("Error fetching enrolled courses:", error)
    if (error instanceof Error && error.message.includes("Authentication")) {
      return NextResponse.json({ error: error.message }, { status: 401 })
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
