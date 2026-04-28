import type { Metadata } from 'next'
import { createAdminClient } from '@/lib/supabase/server'
import { FadeIn } from '@/components/ui/fade-in'
import type { Review } from '@/lib/types'

export const metadata: Metadata = {
  title: 'Reseñas',
  description:
    'Lo que dicen nuestros clientes. Reseñas verificadas de AG Beauty Salon en Tarragona.',
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${rating} de 5 estrellas`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          viewBox="0 0 12 12"
          className="w-3 h-3"
          fill={i < rating ? 'var(--color-green-bright)' : 'var(--color-surface-3)'}
        >
          <path d="M6 0l1.5 4h4.5l-3.5 2.5 1.3 4L6 8 2.2 10.5l1.3-4L0 4h4.5z" />
        </svg>
      ))}
    </div>
  )
}

function ReviewCard({ review, index }: { review: Review; index: number }) {
  return (
    <FadeIn delay={index * 0.08} direction="up">
      <article className="card-dark p-6 flex flex-col gap-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-label text-xs tracking-wide text-white">{review.customer_name}</p>
            <time
              className="label-sm"
              dateTime={review.created_at}
              style={{ color: 'var(--color-white-subtle)' }}
            >
              {new Date(review.created_at).toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
              })}
            </time>
          </div>
          <StarRating rating={review.rating} />
        </div>

        {review.comment && (
          <p className="body-sm" style={{ color: 'var(--color-white-muted)' }}>
            &ldquo;{review.comment}&rdquo;
          </p>
        )}
      </article>
    </FadeIn>
  )
}

export default async function ResenasPage() {
  const db = createAdminClient()
  const { data } = await db
    .from('reviews')
    .select('*, service:services(name)')
    .eq('visible', true)
    .order('created_at', { ascending: false })

  const reviews: Review[] = data ?? []

  const avgRating =
    reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : '4.9'

  return (
    <main className="pt-24 pb-28 px-6 min-h-screen" style={{ background: 'var(--color-black)' }}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <FadeIn direction="up">
          <div className="mb-16">
            <span className="label block mb-4">Nuestros clientes</span>
            <h1 className="heading-xl mb-3">Reseñas</h1>
            <div className="flex items-center gap-4 mt-6">
              <span
                className="font-serif text-5xl"
                style={{ color: 'var(--color-green-bright)' }}
              >
                {avgRating}
              </span>
              <div>
                <StarRating rating={5} />
                <p className="label-sm mt-1">
                  {reviews.length > 0 ? `${reviews.length} reseñas` : '51 reseñas en Booksy'}
                </p>
              </div>
            </div>
          </div>
        </FadeIn>

        {/* Reviews grid */}
        {reviews.length === 0 ? (
          <FadeIn>
            <div
              className="p-12 text-center"
              style={{
                border: '1px solid var(--color-surface-2)',
                background: 'var(--color-surface)',
              }}
            >
              <p className="heading-sm mb-3">Sin reseñas aún</p>
              <p className="body">
                Sé el primero en compartir tu experiencia.
              </p>
            </div>
          </FadeIn>
        ) : (
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
            {reviews.map((r, i) => (
              <div key={r.id} className="break-inside-avoid">
                <ReviewCard review={r} index={i} />
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
