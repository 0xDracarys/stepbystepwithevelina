"use client"

import { useEffect, useState } from "react"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { useAuth } from "@/hooks/use-auth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Trash2, Shield, UserX, UserCheck, Search, Mail } from "lucide-react"
import { toast } from "sonner"

interface User {
  _id: string
  username: string
  email: string
  role: string
  isActive: boolean
  createdAt: string
}

export default function ManageUsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const { token } = useAuth()

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/admin/users", {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (response.ok) {
        const data = await response.json()
        setUsers(data.data.users || [])
      }
    } catch (error) {
      console.error("Error fetching users:", error)
      toast.error("Failed to load users")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (token) fetchUsers()
  }, [token])

  const handleToggleStatus = async (userId: string, currentStatus: boolean) => {
    try {
      const response = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ userId, isActive: !currentStatus })
      })
      if (response.ok) {
        toast.success(`User ${!currentStatus ? "activated" : "deactivated"} successfully`)
        fetchUsers()
      }
    } catch (error) {
      toast.error("Failed to update user status")
    }
  }

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user? This action cannot be undone.")) return

    try {
      const response = await fetch(`/api/admin/users?userId=${userId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      })
      if (response.ok) {
        toast.success("User deleted successfully")
        fetchUsers()
      }
    } catch (error) {
      toast.error("Failed to delete user")
    }
  }

  const filteredUsers = users.filter(user => 
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Manage Users</h1>
            <p className="text-gray-600">Review and control all user accounts on the platform</p>
          </div>
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search users..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-sm font-semibold text-gray-600">User</th>
                    <th className="px-6 py-4 text-sm font-semibold text-gray-600">Role</th>
                    <th className="px-6 py-4 text-sm font-semibold text-gray-600">Status</th>
                    <th className="px-6 py-4 text-sm font-semibold text-gray-600 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {isLoading ? (
                    [...Array(5)].map((_, i) => (
                      <tr key={i}>
                        <td className="px-6 py-4"><Skeleton className="h-10 w-40" /></td>
                        <td className="px-6 py-4"><Skeleton className="h-6 w-20" /></td>
                        <td className="px-6 py-4"><Skeleton className="h-6 w-16" /></td>
                        <td className="px-6 py-4"><Skeleton className="h-8 w-24 ml-auto" /></td>
                      </tr>
                    ))
                  ) : filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center text-gray-500">No users found</td>
                    </tr>
                  ) : (
                    filteredUsers.map((user) => (
                      <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-700 font-bold">
                              {user.username.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">{user.username}</p>
                              <p className="text-sm text-gray-500 flex items-center gap-1">
                                <Mail className="h-3 w-3" /> {user.email}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <Badge variant={user.role === "admin" ? "default" : user.role === "teacher" ? "secondary" : "outline"}>
                            {user.role}
                          </Badge>
                        </td>
                        <td className="px-6 py-4">
                          <Badge className={user.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"} variant="secondary">
                            {user.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className={user.isActive ? "text-amber-600 hover:text-amber-700" : "text-green-600 hover:text-green-700"}
                              onClick={() => handleToggleStatus(user._id, user.isActive)}
                              disabled={user.role === "admin"}
                            >
                              {user.isActive ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-red-600 hover:text-red-700"
                              onClick={() => handleDeleteUser(user._id)}
                              disabled={user.role === "admin"}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </ProtectedRoute>
  )
}
