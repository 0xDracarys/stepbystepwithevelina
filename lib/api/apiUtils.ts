import { NextRequest, NextResponse } from "next/server"
import { handleApiError, applySecurityHeaders, corsHeaders } from "../middleware/security"

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: {
    message: string
    code: string
    details?: any
  }
  meta?: {
    page?: number
    limit?: number
    total?: number
    totalPages?: number
  }
}

// Success response helper
export function successResponse<T>(
  data: T,
  status: number = 200,
  meta?: ApiResponse<T>["meta"]
): NextResponse {
  const response = NextResponse.json(
    {
      success: true,
      data,
      ...(meta && { meta }),
    } as ApiResponse<T>,
    { status }
  )

  return applySecurityHeaders(response)
}

// Error response helper
export function errorResponse(
  error: unknown,
  status?: number
): NextResponse {
  return handleApiError(error)
}

// Pagination helper
export function calculatePagination(page: number, limit: number, total: number) {
  const totalPages = Math.ceil(total / limit)
  const hasNextPage = page < totalPages
  const hasPrevPage = page > 1

  return {
    page,
    limit,
    total,
    totalPages,
    hasNextPage,
    hasPrevPage,
  }
}

// API route wrapper with error handling
export function withErrorHandling(
  handler: (request: NextRequest, context?: any) => Promise<NextResponse>
) {
  return async (request: NextRequest, context?: any): Promise<NextResponse> => {
    try {
      // Handle CORS
      if (request.method === "OPTIONS") {
        return new NextResponse(null, { 
          status: 200, 
          headers: corsHeaders 
        })
      }

      const response = await handler(request, context)
      return applySecurityHeaders(response)
    } catch (error) {
      console.error("API Error:", error)
      return handleApiError(error)
    }
  }
}

// Query parameter helpers
export function getQueryParams(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  return {
    page: parseInt(searchParams.get("page") || "1"),
    limit: parseInt(searchParams.get("limit") || "10"),
    search: searchParams.get("search") || undefined,
    sort: searchParams.get("sort") || undefined,
    order: searchParams.get("order") || "desc",
  }
}

// Validation helper
export function validateRequest<T>(
  request: NextRequest,
  schema: any
): { data: T; error?: string } {
  try {
    const body = request.json()
    const data = schema.parse(body)
    return { data }
  } catch (error) {
    return { 
      data: null as T, 
      error: error instanceof Error ? error.message : "Validation failed" 
    }
  }
}

// File upload helper
export function validateFileUpload(
  file: File,
  options: {
    maxSize?: number // in bytes
    allowedTypes?: string[]
  } = {}
): { valid: boolean; error?: string } {
  const { maxSize = 5 * 1024 * 1024, allowedTypes = ["image/jpeg", "image/png", "image/gif"] } = options

  if (file.size > maxSize) {
    return { valid: false, error: "File size too large" }
  }

  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: "File type not allowed" }
  }

  return { valid: true }
}

// Rate limiting helper
export function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for")
  const realIP = request.headers.get("x-real-ip")
  
  if (forwarded) {
    return forwarded.split(",")[0].trim()
  }
  
  if (realIP) {
    return realIP
  }
  
  return "unknown"
}

// Cache control helpers
export function setCacheHeaders(response: NextResponse, maxAge: number = 300) {
  response.headers.set("Cache-Control", `public, max-age=${maxAge}`)
  return response
}

export function setNoCacheHeaders(response: NextResponse) {
  response.headers.set("Cache-Control", "no-cache, no-store, must-revalidate")
  response.headers.set("Pragma", "no-cache")
  response.headers.set("Expires", "0")
  return response
}

// Content type helpers
export function setJsonHeaders(response: NextResponse) {
  response.headers.set("Content-Type", "application/json")
  return response
}

export function setCsvHeaders(response: NextResponse, filename: string) {
  response.headers.set("Content-Type", "text/csv")
  response.headers.set("Content-Disposition", `attachment; filename="${filename}"`)
  return response
}

// Search and filter helpers
export function buildSearchQuery(searchTerm?: string, searchFields: string[] = []) {
  if (!searchTerm) return {}
  
  return {
    $or: searchFields.map(field => ({
      [field]: { $regex: searchTerm, $options: "i" }
    }))
  }
}

export function buildSortQuery(sort?: string, order: string = "desc") {
  if (!sort) return { createdAt: -1 }
  
  const sortOrder = order === "asc" ? 1 : -1
  return { [sort]: sortOrder }
}

// Database query helpers
export function buildPaginationQuery(page: number, limit: number) {
  const skip = (page - 1) * limit
  return { skip, limit }
}

// Response transformation helpers
export function transformUser(user: any) {
  const { password, ...userWithoutPassword } = user.toObject ? user.toObject() : user
  return userWithoutPassword
}

export function transformCourse(course: any) {
  const courseObj = course.toObject ? course.toObject() : course
  return {
    ...courseObj,
    enrollmentCount: courseObj.enrolledStudents?.length || 0,
    lessonCount: courseObj.lessons?.length || 0,
  }
}

// Logging helpers
export function logApiCall(
  method: string,
  path: string,
  userId?: string,
  statusCode?: number
) {
  const timestamp = new Date().toISOString()
  const logMessage = `[${timestamp}] ${method} ${path}${userId ? ` - User: ${userId}` : ""}${statusCode ? ` - Status: ${statusCode}` : ""}`
  console.log(logMessage)
}

// Health check helper
export function healthCheck() {
  return successResponse({
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  })
}
