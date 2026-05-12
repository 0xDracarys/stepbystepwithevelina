export const dynamic = 'force-dynamic'

import { type NextRequest } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { hashPassword } from "@/lib/auth"
import { UserModel } from "@/lib/models/User"
import { withErrorHandling, successResponse } from "@/lib/api/apiUtils"
import { ApiErrors } from "@/lib/middleware/security"

async function createTestAccountsHandler(request: NextRequest) {
  try {
    await connectDB()

    // Clear existing test accounts
    await UserModel.deleteMany({
      $or: [
        { email: { $regex: /test.*@/ } },
        { username: { $regex: /^test/ } }
      ]
    })

    const testAccounts = [
      {
        username: 'teststudent',
        email: 'teststudent@example.com',
        password: 'password123',
        role: 'student',
        firstName: 'Test',
        lastName: 'Student',
        bio: 'I love learning new languages!'
      },
      {
        username: 'testteacher',
        email: 'testteacher@example.com',
        password: 'password123',
        role: 'teacher',
        firstName: 'Test',
        lastName: 'Teacher',
        bio: 'Experienced language teacher with 5+ years of experience'
      },
      {
        username: 'testadmin',
        email: 'testadmin@example.com',
        password: 'password123',
        role: 'admin',
        firstName: 'Test',
        lastName: 'Admin',
        bio: 'Platform administrator'
      }
    ]

    const createdAccounts = []

    for (const account of testAccounts) {
      const hashedPassword = await hashPassword(account.password)

      const user = new UserModel({
        ...account,
        password: hashedPassword,
        isActive: true,
        lastLoginAt: new Date()
      })

      await user.save()
      createdAccounts.push({
        username: user.username,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName
      })
    }

    return successResponse({
      message: "Test accounts created successfully",
      accounts: createdAccounts,
      credentials: {
        student: { email: 'teststudent@example.com', password: 'password123' },
        teacher: { email: 'testteacher@example.com', password: 'password123' },
        admin: { email: 'testadmin@example.com', password: 'password123' }
      }
    })

  } catch (error) {
    console.error('Error creating test accounts:', error)
    throw ApiErrors.INTERNAL_ERROR("Failed to create test accounts")
  }
}

export const POST = withErrorHandling(createTestAccountsHandler)
