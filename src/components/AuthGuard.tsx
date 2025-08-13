'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useAuth } from '@/lib/auth'

export default function AuthGuard({ children, role }: { children: React.ReactNode; role?: 'admin' | 'user' }) {
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push('/login')
    } else if (role && user.role !== role) {
      router.push('/dashboard')
    }
  }, [user, router, role])

  if (!user || (role && user.role !== role)) {
    return null
  }

  return <>{children}</>
}