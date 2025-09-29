import { redirect } from 'next/navigation'
import { requireAdmin } from '@/lib/admin-auth'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  try {
    // This will throw an error if user is not admin
    await requireAdmin()
    
    return (
      <div className="min-h-screen bg-background flex">
        {/* <AdminSidebar /> */}
        <main className="flex-1">
          {children}
        </main>
      </div>
    )
  } catch {
    // Redirect to unauthorized page if not admin
    redirect('/unauthorized')
  }
}

