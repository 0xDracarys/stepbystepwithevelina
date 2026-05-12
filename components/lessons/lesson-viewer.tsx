"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { BookOpen, Play, CheckCircle, ArrowLeft, ArrowRight, Clock } from "lucide-react"
import { QuizComponent } from "./quiz-component"
import { useAuth } from "@/hooks/use-auth"

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

interface Course {
  _id: string
  title: string
  lessons: Lesson[]
}

interface LessonViewerProps {
  courseId: string
  course: Course
  currentLessonId: string
  onLessonComplete?: (lessonId: string, completed: boolean, quizScore?: number) => void
  onNavigateToLesson?: (lessonId: string) => void
}

export function LessonViewer({ 
  courseId, 
  course, 
  currentLessonId, 
  onLessonComplete,
  onNavigateToLesson 
}: LessonViewerProps) {
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isCompleted, setIsCompleted] = useState(false)
  const [timeSpent, setTimeSpent] = useState(0)
  const { token } = useAuth()

  useEffect(() => {
    const lesson = course.lessons.find(l => l._id === currentLessonId)
    setCurrentLesson(lesson || null)
    setIsLoading(false)
  }, [currentLessonId, course.lessons])

  // Timer effect
  useEffect(() => {
    if (currentLesson && !isCompleted) {
      const timer = setInterval(() => {
        setTimeSpent(prev => prev + 1)
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [currentLesson, isCompleted])

  const getCurrentLessonIndex = () => {
    return course.lessons.findIndex(l => l._id === currentLessonId)
  }

  const getNextLesson = () => {
    const currentIndex = getCurrentLessonIndex()
    return currentIndex < course.lessons.length - 1 ? course.lessons[currentIndex + 1] : null
  }

  const getPreviousLesson = () => {
    const currentIndex = getCurrentLessonIndex()
    return currentIndex > 0 ? course.lessons[currentIndex - 1] : null
  }

  const handleNavigateToLesson = (lessonId: string) => {
    setTimeSpent(0)
    setIsCompleted(false)
    onNavigateToLesson?.(lessonId)
  }

  const handleLessonComplete = async (completed: boolean, quizScore?: number) => {
    if (!currentLesson || !token) return

    try {
      const response = await fetch("/api/students/progress", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          courseId,
          lessonId: currentLesson._id,
          completed,
          quizScore,
          timeSpent,
        }),
      })

      if (response.ok) {
        setIsCompleted(completed)
        onLessonComplete?.(currentLesson._id, completed, quizScore)
      }
    } catch (error) {
      console.error("Error updating progress:", error)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const getProgressPercentage = () => {
    const currentIndex = getCurrentLessonIndex()
    return ((currentIndex + 1) / course.lessons.length) * 100
  }

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-64 w-full" />
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!currentLesson) {
    return (
      <Card className="max-w-4xl mx-auto">
        <CardContent className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Lesson Not Found</h2>
          <p className="text-gray-600">The lesson you're looking for doesn't exist.</p>
        </CardContent>
      </Card>
    )
  }

  const nextLesson = getNextLesson()
  const previousLesson = getPreviousLesson()

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Lesson Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between mb-4">
            <div>
              <CardTitle className="text-2xl">{currentLesson.title}</CardTitle>
              <CardDescription>
                Lesson {getCurrentLessonIndex() + 1} of {course.lessons.length} • {course.title}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-500">{formatTime(timeSpent)}</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Course Progress</span>
              <span>{Math.round(getProgressPercentage())}%</span>
            </div>
            <Progress value={getProgressPercentage()} className="h-2" />
          </div>
        </CardHeader>
      </Card>

      {/* Lesson Content */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            {currentLesson.type === "text" && <BookOpen className="h-5 w-5 text-blue-600" />}
            {currentLesson.type === "video" && <Play className="h-5 w-5 text-red-600" />}
            {currentLesson.type === "quiz" && <CheckCircle className="h-5 w-5 text-purple-600" />}
            <Badge variant="outline" className="capitalize">
              {currentLesson.type}
            </Badge>
            {isCompleted && (
              <Badge variant="default" className="bg-green-600">
                <CheckCircle className="h-3 w-3 mr-1" />
                Completed
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {currentLesson.type === "text" && (
            <div className="prose max-w-none">
              <div 
                className="text-gray-700 leading-relaxed whitespace-pre-wrap"
                dangerouslySetInnerHTML={{ __html: currentLesson.content.text || "" }}
              />
            </div>
          )}

          {currentLesson.type === "video" && (
            <div className="space-y-4">
              {currentLesson.content.videoUrl ? (
                <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                  <iframe
                    src={currentLesson.content.videoUrl}
                    className="w-full h-full"
                    allowFullScreen
                    title={currentLesson.title}
                  />
                </div>
              ) : (
                <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                  <p className="text-gray-500">Video content not available</p>
                </div>
              )}
              {currentLesson.content.duration && (
                <p className="text-sm text-gray-600">
                  Duration: {Math.floor(currentLesson.content.duration / 60)} minutes
                </p>
              )}
            </div>
          )}

          {currentLesson.type === "quiz" && currentLesson.content.questions && (
            <QuizComponent
              courseId={courseId}
              lessonId={currentLesson._id}
              questions={currentLesson.content.questions}
              onComplete={(score, timeSpent) => {
                handleLessonComplete(true, score)
              }}
            />
          )}

          {/* Mark as Complete Button for text and video lessons */}
          {currentLesson.type !== "quiz" && !isCompleted && (
            <div className="mt-6 text-center">
              <Button
                onClick={() => handleLessonComplete(true)}
                className="bg-green-600 hover:bg-green-700"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Mark as Complete
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={() => previousLesson && handleNavigateToLesson(previousLesson._id)}
              disabled={!previousLesson}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                {getCurrentLessonIndex() + 1} of {course.lessons.length} lessons
              </p>
            </div>

            <Button
              onClick={() => nextLesson && handleNavigateToLesson(nextLesson._id)}
              disabled={!nextLesson}
            >
              Next
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
