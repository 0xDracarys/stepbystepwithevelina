export const dynamic = 'force-dynamic'

import { type NextRequest } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { UserModel } from "@/lib/models/User"
import { withErrorHandling, successResponse } from "@/lib/api/apiUtils"
import { ApiErrors, requireAuth } from "@/lib/middleware/security"

async function getProfileHandler(request: NextRequest) {
  const user = await requireAuth(request)
  await connectDB()

  const userProfile = await UserModel.findById(user.userId).select('-password')
  
  if (!userProfile) {
    throw ApiErrors.NOT_FOUND("User not found")
  }

  // Calculate additional stats
  const coursesEnrolled = userProfile.coursesEnrolled?.length || 0
  const coursesCompleted = userProfile.progress ? 
    Object.values(userProfile.progress).filter((progress: any) => progress.completed).length : 0
  
  const totalTimeSpent = userProfile.progress ? 
    Object.values(userProfile.progress).reduce((total: number, progress: any) => 
      total + (progress.timeSpent || 0), 0) : 0

  // Generate achievements based on progress
  const achievements = []
  if (coursesCompleted >= 1) achievements.push("First Course Complete")
  if (coursesCompleted >= 5) achievements.push("Learning Enthusiast")
  if (coursesCompleted >= 10) achievements.push("Language Master")
  if (totalTimeSpent >= 100) achievements.push("Dedicated Learner")
  if (totalTimeSpent >= 500) achievements.push("Time Investment Champion")

  return successResponse({
    _id: userProfile._id,
    username: userProfile.username,
    email: userProfile.email,
    firstName: userProfile.firstName,
    lastName: userProfile.lastName,
    bio: userProfile.bio,
    avatar: userProfile.avatar,
    role: userProfile.role,
    createdAt: userProfile.createdAt,
    lastLoginAt: userProfile.lastLoginAt,
    coursesEnrolled,
    coursesCompleted,
    totalTimeSpent: Math.round(totalTimeSpent),
    achievements
  })
}

async function updateProfileHandler(request: NextRequest) {
  const user = await requireAuth(request)
  await connectDB()

  const body = await request.json()
  const { firstName, lastName, bio } = body

  // Validate input
  if (firstName && firstName.length > 50) {
    throw ApiErrors.VALIDATION_ERROR("First name must be less than 50 characters")
  }
  if (lastName && lastName.length > 50) {
    throw ApiErrors.VALIDATION_ERROR("Last name must be less than 50 characters")
  }
  if (bio && bio.length > 500) {
    throw ApiErrors.VALIDATION_ERROR("Bio must be less than 500 characters")
  }

  const updatedUser = await UserModel.findByIdAndUpdate(
    user.userId,
    {
      firstName: firstName || "",
      lastName: lastName || "",
      bio: bio || "",
      updatedAt: new Date()
    },
    { new: true, select: '-password' }
  )

  if (!updatedUser) {
    throw ApiErrors.NOT_FOUND("User not found")
  }

  return successResponse({
    _id: updatedUser._id,
    username: updatedUser.username,
    email: updatedUser.email,
    firstName: updatedUser.firstName,
    lastName: updatedUser.lastName,
    bio: updatedUser.bio,
    avatar: updatedUser.avatar,
    role: updatedUser.role,
    createdAt: updatedUser.createdAt,
    lastLoginAt: updatedUser.lastLoginAt
  })
}

export const GET = withErrorHandling(getProfileHandler)
export const PUT = withErrorHandling(updateProfileHandler)
