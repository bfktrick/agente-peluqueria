'use client'

import { useState, useRef, useTransition } from 'react'
import { useRouter } from 'next/navigation'

// ─── Shared upload helper ────────────────────────────────────────────────────

async function uploadFile(file: File): Promise<string> {
  const fd = new FormData()
  fd.append('file', file)
  const res = await fetch('/api/upload', { method: 'POST', body: fd })
  const json = await res.json() as { success: boolean; url?: string; error?: string }
  if (!json.success || !json.url) throw new Error(json.error ?? 'Error al subir')
  return json.url
}

// ─── Experience image section ────────────────────────────────────────────────

function ExperienceImageAdmin({ initialUrl }: { initialUrl: string }) {
  const router = useRouter()
  const [, startTransition] = useTransition()
  const [url, setUrl]       = useState(initialUrl)
  const [saving, setSaving] = useState(false)
  const [error, setError]   = useState<string | null>(null)
  const inputRef            = useRef<HTMLInputElement>(null)

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setError(null)
    setSaving(true)
    try {
      const newUrl = await uploadFile(file)
      await fetch('/api/images', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: 'experience_image', value: newUrl }),
      })
      setUrl(newUrl)
      startTransition(() => router.refresh())
    } catch (err) {
      setError(String(err))
    } finally {
      setSaving(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  return (
    <div>
      <h2 className="font-serif text-xl text-white mb-1">Imagen de Experiencia</h2>
      <p className="label-sm mb-6" style={{ color: 'var(--color-white-muted)' }}>
        Aparece en la sección "La experiencia" de la página principal.
      </p>

      <div className="flex flex-col sm:flex-row gap-6 items-start">
        {/* Preview */}
        <div
          className="shrink-0 overflow-hidden rounded-xl"
          style={{
            width: '240px',
            height: '180px',
            background: 'var(--color-surface-2)',
            border: '1px solid var(--color-surface-3)',
          }}
        >
          {url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={url} alt="Experience" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="label-sm" style={{ color: 'var(--color-white-subtle)' }}>Sin imagen</span>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex flex-col gap-3">
          <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleFile} />
          <button
            onClick={() => inputRef.current?.click()}
            disabled={saving}
            className="btn-primary"
          >
            {saving ? 'Subiendo...' : url ? 'Cambiar imagen' : 'Subir imagen'}
          </button>
          <p className="label-sm" style={{ color: 'var(--color-white-subtle)' }}>
            JPG, PNG o WEBP · recomendado 800×600 px
          </p>
          {error && <p className="label-sm" style={{ color: '#f87171' }}>{error}</p>}
        </div>
      </div>
    </div>
  )
}

// ─── Gallery section ─────────────────────────────────────────────────────────

function GalleryAdmin({ initialUrls }: { initialUrls: string[] }) {
  const router                   = useRouter()
  const [, startTransition]      = useTransition()
  const [urls, setUrls]          = useState<string[]>(initialUrls)
  const [uploading, setUploading] = useState(false)
  const [error, setError]        = useState<string | null>(null)
  const inputRef                 = useRef<HTMLInputElement>(null)

  async function save(newUrls: string[]) {
    await fetch('/api/images', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key: 'gallery_images', value: newUrls }),
    })
    startTransition(() => router.refresh())
  }

  async function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    if (!files.length) return
    setError(null)
    setUploading(true)
    try {
      const newUrls = await Promise.all(files.map(uploadFile))
      const updated = [...urls, ...newUrls]
      setUrls(updated)
      await save(updated)
    } catch (err) {
      setError(String(err))
    } finally {
      setUploading(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  async function remove(url: string) {
    const updated = urls.filter((u) => u !== url)
    setUrls(updated)
    await save(updated)
  }

  return (
    <div>
      <h2 className="font-serif text-xl text-white mb-1">Galería — Nuestro Trabajo</h2>
      <p className="label-sm mb-6" style={{ color: 'var(--color-white-muted)' }}>
        Imágenes que aparecen en la sección "Galería" de la página principal. Puedes añadir varias a la vez.
      </p>

      {/* Upload button */}
      <div className="mb-8">
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          className="hidden"
          onChange={handleFiles}
        />
        <button
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="btn-primary"
        >
          {uploading ? 'Subiendo...' : '+ Añadir imágenes'}
        </button>
        <span className="label-sm ml-4" style={{ color: 'var(--color-white-subtle)' }}>
          JPG, PNG o WEBP · puedes seleccionar varias a la vez
        </span>
        {error && <p className="label-sm mt-2" style={{ color: '#f87171' }}>{error}</p>}
      </div>

      {/* Grid */}
      {urls.length === 0 ? (
        <p className="body-sm" style={{ color: 'var(--color-white-muted)' }}>
          No hay imágenes en la galería. Sube la primera.
        </p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {urls.map((url, i) => (
            <div
              key={url}
              className="relative group overflow-hidden rounded-xl"
              style={{
                aspectRatio: '1',
                background: 'var(--color-surface-2)',
                border: '1px solid var(--color-surface-3)',
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt={`Galería ${i + 1}`} className="w-full h-full object-cover" />

              {/* Delete overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-all duration-200 flex items-center justify-center">
                <button
                  onClick={() => remove(url)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 px-3 py-1.5 text-xs font-medium rounded"
                  style={{ background: '#ef4444', color: 'white' }}
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Main export ─────────────────────────────────────────────────────────────

export function ImagesAdmin({
  experienceUrl,
  galleryUrls,
}: {
  experienceUrl: string
  galleryUrls: string[]
}) {
  return (
    <div className="flex flex-col gap-16">
      <ExperienceImageAdmin initialUrl={experienceUrl} />

      {/* Divider */}
      <div className="h-px" style={{ background: 'var(--color-surface-2)' }} />

      <GalleryAdmin initialUrls={galleryUrls} />
    </div>
  )
}
