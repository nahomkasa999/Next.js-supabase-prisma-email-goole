import { NextResponse } from 'next/server'
import { UserService } from '@/lib/user-service'

export async function GET() {
  try {
    const users = await UserService.getActiveUsers()
    return NextResponse.json(users)
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    )
  }
}
