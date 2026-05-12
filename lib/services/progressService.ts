import { ObjectId } from "mongodb"
import { Progress, IProgress } from "../models/Progress"
import { UserModel } from "../models/User"
import { CourseModel } from "../models/Course"

export interface ProgressStats {
  courseId: string
  totalLessons: number
  completedLessons: number
  progressPercentage: number
  quizScores: Record<string, number>
  averageQuizScore: number
  timeSpent: number
  lastAccessedAt: Date
}

export interface CourseProgress {
  courseId: string
  courseTitle: string
  teacherName: string
  totalLessons: number
  completedLessons: number
  progressPercentage: number
  currentLesson: string | null
  lastAccessedAt: Date
  quizScores: Record<string, number>
  averageQuizScore: number
}

export class ProgressService {
  // Calculate progress for a specific course
  static async calculateCourseProgress(
    userId: string,
    courseId: string
  ): Promise<ProgressStats> {
    try {
      // Get course details
      const course = await CourseModel.findById(courseId)
      if (!course) {
        throw new Error("Course not found")
      }

      // Get all progress records for this course
      const progressRecords = await Progress.find({
        userId: new ObjectId(userId),
        courseId: new ObjectId(courseId),
      })

      const totalLessons = course.lessons.length
      const completedLessons = progressRecords.filter(p => p.completed).length
      const progressPercentage = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0

      // Calculate quiz scores
      const quizScores: Record<string, number> = {}
      let totalQuizScore = 0
      let quizCount = 0

      progressRecords.forEach(record => {
        if (record.quizScore !== undefined) {
          quizScores[record.lessonId.toString()] = record.quizScore
          totalQuizScore += record.quizScore
          quizCount++
        }
      })

      const averageQuizScore = quizCount > 0 ? totalQuizScore / quizCount : 0

      // Calculate total time spent
      const timeSpent = progressRecords.reduce((total, record) => total + (record.timeSpent || 0), 0)

      // Get last accessed date
      const lastAccessedAt = progressRecords.length > 0
        ? new Date(Math.max(...progressRecords.map(p => p.updatedAt.getTime())))
        : new Date()

      return {
        courseId,
        totalLessons,
        completedLessons,
        progressPercentage: Math.round(progressPercentage * 100) / 100,
        quizScores,
        averageQuizScore: Math.round(averageQuizScore * 100) / 100,
        timeSpent,
        lastAccessedAt,
      }
    } catch (error) {
      console.error("Error calculating course progress:", error)
      throw error
    }
  }

  // Get all course progress for a user
  static async getUserCourseProgress(userId: string): Promise<CourseProgress[]> {
    try {
      const user = await UserModel.findById(userId).populate("coursesEnrolled")
      if (!user) {
        throw new Error("User not found")
      }

      const courseProgress: CourseProgress[] = []

      for (const courseId of user.coursesEnrolled) {
        const course = await CourseModel.findById(courseId)
        if (!course) continue

        const progressStats = await this.calculateCourseProgress(userId, courseId.toString())

        // Find current lesson (first incomplete lesson)
        const progressRecords = await Progress.find({
          userId: new ObjectId(userId),
          courseId: new ObjectId(courseId),
        })

        const completedLessonIds = new Set(
          progressRecords.filter(p => p.completed).map(p => p.lessonId.toString())
        )

        const currentLesson = course.lessons
          .sort((a: any, b: any) => a.order - b.order)
          .find((lesson: any) => !completedLessonIds.has(lesson._id.toString()))

        courseProgress.push({
          courseId: courseId.toString(),
          courseTitle: course.title,
          teacherName: course.teacherName || "Unknown Teacher",
          totalLessons: progressStats.totalLessons,
          completedLessons: progressStats.completedLessons,
          progressPercentage: progressStats.progressPercentage,
          currentLesson: currentLesson ? currentLesson.title : null,
          lastAccessedAt: progressStats.lastAccessedAt,
          quizScores: progressStats.quizScores,
          averageQuizScore: progressStats.averageQuizScore,
        })
      }

      return courseProgress.sort((a, b) => b.lastAccessedAt.getTime() - a.lastAccessedAt.getTime())
    } catch (error) {
      console.error("Error getting user course progress:", error)
      throw error
    }
  }

  // Update lesson progress
  static async updateLessonProgress(
    userId: string,
    courseId: string,
    lessonId: string,
    data: {
      completed?: boolean
      quizScore?: number
      timeSpent?: number
    }
  ): Promise<IProgress> {
    try {
      const progressData = {
        userId: new ObjectId(userId),
        courseId: new ObjectId(courseId),
        lessonId: new ObjectId(lessonId),
        completed: data.completed || false,
        completedAt: data.completed ? new Date() : undefined,
        quizScore: data.quizScore,
        timeSpent: data.timeSpent || 0,
      }

      const progress = await Progress.findOneAndUpdate(
        {
          userId: new ObjectId(userId),
          courseId: new ObjectId(courseId),
          lessonId: new ObjectId(lessonId),
        },
        progressData,
        { upsert: true, new: true }
      )

      // Update user's progress in the user document
      await this.updateUserProgress(userId, courseId)

      return progress
    } catch (error) {
      console.error("Error updating lesson progress:", error)
      throw error
    }
  }

  // Update user's progress summary
  static async updateUserProgress(userId: string, courseId: string): Promise<void> {
    try {
      const progressStats = await this.calculateCourseProgress(userId, courseId)

      await UserModel.findByIdAndUpdate(userId, {
        $set: {
          [`progress.${courseId}`]: {
            courseId: new ObjectId(courseId),
            completedLessons: progressStats.completedLessons,
            quizScores: progressStats.quizScores,
            overallProgress: progressStats.progressPercentage,
            lastAccessedAt: progressStats.lastAccessedAt,
          },
        },
      })
    } catch (error) {
      console.error("Error updating user progress:", error)
      throw error
    }
  }

  // Get student progress for teacher
  static async getStudentProgressForTeacher(
    teacherId: string,
    courseId: string
  ): Promise<Array<{
    student: {
      _id: string
      username: string
      email: string
      firstName?: string
      lastName?: string
    }
    progress: ProgressStats
  }>> {
    try {
      // Verify teacher owns the course
      const course = await CourseModel.findOne({
        _id: new ObjectId(courseId),
        teacherId: new ObjectId(teacherId),
      })

      if (!course) {
        throw new Error("Course not found or access denied")
      }

      const students = await UserModel.find({
        _id: { $in: course.enrolledStudents },
        role: "student",
      }).select("username email firstName lastName")

      const studentProgress = []

      for (const student of students) {
        const progress = await this.calculateCourseProgress(student._id.toString(), courseId)
        studentProgress.push({
          student: {
            _id: student._id.toString(),
            username: student.username,
            email: student.email,
            firstName: student.firstName,
            lastName: student.lastName,
          },
          progress,
        })
      }

      return studentProgress.sort((a, b) =>
        b.progress.progressPercentage - a.progress.progressPercentage
      )
    } catch (error) {
      console.error("Error getting student progress for teacher:", error)
      throw error
    }
  }

  // Get system-wide analytics for admin
  static async getSystemAnalytics(): Promise<{
    totalUsers: number
    totalCourses: number
    totalEnrollments: number
    averageCourseProgress: number
    topPerformingCourses: Array<{
      courseId: string
      title: string
      teacherName: string
      enrollmentCount: number
      averageProgress: number
    }>
  }> {
    try {
      const totalUsers = await UserModel.countDocuments({ isActive: true })
      const totalCourses = await CourseModel.countDocuments({ isPublished: true })

      // Calculate total enrollments
      const courses = await CourseModel.find({ isPublished: true })
      const totalEnrollments = courses.reduce((sum, course) => sum + course.enrolledStudents.length, 0)

      // Calculate average course progress
      const allUsers = await UserModel.find({ role: "student", isActive: true })
      let totalProgress = 0
      let progressCount = 0

      for (const user of allUsers) {
        for (const courseId of user.coursesEnrolled) {
          const progress = await this.calculateCourseProgress(user._id.toString(), courseId.toString())
          totalProgress += progress.progressPercentage
          progressCount++
        }
      }

      const averageCourseProgress = progressCount > 0 ? totalProgress / progressCount : 0

      // Get top performing courses
      const topCourses = []
      for (const course of courses) {
        const enrolledStudents = await UserModel.find({
          _id: { $in: course.enrolledStudents },
          role: "student",
        })

        let totalCourseProgress = 0
        for (const student of enrolledStudents) {
          const progress = await this.calculateCourseProgress(student._id.toString(), course._id.toString())
          totalCourseProgress += progress.progressPercentage
        }

        const averageProgress = enrolledStudents.length > 0
          ? totalCourseProgress / enrolledStudents.length
          : 0

        topCourses.push({
          courseId: course._id.toString(),
          title: course.title,
          teacherName: course.teacherName || "Unknown",
          enrollmentCount: course.enrolledStudents.length,
          averageProgress: Math.round(averageProgress * 100) / 100,
        })
      }

      topCourses.sort((a, b) => b.averageProgress - a.averageProgress)

      return {
        totalUsers,
        totalCourses,
        totalEnrollments,
        averageCourseProgress: Math.round(averageCourseProgress * 100) / 100,
        topPerformingCourses: topCourses.slice(0, 10),
      }
    } catch (error) {
      console.error("Error getting system analytics:", error)
      throw error
    }
  }
}
