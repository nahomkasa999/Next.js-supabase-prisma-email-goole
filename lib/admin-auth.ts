import { prisma } from './prisma'
import { createClient } from './supabase/server'

export type UserRole = 'user' | 'admin' | 'super_admin'

export interface AdminUser {
  id: string
  email: string
  fullName: string | null
  avatarUrl: string | null
  role: UserRole
  createdAt: Date
  lastSeen: Date
  isActive: boolean
}

/**
 * Check if a user has admin privileges
 */
export async function isAdmin(userId: string): Promise<boolean> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true }
    })
    
    return user?.role === 'admin' || user?.role === 'super_admin'
  } catch (error) {
    console.error('Error checking admin status:', error)
    return false
  }
}

/**
 * Check if a user has super admin privileges
 */
export async function isSuperAdmin(userId: string): Promise<boolean> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true }
    })
    
    return user?.role === 'super_admin'
  } catch (error) {
    console.error('Error checking super admin status:', error)
    return false
  }
}

/**
 * Get current user's role
 */
export async function getUserRole(userId: string): Promise<UserRole | null> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true }
    })
    
    return user?.role as UserRole || null
  } catch (error) {
    console.error('Error getting user role:', error)
    return null
  }
}

/**
 * Require admin access - throws error if not admin
 */
export async function requireAdmin(): Promise<AdminUser> {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error || !user) {
    throw new Error('Authentication required')
  }
  
  const isUserAdmin = await isAdmin(user.id)
  if (!isUserAdmin) {
    throw new Error('Admin access required')
  }
  
  // Get full user data
  const adminUser = await prisma.user.findUnique({
    where: { id: user.id }
  })
  
  if (!adminUser) {
    throw new Error('User not found')
  }
  
  return adminUser as AdminUser
}

/**
 * Require super admin access - throws error if not super admin
 */
export async function requireSuperAdmin(): Promise<AdminUser> {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error || !user) {
    throw new Error('Authentication required')
  }
  
  const isUserSuperAdmin = await isSuperAdmin(user.id)
  if (!isUserSuperAdmin) {
    throw new Error('Super admin access required')
  }
  
  // Get full user data
  const adminUser = await prisma.user.findUnique({
    where: { id: user.id }
  })
  
  if (!adminUser) {
    throw new Error('User not found')
  }
  
  return adminUser as AdminUser
}

/**
 * Get all admin users
 */
export async function getAdminUsers(): Promise<AdminUser[]> {
  try {
    const adminUsers = await prisma.user.findMany({
      where: {
        role: {
          in: ['admin', 'super_admin']
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
    
    return adminUsers as AdminUser[]
  } catch (error) {
    console.error('Error fetching admin users:', error)
    throw error
  }
}

/**
 * Update user role (super admin only)
 */
export async function updateUserRole(userId: string, newRole: UserRole): Promise<AdminUser> {
  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { role: newRole },
    })
    
    return updatedUser as AdminUser
  } catch (error) {
    console.error('Error updating user role:', error)
    throw error
  }
}

/**
 * Check if user can access admin dashboard
 */
export async function canAccessAdmin(userId: string): Promise<boolean> {
  try {
    const role = await getUserRole(userId)
    return role === 'admin' || role === 'super_admin'
  } catch (error) {
    console.error('Error checking admin access:', error)
    return false
  }
}

