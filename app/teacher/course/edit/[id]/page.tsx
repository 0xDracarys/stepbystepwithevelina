"use client"



import type React from "react"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Plus, Edit, Trash2, BookOpen, Play, CheckCircle } from "lucide-react"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { useAuth } from "@/hooks/use-auth"
import { LessonModal } from "@/components/teacher/lesson-modal"

interface Lesson {
  _id: string
  title: string
  type: "text" | "quiz" | "video"
  order: number
  content: any
}

interface CourseData {
  _id: string
  title: string
  description: string
  lessons: Lesson[]
  isPublished: boolean
  enrolledStudents: number
}

export default function EditCoursePage() {
  const params = useParams()
  const courseId = params.id as string
  const router = useRouter()
  const { token } = useAuth()

  const [course, setCourse] = useState<CourseData | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  })
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [showLessonModal, setShowLessonModal] = useState(false)
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null)

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await fetch(`/api/courses/${courseId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (response.ok) {
          const data = await response.json()
          setCourse(data.course)
          setFormData({
            title: data.course.title,
            description: data.course.description,
          })
        }
      } catch (error) {
        console.error("Error fetching course:", error)
      } finally {
        setIsLoading(false)
      }
    }

    if (token) {
      fetchCourse()
    }
  }, [courseId, token])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsSaving(true)

    try {
      const response = await fetch(`/api/courses/${courseId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to update course")
      }

      setCourse((prev) => (prev ? { ...prev, ...formData } : null))
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteLesson = async (lessonId: string) => {
    if (!confirm("Are you sure you want to delete this lesson?")) return

    try {
      const response = await fetch(`/api/courses/${courseId}/lessons/${lessonId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        setCourse((prev) =>
          prev
            ? {
                ...prev,
                lessons: prev.lessons.filter((lesson) => lesson._id !== lessonId),
              }
            : null,
        )
      }
    } catch (error) {
      console.error("Error deleting lesson:", error)
    }
  }

  const handleLessonSaved = (savedLesson: Lesson) => {
    setCourse((prev) => {
      if (!prev) return null

      if (editingLesson) {
        // Update existing lesson
        return {
          ...prev,
          lessons: prev.lessons.map((lesson) => (lesson._id === savedLesson._id ? savedLesson : lesson)),
        }
      } else {
        // Add new lesson
        return {
          ...prev,
          lessons: [...prev.lessons, savedLesson],
        }
      }
    })

    setShowLessonModal(false)
    setEditingLesson(null)
  }

  const getLessonIcon = (type: string) => {
    switch (type) {
      case "text":
        return <BookOpen className="h-4 w-4 text-blue-600" />
      case "quiz":
        return <CheckCircle className="h-4 w-4 text-purple-600" />
      case "video":
        return <Play className="h-4 w-4 text-red-600" />
      default:
        return <BookOpen className="h-4 w-4 text-gray-600" />
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading course...</p>
        </div>
      </div>
    )
  }

  if (!course) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="text-center py-12">
          <CardContent>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Course Not Found</h1>
            <p className="text-gray-600">
              The course you're looking for doesn't exist or you don't have permission to edit it.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <ProtectedRoute allowedRoles={["teacher"]}>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-6">
          <Button variant="ghost" onClick={() => router.push("/teacher/dashboard")} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit Course</h1>
              <p className="text-gray-600">Manage your course content and settings</p>
            </div>
            <Badge variant={course.isPublished ? "default" : "secondary"}>
              {course.isPublished ? "Published" : "Draft"}
            </Badge>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Course Information */}
          <Card>
            <CardHeader>
              <CardTitle>Course Information</CardTitle>
              <CardDescription>Update your course details</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="title">Course Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Course Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                    rows={4}
                    required
                  />
                </div>

                <Button type="submit" disabled={isSaving}>
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Course Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Course Statistics</CardTitle>
              <CardDescription>Overview of your course performance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Lessons</span>
                <span className="font-medium">{course.lessons.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Enrolled Students</span>
                <span className="font-medium">{course.enrolledStudents}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status</span>
                <Badge variant={course.isPublished ? "default" : "secondary"}>
                  {course.isPublished ? "Published" : "Draft"}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Lessons Management */}
        <Card className="mt-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Course Lessons</CardTitle>
                <CardDescription>Manage the content of your course</CardDescription>
              </div>
              <Button onClick={() => setShowLessonModal(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Lesson
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {course.lessons.length === 0 ? (
              <div className="text-center py-8">
                <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No lessons yet</h3>
                <p className="text-gray-600 mb-4">Start building your course by adding your first lesson</p>
                <Button onClick={() => setShowLessonModal(true)}>Add Your First Lesson</Button>
              </div>
            ) : (
              <div className="space-y-3">
                {course.lessons
                  .sort((a, b) => a.order - b.order)
                  .map((lesson, index) => (
                    <div key={lesson._id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        {getLessonIcon(lesson.type)}
                        <div>
                          <h4 className="font-medium">
                            {index + 1}. {lesson.title}
                          </h4>
                          <Badge variant="outline" className="text-xs mt-1">
                            {lesson.type}
                          </Badge>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setEditingLesson(lesson)
                            setShowLessonModal(true)
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteLesson(lesson._id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Lesson Modal */}
        <LessonModal
          isOpen={showLessonModal}
          onClose={() => {
            setShowLessonModal(false)
            setEditingLesson(null)
          }}
          onSave={handleLessonSaved}
          courseId={courseId}
          lesson={editingLesson}
          token={token}
        />
      </div>
    </ProtectedRoute>
  )
}
