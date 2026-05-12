export const dynamic = 'force-dynamic'

import { type NextRequest } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { CourseModel } from "@/lib/models/Course"
import { withErrorHandling, successResponse } from "@/lib/api/apiUtils"
import { ApiErrors } from "@/lib/middleware/security"

// Lithuanian ↔ English Language Learning Courses ONLY
const sampleCourses = [
  {
    _id: "1",
    title: "English to Lithuanian: Complete Beginner Course",
    description: "Master Lithuanian from English with this comprehensive course designed for absolute beginners. Learn essential vocabulary, grammar, and conversational skills through interactive lessons and real-world practice scenarios. Perfect for English speakers who want to connect with Lithuanian culture and heritage.",
    shortDescription: "Transform from English to Lithuanian speaker with structured, engaging lessons.",
    teacherName: "Marta Kazlauskienė",
    category: "lithuanian",
    difficulty: "beginner",
    estimatedDuration: 80,
    enrolledStudents: 1247,
    rating: 4.9,
    totalRatings: 189,
    tags: ["english-to-lithuanian", "beginner", "conversation", "grammar", "vocabulary", "culture"],
    thumbnail: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=500&h=300&fit=crop",
    createdAt: "2024-01-15T10:00:00Z"
  },
  {
    _id: "2",
    title: "Lithuanian to English: Conversational Mastery",
    description: "Develop fluent English conversation skills from Lithuanian. Perfect for Lithuanian speakers who want to master real-world English through interactive conversations, role-plays, and cultural immersion. Focus on practical communication for work, travel, and daily life.",
    shortDescription: "Speak English confidently with native-like fluency and cultural understanding.",
    teacherName: "Jonas Petras",
    category: "english",
    difficulty: "intermediate",
    estimatedDuration: 70,
    enrolledStudents: 892,
    rating: 4.8,
    totalRatings: 156,
    tags: ["lithuanian-to-english", "conversation", "intermediate", "speaking", "culture"],
    thumbnail: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=300&fit=crop",
    createdAt: "2024-01-20T10:00:00Z"
  },
  {
    _id: "3",
    title: "Lithuanian Grammar Mastery for English Speakers",
    description: "Master the complex Lithuanian grammar system from English. Learn the seven cases, verb conjugations, and sentence structure through systematic, easy-to-understand lessons. Perfect for English speakers who want to understand Lithuanian grammar deeply.",
    shortDescription: "Conquer Lithuanian grammar with clear explanations and practical exercises.",
    teacherName: "Dr. Rasa Jankauskienė",
    category: "lithuanian",
    difficulty: "intermediate",
    estimatedDuration: 90,
    enrolledStudents: 634,
    rating: 4.7,
    totalRatings: 98,
    tags: ["english-to-lithuanian", "grammar", "intermediate", "cases", "conjugation"],
    thumbnail: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=500&h=300&fit=crop",
    createdAt: "2024-01-25T10:00:00Z"
  },
  {
    _id: "4",
    title: "English Grammar for Lithuanian Speakers",
    description: "Master English grammar from a Lithuanian perspective. Learn English tenses, articles, prepositions, and sentence structure through lessons specifically designed for Lithuanian speakers. Focus on areas where English differs significantly from Lithuanian.",
    shortDescription: "Master English grammar with Lithuanian-specific explanations and examples.",
    teacherName: "Dr. Paulius Rimkus",
    category: "english",
    difficulty: "intermediate",
    estimatedDuration: 75,
    enrolledStudents: 1123,
    rating: 4.8,
    totalRatings: 201,
    tags: ["lithuanian-to-english", "grammar", "intermediate", "tenses", "articles"],
    thumbnail: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=300&fit=crop",
    createdAt: "2024-02-01T10:00:00Z"
  },
  {
    _id: "5",
    title: "Lithuanian Culture & Language Immersion",
    description: "Immerse yourself in Lithuanian culture while learning the language. Explore Lithuanian traditions, customs, history, and modern life through language learning. Perfect for understanding the cultural context behind Lithuanian expressions and behaviors.",
    shortDescription: "Discover Lithuanian culture through language and authentic materials.",
    teacherName: "Prof. Vilma Vaičiūnienė",
    category: "lithuanian",
    difficulty: "intermediate",
    estimatedDuration: 60,
    enrolledStudents: 756,
    rating: 4.9,
    totalRatings: 134,
    tags: ["lithuanian-culture", "intermediate", "traditions", "history", "immersion"],
    thumbnail: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=500&h=300&fit=crop",
    createdAt: "2024-02-05T10:00:00Z"
  },
  {
    _id: "6",
    title: "English Business Communication for Lithuanians",
    description: "Master professional English communication skills specifically designed for Lithuanian speakers. Learn business vocabulary, email writing, presentation skills, and professional etiquette in English-speaking work environments.",
    shortDescription: "Excel in English business communication with Lithuanian-specific guidance.",
    teacherName: "Dr. Paulius Rimkus",
    category: "english",
    difficulty: "advanced",
    estimatedDuration: 65,
    enrolledStudents: 445,
    rating: 4.8,
    totalRatings: 89,
    tags: ["lithuanian-to-english", "business", "professional", "advanced", "communication"],
    thumbnail: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=500&h=300&fit=crop",
    createdAt: "2024-02-10T10:00:00Z"
  },
  {
    _id: "7",
    title: "Lithuanian Pronunciation & Accent Training",
    description: "Perfect your Lithuanian pronunciation with detailed audio lessons and practice exercises. Learn the unique Lithuanian sounds, stress patterns, and intonation that are challenging for English speakers.",
    shortDescription: "Master Lithuanian pronunciation with expert guidance and practice exercises.",
    teacherName: "Marta Kazlauskienė",
    category: "lithuanian",
    difficulty: "beginner",
    estimatedDuration: 45,
    enrolledStudents: 923,
    rating: 4.7,
    totalRatings: 167,
    tags: ["english-to-lithuanian", "pronunciation", "beginner", "speaking", "accent"],
    thumbnail: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=300&fit=crop",
    createdAt: "2024-02-15T10:00:00Z"
  },
  {
    _id: "8",
    title: "English Academic Writing for Lithuanian Students",
    description: "Master English academic writing skills specifically tailored for Lithuanian students and professionals. Learn essay structure, research paper writing, citation styles, and academic vocabulary used in English-speaking universities.",
    shortDescription: "Excel in English academic writing with Lithuanian-specific guidance and examples.",
    teacherName: "Dr. Paulius Rimkus",
    category: "english",
    difficulty: "advanced",
    estimatedDuration: 55,
    enrolledStudents: 678,
    rating: 4.9,
    totalRatings: 123,
    tags: ["lithuanian-to-english", "academic", "writing", "advanced", "university"],
    thumbnail: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=500&h=300&fit=crop",
    createdAt: "2024-02-20T10:00:00Z"
  }
]

async function getCoursesHandler(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const page = parseInt(searchParams.get("page") || "1")
  const limit = parseInt(searchParams.get("limit") || "10")
  const category = searchParams.get("category")
  const difficulty = searchParams.get("difficulty")
  const search = searchParams.get("search")

  // Filter courses based on parameters
  let filteredCourses = [...sampleCourses]

  // Filter by category
  if (category && category !== "all") {
    filteredCourses = filteredCourses.filter(course => course.category === category)
  }

  // Filter by difficulty
  if (difficulty && difficulty !== "all") {
    filteredCourses = filteredCourses.filter(course => course.difficulty === difficulty)
  }

  // Filter by search term
  if (search) {
    const searchLower = search.toLowerCase()
    filteredCourses = filteredCourses.filter(course =>
      course.title.toLowerCase().includes(searchLower) ||
      course.description.toLowerCase().includes(searchLower) ||
      course.teacherName.toLowerCase().includes(searchLower) ||
      course.tags.some(tag => tag.toLowerCase().includes(searchLower))
    )
  }

  // Sort by creation date (newest first)
  filteredCourses.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  // Apply pagination
  const total = filteredCourses.length
  const startIndex = (page - 1) * limit
  const endIndex = startIndex + limit
  const paginatedCourses = filteredCourses.slice(startIndex, endIndex)

  return successResponse({
    courses: paginatedCourses,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  })
}

export const GET = withErrorHandling(getCoursesHandler)