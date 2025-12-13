import React from 'react'

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'outline'
}

export default function Button({ variant = 'primary', children, ...rest }: ButtonProps) {
  const base = 'rounded-full px-5 py-2 text-xs font-semibold transition'
  const styles =
    variant === 'primary'
      ? 'bg-brand-500 text-white shadow-lg hover:bg-brand-700'
      : 'border border-white/20 text-white/80 hover:bg-white/5'

  return (
    <button className={`${base} ${styles}`} {...rest}>
      {children}
    </button>
  )
}
