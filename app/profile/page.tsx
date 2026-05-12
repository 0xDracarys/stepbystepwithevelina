"use client"



import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { useAuth } from "@/hooks/use-auth"
import { User, Mail, Calendar, BookOpen, Trophy, Settings, Save, Edit } from "lucide-react"

interface UserProfile {
  _id: string
  username: string
  email: string
  firstName: string
  lastName: string
  bio: string
  avatar: string
  role: string
  createdAt: string
  lastLoginAt: string
  coursesEnrolled: number
  coursesCompleted: number
  totalTimeSpent: number
  achievements: string[]
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [editData, setEditData] = useState({
    firstName: "",
    lastName: "",
    bio: ""
  })
  const { user, token } = useAuth()

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch("/api/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (response.ok) {
          const data = await response.json()
          setProfile(data.data)
          setEditData({
            firstName: data.data.firstName || "",
            lastName: data.data.lastName || "",
            bio: data.data.bio || ""
          })
        }
      } catch (error) {
        console.error("Error fetching profile:", error)
      } finally {
        setIsLoading(false)
      }
    }

    if (token) {
      fetchProfile()
    }
  }, [token])

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editData),
      })

      if (response.ok) {
        const data = await response.json()
        setProfile(data.data)
        setIsEditing(false)
      }
    } catch (error) {
      console.error("Error updating profile:", error)
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
          <div className="container-custom section-padding-sm">
            <div className="max-w-4xl mx-auto">
              <div className="animate-pulse">
                <div className="h-8 bg-gray-200 rounded w-64 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-96 mb-8"></div>
                <div className="grid md:grid-cols-3 gap-8">
                  <div className="md:col-span-1">
                    <div className="h-64 bg-gray-200 rounded-xl"></div>
                  </div>
                  <div className="md:col-span-2">
                    <div className="h-64 bg-gray-200 rounded-xl"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="container-custom section-padding-sm">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <h1 className="heading-1 mb-4">Profile Settings</h1>
              <p className="body-large">Manage your account information and preferences</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Profile Card */}
              <div className="md:col-span-1">
                <Card className="card-elevated">
                  <CardHeader className="text-center">
                    <div className="relative mx-auto mb-4">
                      <Avatar className="w-24 h-24 mx-auto">
                        <AvatarFallback className="text-2xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
                          {profile?.firstName?.charAt(0) || user?.username?.charAt(0) || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
                        <div className="w-3 h-3 bg-white rounded-full"></div>
                      </div>
                    </div>
                    <CardTitle className="heading-3">
                      {profile?.firstName} {profile?.lastName}
                    </CardTitle>
                    <CardDescription className="body-medium">
                      @{profile?.username}
                    </CardDescription>
                    <Badge variant="secondary" className="mt-2 capitalize">
                      {profile?.role}
                    </Badge>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 text-sm text-gray-600">
                        <Mail className="h-4 w-4" />
                        <span>{profile?.email}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-600">
                        <Calendar className="h-4 w-4" />
                        <span>Joined {new Date(profile?.createdAt || "").toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-600">
                        <User className="h-4 w-4" />
                        <span>Last active {new Date(profile?.lastLoginAt || "").toLocaleDateString()}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Stats */}
                <Card className="card-elevated mt-6">
                  <CardHeader>
                    <CardTitle className="heading-4">Quick Stats</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Courses Enrolled</span>
                        <span className="font-semibold">{profile?.coursesEnrolled || 0}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Courses Completed</span>
                        <span className="font-semibold">{profile?.coursesCompleted || 0}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Time Spent</span>
                        <span className="font-semibold">{profile?.totalTimeSpent || 0}h</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Edit Profile Form */}
              <div className="md:col-span-2">
                <Card className="card-elevated">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="heading-3">Personal Information</CardTitle>
                        <CardDescription>Update your personal details and bio</CardDescription>
                      </div>
                      <Button
                        variant="outline"
                        onClick={() => setIsEditing(!isEditing)}
                        className="btn-ghost"
                      >
                        {isEditing ? (
                          <>
                            <Settings className="h-4 w-4 mr-2" />
                            Cancel
                          </>
                        ) : (
                          <>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </>
                        )}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {isEditing ? (
                      <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="firstName" className="body-medium font-medium text-gray-700">
                              First Name
                            </Label>
                            <Input
                              id="firstName"
                              value={editData.firstName}
                              onChange={(e) => setEditData(prev => ({ ...prev, firstName: e.target.value }))}
                              className="h-12 border-gray-200 focus:border-indigo-500 focus:ring-indigo-500 text-gray-900 bg-white"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="lastName" className="body-medium font-medium text-gray-700">
                              Last Name
                            </Label>
                            <Input
                              id="lastName"
                              value={editData.lastName}
                              onChange={(e) => setEditData(prev => ({ ...prev, lastName: e.target.value }))}
                              className="h-12 border-gray-200 focus:border-indigo-500 focus:ring-indigo-500 text-gray-900 bg-white"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="bio" className="body-medium font-medium text-gray-700">
                            Bio
                          </Label>
                          <Textarea
                            id="bio"
                            value={editData.bio}
                            onChange={(e) => setEditData(prev => ({ ...prev, bio: e.target.value }))}
                            placeholder="Tell us about yourself..."
                            className="min-h-24 border-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
                          />
                        </div>

                        <div className="flex gap-4">
                          <Button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="btn-primary"
                          >
                            <Save className="h-4 w-4 mr-2" />
                            {isSaving ? "Saving..." : "Save Changes"}
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => setIsEditing(false)}
                            className="btn-secondary"
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label className="body-small font-medium text-gray-500 uppercase tracking-wide">
                              First Name
                            </Label>
                            <p className="body-medium mt-1">{profile?.firstName || "Not set"}</p>
                          </div>
                          <div>
                            <Label className="body-small font-medium text-gray-500 uppercase tracking-wide">
                              Last Name
                            </Label>
                            <p className="body-medium mt-1">{profile?.lastName || "Not set"}</p>
                          </div>
                        </div>

                        <div>
                          <Label className="body-small font-medium text-gray-500 uppercase tracking-wide">
                            Bio
                          </Label>
                          <p className="body-medium mt-1">
                            {profile?.bio || "No bio available"}
                          </p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Achievements */}
                <Card className="card-elevated mt-6">
                  <CardHeader>
                    <CardTitle className="heading-3 flex items-center gap-2">
                      <Trophy className="h-5 w-5 text-yellow-500" />
                      Achievements
                    </CardTitle>
                    <CardDescription>Your learning milestones and badges</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {profile?.achievements && profile.achievements.length > 0 ? (
                      <div className="grid grid-cols-2 gap-4">
                        {profile.achievements.map((achievement, index) => (
                          <div key={index} className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
                            <Trophy className="h-5 w-5 text-yellow-500" />
                            <span className="text-sm font-medium">{achievement}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Trophy className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500">No achievements yet</p>
                        <p className="text-sm text-gray-400 mt-1">Complete courses to earn badges!</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
