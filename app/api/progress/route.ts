export const dynamic = 'force-dynamic'

import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { Progress } from "@/lib/models/Progress"
import { authenticateRequest } from "@/lib/middleware/security"

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const user = authenticateRequest(request)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { courseId, lessonId, completed, quizScore, timeSpent } = await request.json()

    if (!courseId || !lessonId) {
      return NextResponse.json({ error: "Course ID and Lesson ID are required" }, { status: 400 })
    }

    // Update or create progress record
    const progressData = {
      userId: user.userId,
      courseId,
      lessonId,
      completed: completed || false,
      ...(completed && { completedAt: new Date() }),
      ...(quizScore !== undefined && { quizScore }),
      ...(timeSpent !== undefined && { timeSpent }),
    }

    const progress = await Progress.findOneAndUpdate({ userId: user.userId, courseId, lessonId }, progressData, {
      upsert: true,
      new: true,
    })

    return NextResponse.json({ success: true, progress })
  } catch (error) {
    console.error("Progress update error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const user = authenticateRequest(request)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const courseId = searchParams.get("courseId")

    const query: any = { userId: user.userId }
    if (courseId) {
      query.courseId = courseId
    }

    const progress = await Progress.find(query)
    return NextResponse.json({ progress })
  } catch (error) {
    console.error("Progress fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
