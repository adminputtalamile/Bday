import type { ReactNode } from 'react'

interface FormFieldProps {
  label: string
  hint?: string
  children: ReactNode
}

export default function FormField({ label, hint, children }: FormFieldProps) {
  return (
    <label className="block">
      <span className="mb-1.5 block font-display text-sm text-ink/90">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs text-ink/40">{hint}</span>}
    </label>
  )
}

export const inputClass =
  'w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm text-ink placeholder:text-ink/30 outline-none transition focus:border-[var(--color-gold-soft)]/60 focus:bg-white/[0.07]'
