"use client"



import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { useAuth } from "@/hooks/use-auth"
import { 
  BookOpen, 
  Users, 
  TrendingUp, 
  Plus, 
  Eye, 
  Edit, 
  Trash2, 
  BarChart3, 
  Clock, 
  Star,
  MessageCircle,
  Award,
  Target
} from "lucide-react"

interface Course {
  _id: string
  title: string
  description: string
  isPublished: boolean
  enrolledStudents: number
  lessons: Array<{
    _id: string
    title: string
    type: string
  }>
  createdAt: string
  rating: number
  totalRatings: number
}

interface TeacherStats {
  totalCourses: number
  totalStudents: number
  totalLessons: number
  averageRating: number
  publishedCourses: number
  draftCourses: number
}

export default function TeacherDashboard() {
  const [courses, setCourses] = useState<Course[]>([])
  const [stats, setStats] = useState<TeacherStats>({
    totalCourses: 0,
    totalStudents: 0,
    totalLessons: 0,
    averageRating: 0,
    publishedCourses: 0,
    draftCourses: 0
  })
  const [isLoading, setIsLoading] = useState(true)
  const { token, user } = useAuth()

  useEffect(() => {
    const fetchTeacherData = async () => {
      try {
        // Fetch teacher's courses
        const coursesResponse = await fetch("/api/teacher/courses", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (coursesResponse.ok) {
          const coursesData = await coursesResponse.json()
          setCourses(coursesData.data.courses || [])
          
          // Calculate stats
          const totalStudents = coursesData.data.courses.reduce((sum: number, course: Course) => sum + course.enrolledStudents, 0)
          const totalLessons = coursesData.data.courses.reduce((sum: number, course: Course) => sum + course.lessons.length, 0)
          const publishedCourses = coursesData.data.courses.filter((course: Course) => course.isPublished).length
          const averageRating = coursesData.data.courses.length > 0 
            ? coursesData.data.courses.reduce((sum: number, course: Course) => sum + course.rating, 0) / coursesData.data.courses.length 
            : 0

          setStats({
            totalCourses: coursesData.data.courses.length,
            totalStudents,
            totalLessons,
            averageRating: Math.round(averageRating * 100) / 100,
            publishedCourses,
            draftCourses: coursesData.data.courses.length - publishedCourses
          })
        }
      } catch (error) {
        console.error("Error fetching teacher data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    if (token) {
      fetchTeacherData()
    }
  }, [token])

  if (isLoading) {
    return (
      <ProtectedRoute allowedRoles={["teacher"]}>
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-96" />
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <Skeleton className="h-4 w-20 mb-2" />
                  <Skeleton className="h-8 w-16" />
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-16 w-full mb-4" />
                  <Skeleton className="h-2 w-full mb-2" />
                  <Skeleton className="h-4 w-1/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute allowedRoles={["teacher"]}>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.firstName || user?.username}!
          </h1>
          <p className="text-gray-600">Manage your courses and track student progress</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Courses</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalCourses}</p>
                </div>
                <BookOpen className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Students</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalStudents}</p>
                </div>
                <Users className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Lessons</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalLessons}</p>
                </div>
                <Target className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg Rating</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.averageRating}</p>
                </div>
                <Star className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
            <Link href="/teacher/course/create">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Plus className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Create New Course</h3>
                <p className="text-gray-600 text-sm">Start building your next language course</p>
              </CardContent>
            </Link>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
            <Link href="/teacher/analytics">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <BarChart3 className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-semibold text-lg mb-2">View Analytics</h3>
                <p className="text-gray-600 text-sm">Track student progress and engagement</p>
              </CardContent>
            </Link>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
            <Link href="/teacher/students">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Manage Students</h3>
                <p className="text-gray-600 text-sm">View and communicate with your students</p>
              </CardContent>
            </Link>
          </Card>
        </div>

        {/* Courses Section */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">My Courses</h2>
            <Link href="/teacher/course/create">
              <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
                <Plus className="mr-2 h-4 w-4" />
                Create Course
              </Button>
            </Link>
          </div>

          {courses.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <div className="text-4xl mb-4">📚</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No courses created yet</h3>
                <p className="text-gray-600 mb-4">Start your teaching journey by creating your first course</p>
                <Link href="/teacher/course/create">
                  <Button>Create Your First Course</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <Card key={course._id} className="hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-1">{course.title}</CardTitle>
                        <CardDescription className="text-sm line-clamp-2">
                          {course.description}
                        </CardDescription>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Badge variant={course.isPublished ? "default" : "secondary"}>
                          {course.isPublished ? "Published" : "Draft"}
                        </Badge>
                        {course.rating > 0 && (
                          <div className="flex items-center gap-1 text-sm">
                            <Star className="h-3 w-3 text-yellow-500 fill-current" />
                            <span>{course.rating}</span>
                            <span className="text-gray-500">({course.totalRatings})</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          <span>{course.enrolledStudents} students</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <BookOpen className="h-4 w-4" />
                          <span>{course.lessons.length} lessons</span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Link href={`/course/${course._id}`} className="flex-1">
                          <Button variant="outline" size="sm" className="w-full">
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </Button>
                        </Link>
                        <Link href={`/teacher/course/edit/${course._id}`} className="flex-1">
                          <Button variant="outline" size="sm" className="w-full">
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </Button>
                        </Link>
                        <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-100 border-red-200">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>

        {/* Recent Activity */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Recent Activity</h2>
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                {[
                  {
                    type: "student_enrolled",
                    message: "5 new students enrolled in 'Spanish for Beginners'",
                    time: "2 hours ago",
                    icon: Users
                  },
                  {
                    type: "course_created",
                    message: "You created a new course 'French Intermediate'",
                    time: "1 day ago",
                    icon: BookOpen
                  },
                  {
                    type: "rating_received",
                    message: "Received a 5-star rating for 'English Grammar'",
                    time: "2 days ago",
                    icon: Star
                  }
                ].map((activity, index) => (
                  <div key={index} className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                      <activity.icon className="h-5 w-5 text-indigo-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">{activity.message}</p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </ProtectedRoute>
  )
}
