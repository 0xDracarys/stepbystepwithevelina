"use client"



import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { LessonViewer } from "@/components/lessons/lesson-viewer"

interface Lesson {
  _id: string
  title: string
  type: "text" | "quiz" | "video"
  content: {
    text?: string
    questions?: Array<{
      question: string
      options: string[]
      correctAnswer: number
      explanation?: string
      points: number
    }>
    videoUrl?: string
    duration?: number
  }
  order: number
  isPublished: boolean
}

interface CourseData {
  _id: string
  title: string
  lessons: Lesson[]
}

export default function LessonPage() {
  const params = useParams()
  const router = useRouter()
  const courseId = params.id as string
  const lessonId = params.lessonId as string
  const [course, setCourse] = useState<CourseData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { token } = useAuth()

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const response = await fetch(`/api/courses/${courseId}`)
        if (response.ok) {
          const data = await response.json()
          setCourse(data.data.course)
        }
      } catch (error) {
        console.error("Error fetching course:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCourseData()
  }, [courseId])

  const handleNavigateToLesson = (newLessonId: string) => {
    router.push(`/course/${courseId}/lesson/${newLessonId}`)
  }

  const handleLessonComplete = (completedLessonId: string, completed: boolean, quizScore?: number) => {
    // Progress is handled by the LessonViewer component
    console.log(`Lesson ${completedLessonId} completed:`, completed, quizScore)
  }

  if (isLoading) {
    return (
      <ProtectedRoute allowedRoles={["student"]}>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Loading lesson...</p>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  if (!course) {
    return (
      <ProtectedRoute allowedRoles={["student"]}>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Course Not Found</h1>
            <p className="text-gray-600">The course you're looking for doesn't exist.</p>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute allowedRoles={["student"]}>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => router.push(`/course/${courseId}`)} 
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Course
          </Button>
        </div>

        <LessonViewer
          courseId={courseId}
          course={course}
          currentLessonId={lessonId}
          onLessonComplete={handleLessonComplete}
          onNavigateToLesson={handleNavigateToLesson}
        />
      </div>
    </ProtectedRoute>
  )
}
