import { Navbar } from '@/components/public/navbar'

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <div style={{ paddingTop: '48px' }}>{children}</div>
    </>
  )
}
