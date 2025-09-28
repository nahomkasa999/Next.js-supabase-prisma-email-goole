'use client'

import { useUser } from '@/lib/hooks/use-user'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useState } from 'react'

export function UserProfile() {
  const { user, loading, error, updateProfile } = useUser()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    avatarUrl: user?.avatarUrl || '',
  })

  if (loading) {
    return <div>Loading user profile...</div>
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  if (!user) {
    return <div>No user found. Please sign in.</div>
  }

  const handleSave = async () => {
    await updateProfile(formData)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setFormData({
      fullName: user.fullName || '',
      avatarUrl: user.avatarUrl || '',
    })
    setIsEditing(false)
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>User Profile</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            value={user.email}
            disabled
            className="bg-gray-50"
          />
        </div>

        <div>
          <Label htmlFor="fullName">Full Name</Label>
          {isEditing ? (
            <Input
              id="fullName"
              value={formData.fullName}
              onChange={(e) =>
                setFormData({ ...formData, fullName: e.target.value })
              }
            />
          ) : (
            <div className="p-2 bg-gray-50 rounded">
              {user.fullName || 'Not set'}
            </div>
          )}
        </div>

        <div>
          <Label htmlFor="avatarUrl">Avatar URL</Label>
          {isEditing ? (
            <Input
              id="avatarUrl"
              value={formData.avatarUrl}
              onChange={(e) =>
                setFormData({ ...formData, avatarUrl: e.target.value })
              }
            />
          ) : (
            <div className="p-2 bg-gray-50 rounded">
              {user.avatarUrl || 'Not set'}
            </div>
          )}
        </div>

        <div className="text-sm text-gray-600">
          <p>Last seen: {new Date(user.lastSeen).toLocaleString()}</p>
          <p>Member since: {new Date(user.createdAt).toLocaleDateString()}</p>
        </div>

        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button onClick={handleSave}>Save</Button>
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
