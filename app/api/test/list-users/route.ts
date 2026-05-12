export const dynamic = 'force-dynamic'

import { type NextRequest } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { UserModel } from "@/lib/models/User"
import { withErrorHandling, successResponse } from "@/lib/api/apiUtils"
import { ApiErrors } from "@/lib/middleware/security"

async function listUsersHandler(request: NextRequest) {
  try {
    await connectDB()

    const users = await UserModel.find({}, {
      username: 1,
      email: 1,
      role: 1,
      firstName: 1,
      lastName: 1,
      isActive: 1,
      createdAt: 1
    }).sort({ createdAt: -1 })

    return successResponse({
      message: "Users retrieved successfully",
      count: users.length,
      users: users
    })

  } catch (error) {
    console.error('Error listing users:', error)
    throw ApiErrors.INTERNAL_ERROR("Failed to list users")
  }
}

export const GET = withErrorHandling(listUsersHandler)
