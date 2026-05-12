import type { NextRequest } from "next/server"
import { verifyToken as authVerifyToken, type JWTPayload } from "../auth"

export const verifyToken = authVerifyToken

export function getTokenFromRequest(request: NextRequest): string | null {
  const authHeader = request.headers.get("authorization")
  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authHeader.substring(7)
  }
  return null
}

export function authenticateToken(request: NextRequest): JWTPayload | null {
  const token = getTokenFromRequest(request)
  if (!token) return null

  return verifyToken(token)
}

export function requireAuth(request: NextRequest): JWTPayload {
  const user = authenticateToken(request)
  if (!user) {
    throw new Error("Authentication required")
  }
  return user
}

export function requireRole(request: NextRequest, allowedRoles: string[]): JWTPayload {
  const user = requireAuth(request)
  if (!allowedRoles.includes(user.role)) {
    throw new Error("Insufficient permissions")
  }
  return user
}
