export default function ParticlesBackground({ className = '' }: { className?: string }) {
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden="true">
      <div className="absolute -top-1/3 -left-1/4 h-[70vh] w-[70vh] rounded-full bg-rose-500/20 blur-[120px]" />
      <div className="absolute top-1/3 -right-1/4 h-[60vh] w-[60vh] rounded-full bg-[var(--color-gold)]/15 blur-[120px]" />
      <div className="absolute bottom-0 left-1/4 h-[50vh] w-[50vh] rounded-full bg-purple-500/15 blur-[120px]" />
    </div>
  )
}
