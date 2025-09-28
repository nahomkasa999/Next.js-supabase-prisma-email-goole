'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { User } from '@prisma/client'

export function useUser() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchUser() {
      try {
        setLoading(true)
        const supabase = createClient()
        
        // Get the current authenticated user
        const { data: { user: authUser }, error: authError } = await supabase.auth.getUser()
        
        if (authError || !authUser) {
          setUser(null)
          return
        }

        // Fetch user data from our API
        // The user should already exist via database trigger
        const response = await fetch(`/api/users/${authUser.id}`)
        
        if (response.ok) {
          const userData = await response.json()
          setUser(userData)
        } else {
          // If user doesn't exist, wait for trigger to create it and retry
          console.log('User not found, waiting for trigger to create user...')
          
          // Wait a moment for the trigger to fire, then retry
          setTimeout(async () => {
            const retryResponse = await fetch(`/api/users/${authUser.id}`)
            if (retryResponse.ok) {
              const userData = await retryResponse.json()
              setUser(userData)
            } else {
              setError('User not found - database trigger may not have fired')
            }
          }, 2000) // Wait 2 seconds for trigger
        }
      } catch (err) {
        console.error('Error fetching user:', err)
        setError('Failed to fetch user data')
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [])

  const updateLastSeen = async () => {
    if (!user) return

    try {
      await fetch(`/api/users/${user.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'update_last_seen' }),
      })
    } catch (err) {
      console.error('Error updating last seen:', err)
    }
  }

  const updateProfile = async (data: { fullName?: string; avatarUrl?: string }) => {
    if (!user) return

    try {
      const response = await fetch(`/api/users/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        const updatedUser = await response.json()
        setUser(updatedUser)
      }
    } catch (err) {
      console.error('Error updating profile:', err)
      setError('Failed to update profile')
    }
  }

  return {
    user,
    loading,
    error,
    updateLastSeen,
    updateProfile,
  }
}
