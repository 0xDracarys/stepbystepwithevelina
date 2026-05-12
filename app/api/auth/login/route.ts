export const dynamic = 'force-dynamic'

import { type NextRequest } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { comparePassword, generateToken } from "@/lib/auth"
import { UserModel } from "@/lib/models/User"
import { loginSchema } from "@/lib/validation/schemas"
import { withErrorHandling, successResponse, errorResponse, validateRequest } from "@/lib/api/apiUtils"
import { ApiErrors } from "@/lib/middleware/security"

async function loginHandler(request: NextRequest) {
  const body = await request.json()
  
  try {
    const loginData = loginSchema.parse(body)
    
    await connectDB()

    // Find user by email
    const user = await UserModel.findOne({ 
      email: loginData.email.toLowerCase(),
      isActive: true 
    })

    if (!user) {
      throw ApiErrors.UNAUTHORIZED("Invalid credentials")
    }

    // Verify password
    const isValidPassword = await comparePassword(loginData.password, user.password)
    if (!isValidPassword) {
      throw ApiErrors.UNAUTHORIZED("Invalid credentials")
    }

    // Update last login
    user.lastLoginAt = new Date()
    await user.save()

    // Generate JWT token
    const token = generateToken(user)

    return successResponse({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        avatar: user.avatar,
      },
    })
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      throw ApiErrors.VALIDATION_ERROR("Invalid input data", error)
    }
    throw error
  }
}

export const POST = withErrorHandling(loginHandler)
