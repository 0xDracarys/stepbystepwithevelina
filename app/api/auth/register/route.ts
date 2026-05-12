export const dynamic = 'force-dynamic'

import { type NextRequest } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { hashPassword } from "@/lib/auth"
import { UserModel } from "@/lib/models/User"
import { createUserSchema } from "@/lib/validation/schemas"
import { withErrorHandling, successResponse } from "@/lib/api/apiUtils"
import { ApiErrors } from "@/lib/middleware/security"

async function registerHandler(request: NextRequest) {
  const body = await request.json()

  try {
    const userData = createUserSchema.parse(body)

    await connectDB()

    // Check if user already exists
    const existingUser = await UserModel.findOne({
      $or: [{ email: userData.email.toLowerCase() }, { username: userData.username }],
    })

    if (existingUser) {
      throw ApiErrors.CONFLICT("User with this email or username already exists")
    }

    // Hash password and create user
    const hashedPassword = await hashPassword(userData.password)

    const newUser = new UserModel({
      username: userData.username,
      email: userData.email.toLowerCase(),
      password: hashedPassword,
      role: userData.role,
      firstName: (userData as any).firstName,
      lastName: (userData as any).lastName,
      coursesEnrolled: [],
      coursesCreated: [],
      progress: {},
      isActive: true,
    })

    await newUser.save()

    return successResponse(
      {
        message: "User created successfully",
        userId: newUser._id,
        user: {
          id: newUser._id,
          username: newUser.username,
          email: newUser.email,
          role: newUser.role,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
        },
      },
      201
    )
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      throw ApiErrors.VALIDATION_ERROR("Invalid input data", error)
    }
    throw error
  }
}

export const POST = withErrorHandling(registerHandler)
