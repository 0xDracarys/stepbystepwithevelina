"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/hooks/use-auth"
import { BookOpen, Users, Clock, Star, CheckCircle, AlertCircle } from "lucide-react"

interface CourseEnrollmentProps {
  course: {
    _id: string
    title: string
    description: string
    teacherName: string
    difficulty: string
    estimatedDuration: number
    enrolledStudents: number
    rating: number
    totalRatings: number
    isEnrolled?: boolean
  }
  onEnroll?: (courseId: string) => void
}

export function CourseEnrollment({ course, onEnroll }: CourseEnrollmentProps) {
  const [isEnrolling, setIsEnrolling] = useState(false)
  const [enrollmentStatus, setEnrollmentStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const { token, user } = useAuth()

  const handleEnroll = async () => {
    if (!token || !user) {
      // Redirect to login
      window.location.href = '/auth/login'
      return
    }

    setIsEnrolling(true)
    setEnrollmentStatus('idle')

    try {
      const response = await fetch(`/api/courses/${course._id}/enroll`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        setEnrollmentStatus('success')
        onEnroll?.(course._id)
      } else {
        const errorData = await response.json()
        setEnrollmentStatus('error')
        console.error('Enrollment failed:', errorData)
      }
    } catch (error) {
      setEnrollmentStatus('error')
      console.error('Enrollment error:', error)
    } finally {
      setIsEnrolling(false)
    }
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

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-2xl mb-2">{course.title}</CardTitle>
            <CardDescription className="text-base mb-4">
              by {course.teacherName}
            </CardDescription>
            <p className="text-gray-600 mb-4">{course.description}</p>
          </div>
          <Badge className={getDifficultyColor(course.difficulty)}>
            {course.difficulty}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Course Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Users className="h-4 w-4" />
            <span>{course.enrolledStudents} students</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock className="h-4 w-4" />
            <span>{course.estimatedDuration}h</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Star className="h-4 w-4 text-yellow-500 fill-current" />
            <span>{course.rating.toFixed(1)} ({course.totalRatings})</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <BookOpen className="h-4 w-4" />
            <span>Self-paced</span>
          </div>
        </div>

        {/* Enrollment Status */}
        {enrollmentStatus === 'success' && (
          <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <span className="text-green-800 font-medium">
              Successfully enrolled! You can now access the course.
            </span>
          </div>
        )}

        {enrollmentStatus === 'error' && (
          <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <span className="text-red-800 font-medium">
              Enrollment failed. Please try again.
            </span>
          </div>
        )}

        {/* Enrollment Button */}
        <div className="flex gap-4">
          {course.isEnrolled ? (
            <Button 
              className="flex-1 bg-green-600 hover:bg-green-700"
              onClick={() => window.location.href = `/course/${course._id}`}
            >
              <BookOpen className="h-4 w-4 mr-2" />
              Continue Learning
            </Button>
          ) : (
            <Button 
              className="flex-1 bg-indigo-600 hover:bg-indigo-700"
              onClick={handleEnroll}
              disabled={isEnrolling}
            >
              {isEnrolling ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Enrolling...
                </>
              ) : (
                <>
                  <BookOpen className="h-4 w-4 mr-2" />
                  Enroll Now
                </>
              )}
            </Button>
          )}
          
          <Button variant="outline" className="px-6">
            Preview
          </Button>
        </div>

        {/* Course Features */}
        <div className="border-t pt-4">
          <h3 className="font-semibold text-gray-900 mb-3">What you'll learn:</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span>Interactive lessons with real-world examples</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span>Quizzes to test your understanding</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span>Progress tracking and certificates</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span>Lifetime access to course materials</span>
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
