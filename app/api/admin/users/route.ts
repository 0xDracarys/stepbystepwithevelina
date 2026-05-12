export const dynamic = 'force-dynamic'

import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { UserModel } from "@/lib/models/User"
import { withErrorHandling, successResponse } from "@/lib/api/apiUtils"
import { ApiErrors } from "@/lib/middleware/security"
import { verifyToken } from "@/lib/auth"

// Helper to check admin role
async function checkAdmin(request: NextRequest) {
  const authHeader = request.headers.get("authorization")
  if (!authHeader?.startsWith("Bearer ")) {
    throw ApiErrors.UNAUTHORIZED("Authentication required")
  }
  const token = authHeader.split(" ")[1]
  const decoded = verifyToken(token)
  if (!decoded || decoded.role !== "admin") {
    throw ApiErrors.FORBIDDEN("Only admins can access this resource")
  }
  return decoded
}

// GET all users
async function getUsersHandler(request: NextRequest) {
  await checkAdmin(request)
  await connectDB()

  const { searchParams } = new URL(request.url)
  const limit = parseInt(searchParams.get("limit") || "50")

  const users = await UserModel.find({})
    .sort({ createdAt: -1 })
    .limit(limit)
    .select("-password")
    .lean()

  return successResponse({ users })
}

// PATCH update user (e.g., toggle active status or change role)
async function updateUserHandler(request: NextRequest) {
  await checkAdmin(request)
  await connectDB()

  const body = await request.json()
  const { userId, ...updates } = body

  if (!userId) {
    throw ApiErrors.BAD_REQUEST("User ID is required")
  }

  // Prevent admin from deactivating themselves
  const admin = await checkAdmin(request)
  if (userId === admin.userId && updates.isActive === false) {
    throw ApiErrors.BAD_REQUEST("You cannot deactivate your own admin account")
  }

  const user = await UserModel.findByIdAndUpdate(
    userId,
    { $set: updates },
    { new: true }
  ).select("-password")

  if (!user) {
    throw ApiErrors.NOT_FOUND("User not found")
  }

  return successResponse({ 
    message: "User updated successfully",
    user 
  })
}

// DELETE user
async function deleteUserHandler(request: NextRequest) {
  const admin = await checkAdmin(request)
  await connectDB()

  const { searchParams } = new URL(request.url)
  const userId = searchParams.get("userId")

  if (!userId) {
    throw ApiErrors.BAD_REQUEST("User ID is required")
  }

  if (userId === admin.userId) {
    throw ApiErrors.BAD_REQUEST("You cannot delete your own admin account")
  }

  const user = await UserModel.findByIdAndDelete(userId)
  if (!user) {
    throw ApiErrors.NOT_FOUND("User not found")
  }

  return successResponse({ message: "User deleted successfully" })
}

export const GET = withErrorHandling(getUsersHandler)
export const PATCH = withErrorHandling(updateUserHandler)
export const DELETE = withErrorHandling(deleteUserHandler)
