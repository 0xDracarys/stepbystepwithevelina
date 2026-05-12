export const dynamic = 'force-dynamic'

import { type NextRequest, NextResponse } from "next/server"
import { ObjectId } from "mongodb"
import { getDatabase } from "@/lib/mongodb"
import { requireRole } from "@/lib/middleware/auth"
import type { Course, Lesson } from "@/lib/models/Course"

// POST /api/courses/[id]/lessons - Add a lesson to a course
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = requireRole(request, ["teacher", "admin"])
    const { id } = await params
    const { title, type, content } = await request.json()

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid course ID" }, { status: 400 })
    }

    if (!title || !type || !content) {
      return NextResponse.json({ error: "Title, type, and content are required" }, { status: 400 })
    }

    if (!["text", "quiz", "video"].includes(type)) {
      return NextResponse.json({ error: "Invalid lesson type" }, { status: 400 })
    }

    const db = await getDatabase()
    const courses = db.collection<Course>("courses")

    // Check if course exists and user has permission
    const existingCourse = await courses.findOne({ _id: new ObjectId(id) })
    if (!existingCourse) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 })
    }

    // Only allow course owner or admin to add lessons
    if (user.role !== "admin" && existingCourse.teacherId.toString() !== user.userId) {
      return NextResponse.json({ error: "You can only add lessons to your own courses" }, { status: 403 })
    }

    const newLesson: Lesson = {
      _id: new ObjectId(),
      title,
      type,
      content,
      order: existingCourse.lessons.length + 1,
      isPublished: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await courses.updateOne(
      { _id: new ObjectId(id) },
      {
        $push: { lessons: newLesson },
        $set: { updatedAt: new Date() },
      },
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 })
    }

    return NextResponse.json(
      {
        message: "Lesson added successfully",
        lessonId: newLesson._id,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error adding lesson:", error)
    if (error instanceof Error && error.message.includes("Authentication")) {
      return NextResponse.json({ error: error.message }, { status: 401 })
    }
    if (error instanceof Error && error.message.includes("permissions")) {
      return NextResponse.json({ error: error.message }, { status: 403 })
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
