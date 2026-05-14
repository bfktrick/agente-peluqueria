import { createAdminClient } from '@/lib/supabase/server'
import { ImagesAdmin } from '@/components/admin/images-admin'

const FALLBACK_EXPERIENCE = 'https://kluruxhjziayommqnfeo.supabase.co/storage/v1/object/public/gallery/salon-05.jpg'
const FALLBACK_GALLERY = [
  'https://kluruxhjziayommqnfeo.supabase.co/storage/v1/object/public/gallery/salon-06.jpg',
  'https://kluruxhjziayommqnfeo.supabase.co/storage/v1/object/public/gallery/salon-07.jpg',
  'https://kluruxhjziayommqnfeo.supabase.co/storage/v1/object/public/gallery/salon-01.jpg',
  'https://kluruxhjziayommqnfeo.supabase.co/storage/v1/object/public/gallery/salon-03.jpg',
]

export default async function ImagenesPage() {
  const db = createAdminClient()

  const [{ data: expRow }, { data: galRow }] = await Promise.all([
    db.from('settings').select('value').eq('key', 'experience_image').single(),
    db.from('settings').select('value').eq('key', 'gallery_images').single(),
  ])

  const experienceUrl = (expRow?.value as string | null) ?? FALLBACK_EXPERIENCE
  const galleryUrls   = (galRow?.value as string[] | null) ?? FALLBACK_GALLERY

  return (
    <div className="p-8 max-w-5xl">
      <div className="mb-10">
        <span className="label-sm block mb-2" style={{ color: 'var(--color-green-sage)' }}>Admin</span>
        <h1 className="font-serif text-3xl text-white">Imágenes</h1>
      </div>

      <ImagesAdmin experienceUrl={experienceUrl} galleryUrls={galleryUrls} />
    </div>
  )
}
