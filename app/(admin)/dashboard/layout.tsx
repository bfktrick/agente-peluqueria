import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { verifyToken, SESSION_COOKIE } from '@/lib/auth'
import { Sidebar } from '@/components/admin/sidebar'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE)?.value

  if (!verifyToken(token)) redirect('/login')

  return (
    <div className="flex min-h-screen" style={{ background: 'var(--color-black)' }}>
      <Sidebar />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  )
}
