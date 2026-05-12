export const dynamic = 'force-dynamic'

import { type NextRequest } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { UserModel } from "@/lib/models/User"
import { withErrorHandling, successResponse } from "@/lib/api/apiUtils"
import { ApiErrors, requireAuth } from "@/lib/middleware/security"

async function getSettingsHandler(request: NextRequest) {
  const user = await requireAuth(request)
  await connectDB()

  const userProfile = await UserModel.findById(user.userId).select('settings')
  
  if (!userProfile) {
    throw ApiErrors.NOT_FOUND("User not found")
  }

  // Default settings if none exist
  const defaultSettings = {
    notifications: {
      email: true,
      push: true,
      courseUpdates: true,
      achievements: true
    },
    privacy: {
      profileVisibility: "public",
      showProgress: true,
      showAchievements: true
    },
    preferences: {
      language: "en",
      theme: "light",
      timezone: "UTC"
    }
  }

  return successResponse(userProfile.settings || defaultSettings)
}

async function updateSettingsHandler(request: NextRequest) {
  const user = await requireAuth(request)
  await connectDB()

  const body = await request.json()
  const { notifications, privacy, preferences } = body

  // Validate settings structure
  const validSettings = {
    notifications: {
      email: Boolean(notifications?.email),
      push: Boolean(notifications?.push),
      courseUpdates: Boolean(notifications?.courseUpdates),
      achievements: Boolean(notifications?.achievements)
    },
    privacy: {
      profileVisibility: privacy?.profileVisibility || "public",
      showProgress: Boolean(privacy?.showProgress),
      showAchievements: Boolean(privacy?.showAchievements)
    },
    preferences: {
      language: preferences?.language || "en",
      theme: preferences?.theme || "light",
      timezone: preferences?.timezone || "UTC"
    }
  }

  // Validate profile visibility
  if (!["public", "friends", "private"].includes(validSettings.privacy.profileVisibility)) {
    throw ApiErrors.VALIDATION_ERROR("Invalid profile visibility setting")
  }

  // Validate language
  const validLanguages = ["en", "es", "fr", "de", "it", "pt", "ru", "zh", "ja", "ko"]
  if (!validLanguages.includes(validSettings.preferences.language)) {
    throw ApiErrors.VALIDATION_ERROR("Invalid language setting")
  }

  // Validate theme
  if (!["light", "dark", "auto"].includes(validSettings.preferences.theme)) {
    throw ApiErrors.VALIDATION_ERROR("Invalid theme setting")
  }

  const updatedUser = await UserModel.findByIdAndUpdate(
    user.userId,
    {
      settings: validSettings,
      updatedAt: new Date()
    },
    { new: true, select: 'settings' }
  )

  if (!updatedUser) {
    throw ApiErrors.NOT_FOUND("User not found")
  }

  return successResponse(updatedUser.settings)
}

export const GET = withErrorHandling(getSettingsHandler)
export const PUT = withErrorHandling(updateSettingsHandler)
