import { cn } from '@/shared/lib/utils'

interface LogoProps {
  subtitle?: string
  accent?: 'primary' | 'secondary'
  className?: string
  size?: 'sm' | 'md' | 'lg' | 'sidebar'
}

export function Logo({ subtitle, accent = 'primary', className, size = 'md' }: LogoProps) {
  const accentColor = accent === 'secondary' ? 'var(--accent-secondary)' : 'var(--accent-primary)'
  const titleSize =
    size === 'lg'
      ? 'text-3xl'
      : size === 'sidebar'
        ? 'text-[1.2375rem]'
        : size === 'sm'
          ? 'text-base'
          : 'text-lg'
  const subtitleSize = size === 'sidebar' ? 'text-[0.825rem]' : 'text-xs'

  return (
    <div className={cn('flex flex-col', className)}>
      <span className={cn('font-bold text-foreground leading-tight tracking-tight', titleSize)}>
        Learn<span style={{ color: accentColor }}>ify</span>
      </span>
      {subtitle && (
        <span className={cn('font-medium', subtitleSize)} style={{ color: accentColor }}>
          {subtitle}
        </span>
      )}
    </div>
  )
}
