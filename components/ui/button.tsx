import type { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'outline' | 'secondary';
}

export function Button({ className = '', variant, ...props }: ButtonProps) {
  const variantClasses = variant === 'outline'
    ? 'border border-gray-300 bg-white hover:bg-gray-100'
    : variant === 'secondary'
      ? 'border border-gray-200 bg-gray-100 text-gray-900 hover:bg-gray-200'
      : 'bg-blue-600 text-white hover:bg-blue-700';

  return (
    <button
      className={`inline-flex h-10 items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50 ${variantClasses} ${className}`}
      {...props}
    />
  );
}
