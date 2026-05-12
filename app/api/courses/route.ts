export const dynamic = 'force-dynamic'

import { type NextRequest } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { CourseModel } from "@/lib/models/Course"
import { withErrorHandling, successResponse } from "@/lib/api/apiUtils"

async function getCoursesHandler(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const page = parseInt(searchParams.get("page") || "1")
  const limit = parseInt(searchParams.get("limit") || "10")
  const category = searchParams.get("category")
  const difficulty = searchParams.get("difficulty")
  const search = searchParams.get("search")

  await connectDB()

  // Build query filter
  const filter: any = { isPublished: true }

  if (category && category !== "all") {
    filter.category = category
  }

  if (difficulty && difficulty !== "all") {
    filter.difficulty = difficulty
  }

  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
      { teacherName: { $regex: search, $options: "i" } },
      { tags: { $regex: search, $options: "i" } },
    ]
  }

  const total = await CourseModel.countDocuments(filter)
  const courses = await CourseModel.find(filter)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .lean()

  // Map courses to include enrolledStudents count instead of full array
  const mappedCourses = courses.map((course: any) => ({
    _id: course._id,
    title: course.title,
    description: course.description,
    shortDescription: course.shortDescription,
    teacherName: course.teacherName,
    teacherId: course.teacherId,
    category: course.category,
    difficulty: course.difficulty,
    estimatedDuration: course.estimatedDuration,
    enrolledStudents: course.enrolledStudents?.length || 0,
    rating: course.rating,
    totalRatings: course.totalRatings,
    tags: course.tags,
    thumbnail: course.thumbnail,
    createdAt: course.createdAt,
    lessons: course.lessons?.map((l: any) => ({
      _id: l._id,
      title: l.title,
      type: l.type,
      order: l.order,
    })),
  }))

  return successResponse({
    courses: mappedCourses,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  })
}

export const GET = withErrorHandling(getCoursesHandler)