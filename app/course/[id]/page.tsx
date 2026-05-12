"use client"



import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { CourseEnrollment } from "@/components/course-enrollment"
import { ArrowLeft, BookOpen, Users, Clock, Star, Play, CheckCircle } from "lucide-react"

interface Lesson {
  _id: string
  title: string
  type: "text" | "quiz" | "video"
  order: number
  isPublished: boolean
}

interface Course {
  _id: string
  title: string
  description: string
  shortDescription?: string
  teacherName: string
  category: string
  difficulty: "beginner" | "intermediate" | "advanced"
  estimatedDuration: number
  enrolledStudents: number
  rating: number
  totalRatings: number
  thumbnail?: string
  tags: string[]
  lessons: Lesson[]
  isPublished: boolean
  createdAt: string
}

export default function CourseDetailPage() {
  const params = useParams()
  const router = useRouter()
  const courseId = params.id as string
  const [course, setCourse] = useState<Course | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isEnrolled, setIsEnrolled] = useState(false)

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await fetch(`/api/courses/${courseId}`)
        if (response.ok) {
          const data = await response.json()
          setCourse(data.data.course)
        } else {
          console.error('Failed to fetch course')
        }
      } catch (error) {
        console.error('Error fetching course:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCourse()
  }, [courseId])

  const handleEnroll = (enrolledCourseId: string) => {
    setIsEnrolled(true)
    // Optionally redirect to the course or show success message
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-100 text-green-800'
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800'
      case 'advanced':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getLessonIcon = (type: string) => {
    switch (type) {
      case 'text':
        return <BookOpen className="h-4 w-4 text-blue-600" />
      case 'video':
        return <Play className="h-4 w-4 text-red-600" />
      case 'quiz':
        return <CheckCircle className="h-4 w-4 text-purple-600" />
      default:
        return <BookOpen className="h-4 w-4 text-gray-600" />
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Skeleton className="h-8 w-32 mb-4" />
          <Skeleton className="h-8 w-96 mb-2" />
          <Skeleton className="h-4 w-64" />
        </div>
        
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2 mb-4" />
                <Skeleton className="h-32 w-full" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4" />
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Skeleton className="h-96 w-full" />
          </div>
        </div>
      </div>
    )
  }

  if (!course) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Course Not Found</h1>
          <p className="text-gray-600 mb-4">The course you're looking for doesn't exist.</p>
          <Button onClick={() => router.push('/courses')}>
            Browse Courses
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button 
          variant="ghost" 
          onClick={() => router.back()} 
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Course Header */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{course.title}</h1>
                  <p className="text-lg text-gray-600 mb-4">by {course.teacherName}</p>
                  <div className="flex items-center gap-4 mb-4">
                    <Badge className={getDifficultyColor(course.difficulty)}>
                      {course.difficulty}
                    </Badge>
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span>{course.rating.toFixed(1)} ({course.totalRatings} ratings)</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Users className="h-4 w-4" />
                      <span>{course.enrolledStudents} students</span>
                    </div>
                  </div>
                </div>
                {course.thumbnail && (
                  <div className="w-32 h-24 bg-gray-100 rounded-lg overflow-hidden">
                    <img 
                      src={course.thumbnail} 
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
              
              <p className="text-gray-700 leading-relaxed">{course.description}</p>
            </CardHeader>
          </Card>

          {/* Course Content */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Course Content</CardTitle>
              <CardDescription>
                {course.lessons.length} lessons • {course.estimatedDuration} hours total
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {course.lessons
                  .filter(lesson => lesson.isPublished)
                  .sort((a, b) => a.order - b.order)
                  .map((lesson, index) => (
                    <div key={lesson._id} className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex-shrink-0">
                        {getLessonIcon(lesson.type)}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{lesson.title}</h3>
                        <p className="text-sm text-gray-500 capitalize">{lesson.type} lesson</p>
                      </div>
                      <div className="text-sm text-gray-500">
                        Lesson {index + 1}
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>

          {/* Course Tags */}
          {course.tags.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Tags</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {course.tags.map((tag) => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <CourseEnrollment 
            course={{
              ...course,
              isEnrolled
            }}
            onEnroll={handleEnroll}
          />
        </div>
      </div>
    </div>
  )
}
