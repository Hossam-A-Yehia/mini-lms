import { ReactNode } from 'react'
import AuthGuard from '@/components/AuthGuard'
export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <AuthGuard type="public">
        {children}
    </AuthGuard>
  )
}