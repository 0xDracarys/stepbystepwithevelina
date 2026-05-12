export const dynamic = 'force-dynamic'

import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import { requireRole } from "@/lib/middleware/auth"
import type { User } from "@/lib/models/User"

export async function GET(request: NextRequest) {
  try {
    requireRole(request, ["admin"])
    const db = await getDatabase()
    const users = db.collection<User>("users")

    const allUsers = await users
      .aggregate([
        {
          $project: {
            username: 1,
            email: 1,
            role: 1,
            createdAt: 1,
            coursesEnrolled: { $size: "$coursesEnrolled" },
          },
        },
        { $sort: { createdAt: -1 } },
      ])
      .toArray()

    return NextResponse.json({ users: allUsers })
  } catch (error) {
    console.error("Error fetching users:", error)
    if (error instanceof Error && error.message.includes("Authentication")) {
      return NextResponse.json({ error: error.message }, { status: 401 })
    }
    if (error instanceof Error && error.message.includes("permissions")) {
      return NextResponse.json({ error: error.message }, { status: 403 })
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
