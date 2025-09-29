'use client'

import { useUser } from '@/lib/hooks/use-user'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export function TriggerTest() {
  const { user, loading, error } = useUser()

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Database Trigger Test</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading && (
          <div className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
            <span>Loading user...</span>
          </div>
        )}

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700">
            <strong>Error:</strong> {error}
          </div>
        )}

        {user && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant="outline">✅ Trigger Working</Badge>
              <span className="text-sm text-gray-600">User created automatically</span>
            </div>
            
            <div className="text-sm space-y-1">
              <p><strong>ID:</strong> {user.id}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Full Name:</strong> {user.fullName || 'Not set'}</p>
              <p><strong>Created:</strong> {new Date(user.createdAt).toLocaleString()}</p>
              <p><strong>Last Seen:</strong> {new Date(user.lastSeen).toLocaleString()}</p>
            </div>
          </div>
        )}

        {!loading && !user && !error && (
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded text-yellow-700">
            <strong>No user found.</strong> Please sign in to test the trigger.
          </div>
        )}
      </CardContent>
    </Card>
  )
}
