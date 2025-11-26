import React from 'react';

const variants = {
  default: 'bg-primary-100 text-primary-700 dark:bg-primary-900/40 dark:text-primary-300',
  success: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300',
  destructive: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
  warning: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300',
  info: 'bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300',
  secondary: 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300',
};

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: keyof typeof variants;
}

export const Badge: React.FC<BadgeProps> = ({ className, variant = 'default', ...props }) => {
  return (
    <div
      className={`inline-flex items-center rounded-full border border-transparent px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${variants[variant]} ${className}`}
      {...props}
    />
  );
};
