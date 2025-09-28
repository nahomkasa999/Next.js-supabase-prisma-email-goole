import { prisma } from './prisma'
import { createClient } from './supabase/server'

export interface UserData {
  id: string
  email: string
  fullName?: string
  avatarUrl?: string
}

export class UserService {
  // Note: User creation is handled automatically by database trigger
  // when a user signs up through Supabase Auth

  /**
   * Get user by ID
   */
  static async getUserById(id: string) {
    try {
      const user = await prisma.user.findUnique({
        where: { id },
      })
      return user
    } catch (error) {
      console.error('Error fetching user:', error)
      throw error
    }
  }

  /**
   * Update user's last seen timestamp
   */
  static async updateLastSeen(id: string) {
    try {
      const user = await prisma.user.update({
        where: { id },
        data: { lastSeen: new Date() },
      })
      return user
    } catch (error) {
      console.error('Error updating last seen:', error)
      throw error
    }
  }

  /**
   * Update user profile
   */
  static async updateUserProfile(id: string, data: Partial<UserData>) {
    try {
      const user = await prisma.user.update({
        where: { id },
        data: {
          fullName: data.fullName,
          avatarUrl: data.avatarUrl,
          updatedAt: new Date(),
        },
      })
      return user
    } catch (error) {
      console.error('Error updating user profile:', error)
      throw error
    }
  }

  /**
   * Get current user from Supabase auth
   * The user should already exist in our users table via database trigger
   */
  static async getCurrentUser() {
    try {
      const supabase = await createClient()
      const { data: { user }, error } = await supabase.auth.getUser()
      
      if (error || !user) {
        return null
      }

      // Get user from our users table (created by trigger)
      const userRecord = await this.getUserById(user.id)
      return userRecord
    } catch (error) {
      console.error('Error getting current user:', error)
      return null
    }
  }

  /**
   * Get all active users
   */
  static async getActiveUsers() {
    try {
      const users = await prisma.user.findMany({
        where: { isActive: true },
        orderBy: { lastSeen: 'desc' },
      })
      return users
    } catch (error) {
      console.error('Error fetching active users:', error)
      throw error
    }
  }

  /**
   * Deactivate user
   */
  static async deactivateUser(id: string) {
    try {
      const user = await prisma.user.update({
        where: { id },
        data: { isActive: false },
      })
      return user
    } catch (error) {
      console.error('Error deactivating user:', error)
      throw error
    }
  }
}
