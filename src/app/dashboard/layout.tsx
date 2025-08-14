import { ReactNode } from 'react'
import AuthGuard from '@/components/AuthGuard'
import DashboardNav from '@/components/DashboardNav'
import ClientWrapper from '@/components/ClientWrapper'

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <ClientWrapper>
    <AuthGuard type='protected'>
      <div className="flex min-h-screen">
        <DashboardNav />
        <main className="flex-1 py-5">{children}</main>
      </div>
    </AuthGuard>
    </ClientWrapper>
  )
}