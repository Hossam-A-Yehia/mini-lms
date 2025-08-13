import { ReactNode } from 'react'
import AuthGuard from '@/components/AuthGuard'
import DashboardNav from '@/components/DashboardNav'

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <AuthGuard>
      <div className="flex min-h-screen">
        <DashboardNav />
        <main className="flex-1 p-8">{children}</main>
      </div>
    </AuthGuard>
  )
}