export const dynamic = 'force-dynamic'

import { type NextRequest } from "next/server"
import { withErrorHandling, successResponse } from "@/lib/api/apiUtils"
import { ApiErrors } from "@/lib/middleware/security"
import { requireAuth } from "@/lib/middleware/security"

async function createCourseHandler(request: NextRequest) {
  const user = await requireAuth(request)
  
  if (user.role !== "teacher") {
    throw ApiErrors.FORBIDDEN("Only teachers can create courses")
  }

  const body = await request.json()
  const {
    title,
    description,
    shortDescription,
    category,
    tags,
    difficulty,
    estimatedDuration,
    thumbnail,
    lessons
  } = body

  // Validate required fields
  if (!title || !description || !category || !difficulty) {
    throw ApiErrors.BAD_REQUEST("Missing required fields")
  }

  // For now, return a mock response since we don't have MongoDB connected
  const courseId = `course_${Date.now()}`
  
  // In a real implementation, you would:
  // 1. Validate the data
  // 2. Save to database
  // 3. Return the created course

  return successResponse({
    courseId,
    message: "Course created successfully"
  })
}

async function getTeacherCoursesHandler(request: NextRequest) {
  const user = await requireAuth(request)
  
  if (user.role !== "teacher") {
    throw ApiErrors.FORBIDDEN("Only teachers can view their courses")
  }

  // Mock data for now
  const courses = [
    {
      _id: "1",
      title: "Complete Spanish for Beginners",
      description: "Learn Spanish from scratch with this comprehensive course designed for absolute beginners.",
      shortDescription: "Master Spanish from zero with interactive lessons and real-world practice.",
      category: "spanish",
      difficulty: "beginner",
      estimatedDuration: 40,
      enrolledStudents: 1250,
      rating: 4.8,
      totalRatings: 320,
      tags: ["spanish", "beginner", "conversation", "grammar"],
      thumbnail: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=500&h=300&fit=crop",
      isPublished: true,
      createdAt: "2024-01-15T10:00:00Z",
      lessons: [
        {
          _id: "l1",
          title: "Introduction to Spanish",
          type: "text",
          duration: 15,
          order: 1
        },
        {
          _id: "l2",
          title: "Basic Greetings",
          type: "video",
          duration: 20,
          order: 2
        },
        {
          _id: "l3",
          title: "Numbers and Colors",
          type: "quiz",
          duration: 25,
          order: 3
        }
      ]
    },
    {
      _id: "2",
      title: "French Conversation Mastery",
      description: "Improve your French speaking skills through interactive conversations, role-plays, and real-life scenarios.",
      shortDescription: "Boost your French speaking confidence with practical conversation practice.",
      category: "french",
      difficulty: "intermediate",
      estimatedDuration: 35,
      enrolledStudents: 890,
      rating: 4.7,
      totalRatings: 245,
      tags: ["french", "conversation", "intermediate", "speaking"],
      thumbnail: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=300&fit=crop",
      isPublished: true,
      createdAt: "2024-01-20T10:00:00Z",
      lessons: [
        {
          _id: "l4",
          title: "Everyday Conversations",
          type: "video",
          duration: 30,
          order: 1
        },
        {
          _id: "l5",
          title: "Business French",
          type: "text",
          duration: 25,
          order: 2
        }
      ]
    }
  ]

  return successResponse({
    courses
  })
}

export const POST = withErrorHandling(createCourseHandler)
export const GET = withErrorHandling(getTeacherCoursesHandler)