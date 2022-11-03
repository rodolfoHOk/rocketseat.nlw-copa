import { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'PRIMARY' | 'SECONDARY';
  title: string;
  icon?: ReactNode;
  size?: 'FULL' | 'CONTENT';
}

export function Button({
  variant = 'PRIMARY',
  title,
  icon,
  size = 'FULL',
  ...htmlButtonProps
}: ButtonProps) {
  return (
    <button
      className={`px-6 py-4 flex gap-2 items-center justify-center rounded
        font-bold text-sm uppercase transition-colors duration-200
        ${
          variant === 'SECONDARY'
            ? 'bg-red-600 text-gray-100 hover:bg-red-700'
            : 'bg-yellow-500 text-gray-900 hover:bg-yellow-700'
        }
        ${size === 'FULL' ? 'flex-1' : ''}
      `}
      {...htmlButtonProps}
    >
      {icon && icon}
      {title}
    </button>
  );
}
