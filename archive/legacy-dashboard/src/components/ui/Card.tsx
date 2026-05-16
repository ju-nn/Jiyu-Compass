import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  variant?: 'default' | 'elevated' | 'outlined' | 'filled' | 'glass';
  loading?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hover = false,
  padding = 'md',
  variant = 'default',
  loading = false
}) => {
  const baseClasses = 'rounded-lg transition-all duration-normal';

  const variantClasses = {
    default: 'bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 shadow-sm',
    elevated: 'bg-white dark:bg-neutral-800 shadow-lg border-0',
    outlined: 'bg-transparent border-2 border-neutral-300 dark:border-neutral-600',
    filled: 'bg-neutral-50 dark:bg-neutral-800/50 border-0',
    glass: 'glass-card shadow-glass dark:shadow-glass-dark border-0'
  };

  const paddingClasses = {
    none: '',
    sm: 'p-3',
    md: 'p-4 md:p-6',
    lg: 'p-6 md:p-8'
  };

  const hoverClass = hover ? 'hover:shadow-md hover:-translate-y-0.5 cursor-pointer' : '';

  if (loading) {
    return (
      <div className={`
        ${baseClasses}
        ${variantClasses[variant]}
        ${paddingClasses[padding]}
        ${className}
        animate-pulse
      `}>
        <div className="space-y-3">
          <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-3/4"></div>
          <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`
      ${baseClasses}
      ${variantClasses[variant]}
      ${paddingClasses[padding]}
      ${hoverClass}
      ${className}
    `}>
      {children}
    </div>
  );
};

export const CardHeader: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = ''
}) => (
  <div className={`mb-4 ${className}`}>
    {children}
  </div>
);

export const CardTitle: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = ''
}) => (
  <h3 className={`text-h3 text-neutral-900 dark:text-neutral-100 ${className}`}>
    {children}
  </h3>
);

export const CardDescription: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = ''
}) => (
  <p className={`text-small text-neutral-600 dark:text-neutral-400 ${className}`}>
    {children}
  </p>
);

export const CardContent: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = ''
}) => (
  <div className={className}>
    {children}
  </div>
);

export const CardFooter: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = ''
}) => (
  <div className={`mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-700 ${className}`}>
    {children}
  </div>
);