"use client"

import { useEffect, useState } from "react"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { useAuth } from "@/hooks/use-auth"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Trash2, BookOpen, Eye, EyeOff, Search, ExternalLink } from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"

interface Course {
  _id: string
  title: string
  teacherName: string
  category: string
  difficulty: string
  isPublished: boolean
  enrolledStudents: number
  thumbnail: string
}

export default function ManageCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const { token } = useAuth()

  const fetchCourses = async () => {
    try {
      const response = await fetch("/api/admin/courses", {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (response.ok) {
        const data = await response.json()
        setCourses(data.data.courses || [])
      }
    } catch (error) {
      console.error("Error fetching courses:", error)
      toast.error("Failed to load courses")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (token) fetchCourses()
  }, [token])

  const handleTogglePublish = async (courseId: string, currentStatus: boolean) => {
    try {
      const response = await fetch("/api/admin/courses", {
        method: "PATCH",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ courseId, isPublished: !currentStatus })
      })
      if (response.ok) {
        toast.success(`Course ${!currentStatus ? "published" : "unpublished"} successfully`)
        fetchCourses()
      }
    } catch (error) {
      toast.error("Failed to update course status")
    }
  }

  const handleDeleteCourse = async (courseId: string) => {
    if (!confirm("Are you sure you want to delete this course? This action cannot be undone.")) return

    try {
      const response = await fetch(`/api/admin/courses?courseId=${courseId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      })
      if (response.ok) {
        toast.success("Course deleted successfully")
        fetchCourses()
      }
    } catch (error) {
      toast.error("Failed to delete course")
    }
  }

  const filteredCourses = courses.filter(course => 
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.teacherName.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Manage Courses</h1>
            <p className="text-gray-600">Review, moderate, and manage all platform content</p>
          </div>
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search courses..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="overflow-x-auto scrollbar-hide">
              <table className="w-full text-left min-w-[700px]">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-sm font-semibold text-gray-600">Course</th>
                    <th className="px-6 py-4 text-sm font-semibold text-gray-600">Teacher</th>
                    <th className="px-6 py-4 text-sm font-semibold text-gray-600">Students</th>
                    <th className="px-6 py-4 text-sm font-semibold text-gray-600">Status</th>
                    <th className="px-6 py-4 text-sm font-semibold text-gray-600 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {isLoading ? (
                    [...Array(5)].map((_, i) => (
                      <tr key={i}>
                        <td className="px-6 py-4"><Skeleton className="h-10 w-48" /></td>
                        <td className="px-6 py-4"><Skeleton className="h-6 w-32" /></td>
                        <td className="px-6 py-4"><Skeleton className="h-6 w-16" /></td>
                        <td className="px-6 py-4"><Skeleton className="h-6 w-20" /></td>
                        <td className="px-6 py-4"><Skeleton className="h-8 w-24 ml-auto" /></td>
                      </tr>
                    ))
                  ) : filteredCourses.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-gray-500">No courses found</td>
                    </tr>
                  ) : (
                    filteredCourses.map((course) => (
                      <tr key={course._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <img 
                              src={course.thumbnail || "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=100&h=60&fit=crop"} 
                              alt="" 
                              className="w-12 h-8 rounded object-cover shadow-sm"
                            />
                            <div>
                              <p className="font-semibold text-gray-900">{course.title}</p>
                              <p className="text-xs text-gray-500 uppercase tracking-wider">{course.category} • {course.difficulty}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-600 font-medium">
                          {course.teacherName}
                        </td>
                        <td className="px-6 py-4 text-gray-600">
                          {course.enrolledStudents}
                        </td>
                        <td className="px-6 py-4">
                          <Badge className={course.isPublished ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"} variant="secondary">
                            {course.isPublished ? "Published" : "Draft"}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Link href={`/course/${course._id}`} target="_blank">
                              <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                                <ExternalLink className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className={course.isPublished ? "text-amber-600 hover:text-amber-700" : "text-green-600 hover:text-green-700"}
                              onClick={() => handleTogglePublish(course._id, course.isPublished)}
                            >
                              {course.isPublished ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-red-600 hover:text-red-700"
                              onClick={() => handleDeleteCourse(course._id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </ProtectedRoute>
  )
}
