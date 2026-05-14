import { createAdminClient } from '@/lib/supabase/server'
import { ReviewsAdmin } from '@/components/admin/reviews-admin'

export default async function OpinionesPage() {
  const db = createAdminClient()
  const { data } = await db
    .from('reviews')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="p-8 max-w-5xl">
      <div className="mb-10">
        <span className="label-sm block mb-2" style={{ color: 'var(--color-green-sage)' }}>Admin</span>
        <h1 className="font-serif text-3xl text-white mb-1">Opiniones</h1>
        <p className="label-sm" style={{ color: 'var(--color-white-muted)' }}>
          Gestiona las reseñas que aparecen en la página principal.
        </p>
      </div>
      <ReviewsAdmin initialReviews={data ?? []} />
    </div>
  )
}
