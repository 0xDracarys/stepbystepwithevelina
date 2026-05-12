export const dynamic = 'force-dynamic'

import { type NextRequest, NextResponse } from "next/server"
import { ObjectId } from "mongodb"
import { getDatabase } from "@/lib/mongodb"
import { requireRole } from "@/lib/middleware/auth"
import type { Course } from "@/lib/models/Course"

// PUT /api/courses/[id]/lessons/[lessonId] - Update a lesson
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string; lessonId: string }> }) {
  try {
    const user = requireRole(request, ["teacher", "admin"])
    const { id, lessonId } = await params
    const updateData = await request.json()

    if (!ObjectId.isValid(id) || !ObjectId.isValid(lessonId)) {
      return NextResponse.json({ error: "Invalid course or lesson ID" }, { status: 400 })
    }

    const db = await getDatabase()
    const courses = db.collection<Course>("courses")

    // Check if course exists and user has permission
    const existingCourse = await courses.findOne({ _id: new ObjectId(id) })
    if (!existingCourse) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 })
    }

    // Only allow course owner or admin to update lessons
    if (user.role !== "admin" && existingCourse.teacherId.toString() !== user.userId) {
      return NextResponse.json({ error: "You can only update lessons in your own courses" }, { status: 403 })
    }

    const allowedFields = ["title", "type", "content"]
    const updateFields: any = {}

    Object.keys(updateData).forEach((key) => {
      if (allowedFields.includes(key)) {
        updateFields[`lessons.$.${key}`] = updateData[key]
      }
    })

    updateFields.updatedAt = new Date()

    const result = await courses.updateOne(
      {
        _id: new ObjectId(id),
        "lessons._id": new ObjectId(lessonId),
      },
      { $set: updateFields },
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Course or lesson not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Lesson updated successfully" })
  } catch (error) {
    console.error("Error updating lesson:", error)
    if (error instanceof Error && error.message.includes("Authentication")) {
      return NextResponse.json({ error: error.message }, { status: 401 })
    }
    if (error instanceof Error && error.message.includes("permissions")) {
      return NextResponse.json({ error: error.message }, { status: 403 })
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// DELETE /api/courses/[id]/lessons/[lessonId] - Delete a lesson
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string; lessonId: string }> }) {
  try {
    const user = requireRole(request, ["teacher", "admin"])
    const { id, lessonId } = await params

    if (!ObjectId.isValid(id) || !ObjectId.isValid(lessonId)) {
      return NextResponse.json({ error: "Invalid course or lesson ID" }, { status: 400 })
    }

    const db = await getDatabase()
    const courses = db.collection<Course>("courses")

    // Check if course exists and user has permission
    const existingCourse = await courses.findOne({ _id: new ObjectId(id) })
    if (!existingCourse) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 })
    }

    // Only allow course owner or admin to delete lessons
    if (user.role !== "admin" && existingCourse.teacherId.toString() !== user.userId) {
      return NextResponse.json({ error: "You can only delete lessons from your own courses" }, { status: 403 })
    }

    const result = await courses.updateOne(
      { _id: new ObjectId(id) },
      {
        $pull: { lessons: { _id: new ObjectId(lessonId) } },
        $set: { updatedAt: new Date() },
      },
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Lesson deleted successfully" })
  } catch (error) {
    console.error("Error deleting lesson:", error)
    if (error instanceof Error && error.message.includes("Authentication")) {
      return NextResponse.json({ error: error.message }, { status: 401 })
    }
    if (error instanceof Error && error.message.includes("permissions")) {
      return NextResponse.json({ error: error.message }, { status: 403 })
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
