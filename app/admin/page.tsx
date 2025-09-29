import { requireAdmin } from '@/lib/admin-auth'
import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Users, 
  UserCheck, 
  Shield, 
  Activity, 
  Settings,
  BarChart3
} from 'lucide-react'
import Link from 'next/link'

async function getAdminStats() {
  const [totalUsers, activeUsers, adminUsers, recentUsers] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { isActive: true } }),
    prisma.user.count({ where: { role: { in: ['admin', 'super_admin'] } } }),
    prisma.user.count({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Last 7 days
        }
      }
    })
  ])
  
  return { totalUsers, activeUsers, adminUsers, recentUsers }
}

export default async function AdminDashboard() {
  await requireAdmin()
  
  const stats = await getAdminStats()
  
  return (
    <div className="flex-1">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-14 items-center px-6">
          <div className="flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span className="font-semibold">Admin Dashboard</span>
          </div>
          <div className="ml-auto">
            <Badge variant="outline">
              Admin Access
            </Badge>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        <div className="space-y-6">
          {/* Welcome Section */}
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
            <p className="text-muted-foreground">
              Manage your application users and system settings
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalUsers}</div>
                <p className="text-xs text-muted-foreground">
                  All registered users
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                <UserCheck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.activeUsers}</div>
                <p className="text-xs text-muted-foreground">
                  Currently active
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Admins</CardTitle>
                <Shield className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.adminUsers}</div>
                <p className="text-xs text-muted-foreground">
                  Admin users
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">New Users</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.recentUsers}</div>
                <p className="text-xs text-muted-foreground">
                  Last 7 days
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Common administrative tasks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Button asChild className="h-auto p-4">
                  <Link href="/admin/users" className="flex flex-col items-start space-y-2">
                    <Users className="h-5 w-5" />
                    <div className="text-left">
                      <div className="font-medium">User Management</div>
                      <div className="text-sm text-muted-foreground">
                        View and manage all users
                      </div>
                    </div>
                  </Link>
                </Button>
                
                <Button variant="outline" asChild className="h-auto p-4">
                  <Link href="/admin/analytics" className="flex flex-col items-start space-y-2">
                    <BarChart3 className="h-5 w-5" />
                    <div className="text-left">
                      <div className="font-medium">Analytics</div>
                      <div className="text-sm text-muted-foreground">
                        View system analytics
                      </div>
                    </div>
                  </Link>
                </Button>
                
                <Button variant="outline" asChild className="h-auto p-4">
                  <Link href="/admin/settings" className="flex flex-col items-start space-y-2">
                    <Settings className="h-5 w-5" />
                    <div className="text-left">
                      <div className="font-medium">Settings</div>
                      <div className="text-sm text-muted-foreground">
                        Configure system settings
                      </div>
                    </div>
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Recent Users</CardTitle>
                <CardDescription>
                  Latest user registrations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                      <span className="text-sm font-medium">U</span>
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium">New user registered</p>
                      <p className="text-xs text-muted-foreground">2 minutes ago</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                      <span className="text-sm font-medium">A</span>
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium">Admin login</p>
                      <p className="text-xs text-muted-foreground">5 minutes ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>System Status</CardTitle>
                <CardDescription>
                  Current system health
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Database</span>
                    <Badge variant="default">Healthy</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Authentication</span>
                    <Badge variant="default">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">API</span>
                    <Badge variant="default">Online</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}