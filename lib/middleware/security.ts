import { NextRequest, NextResponse } from "next/server"
import { verifyToken, type JWTPayload } from "../auth"
import { z } from "zod"

// Rate limiting store (in production, use Redis)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

// Rate limiting configuration
const RATE_LIMIT_WINDOW = 15 * 60 * 1000 // 15 minutes
const RATE_LIMIT_MAX_REQUESTS = 100 // 100 requests per window

export interface ApiError {
  message: string
  code: string
  statusCode: number
  details?: any
}

export class AppError extends Error {
  public readonly statusCode: number
  public readonly code: string
  public readonly details?: any

  constructor(message: string, statusCode: number = 500, code: string = "INTERNAL_ERROR", details?: any) {
    super(message)
    this.statusCode = statusCode
    this.code = code
    this.details = details
    this.name = "AppError"
  }
}

// Predefined error types
export const ApiErrors = {
  BAD_REQUEST: (message: string = "Bad request") =>
    new AppError(message, 400, "BAD_REQUEST"),

  UNAUTHORIZED: (message: string = "Authentication required") =>
    new AppError(message, 401, "UNAUTHORIZED"),

  FORBIDDEN: (message: string = "Insufficient permissions") =>
    new AppError(message, 403, "FORBIDDEN"),

  NOT_FOUND: (message: string = "Resource not found") =>
    new AppError(message, 404, "NOT_FOUND"),

  VALIDATION_ERROR: (message: string = "Validation failed", details?: any) =>
    new AppError(message, 400, "VALIDATION_ERROR", details),

  CONFLICT: (message: string = "Resource conflict") =>
    new AppError(message, 409, "CONFLICT"),

  INTERNAL_ERROR: (message: string = "Internal server error") =>
    new AppError(message, 500, "INTERNAL_ERROR"),

  RATE_LIMITED: (message: string = "Too many requests") =>
    new AppError(message, 429, "RATE_LIMITED")
}

// Error handler middleware
export function handleApiError(error: unknown): NextResponse {
  console.error("API Error:", error)

  if (error instanceof AppError) {
    return NextResponse.json(
      {
        error: {
          message: error.message,
          code: error.code,
          details: error.details,
        },
      },
      { status: error.statusCode }
    )
  }

  if (error instanceof z.ZodError) {
    return NextResponse.json(
      {
        error: {
          message: "Validation failed",
          code: "VALIDATION_ERROR",
          details: error.errors,
        },
      },
      { status: 400 }
    )
  }

  // Generic error
  return NextResponse.json(
    {
      error: {
        message: "Internal server error",
        code: "INTERNAL_ERROR",
      },
    },
    { status: 500 }
  )
}

// Rate limiting middleware
export function rateLimit(identifier: string): boolean {
  const now = Date.now()
  const key = identifier
  const record = rateLimitStore.get(key)

  if (!record || now > record.resetTime) {
    rateLimitStore.set(key, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW,
    })
    return true
  }

  if (record.count >= RATE_LIMIT_MAX_REQUESTS) {
    return false
  }

  record.count++
  return true
}

// Enhanced authentication middleware
export function authenticateRequest(request: NextRequest): JWTPayload {
  const authHeader = request.headers.get("authorization")

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw ApiErrors.UNAUTHORIZED("Missing or invalid authorization header")
  }

  const token = authHeader.substring(7)
  const payload = verifyToken(token)

  if (!payload) {
    throw ApiErrors.UNAUTHORIZED("Invalid or expired token")
  }

  return payload
}

// Simple authentication middleware for API routes
export async function requireAuth(request: NextRequest): Promise<JWTPayload> {
  return authenticateRequest(request)
}

// Role-based authorization middleware
export function requireRole(allowedRoles: string[]) {
  return (request: NextRequest): JWTPayload => {
    const user = authenticateRequest(request)

    if (!allowedRoles.includes(user.role)) {
      throw ApiErrors.FORBIDDEN(`Access denied. Required roles: ${allowedRoles.join(", ")}`)
    }

    return user
  }
}

// Resource ownership middleware
export function requireOwnership(resourceUserId: string) {
  return (request: NextRequest): JWTPayload => {
    const user = authenticateRequest(request)

    if (user.role !== "admin" && user.userId !== resourceUserId) {
      throw ApiErrors.FORBIDDEN("Access denied. You can only access your own resources.")
    }

    return user
  }
}

// Input validation middleware
export function validateInput<T>(schema: z.ZodSchema<T>) {
  return (data: unknown): T => {
    try {
      return schema.parse(data)
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw ApiErrors.VALIDATION_ERROR("Invalid input data", error.errors)
      }
      throw error
    }
  }
}

// CORS configuration
export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
}

// CORS middleware
export function handleCors(request: NextRequest): NextResponse | null {
  if (request.method === "OPTIONS") {
    return new NextResponse(null, { status: 200, headers: corsHeaders })
  }
  return null
}

// Security headers
export const securityHeaders = {
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "X-XSS-Protection": "1; mode=block",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
}

// Apply security headers to response
export function applySecurityHeaders(response: NextResponse): NextResponse {
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value)
  })
  return response
}
