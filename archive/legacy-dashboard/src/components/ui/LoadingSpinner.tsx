import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  text = '読み込み中',
  className = ''
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <div className={`flex flex-col items-center justify-center space-y-3 ${className}`}>
      <div className="relative">
        <div className={`${sizeClasses[size]} border-4 border-slate-200 dark:border-slate-700 rounded-full animate-spin`}>
          <div className="absolute inset-0 border-4 border-transparent border-t-blue-600 rounded-full animate-spin"></div>
        </div>
      </div>
      {text && (
        <p className="text-sm text-slate-600 dark:text-slate-400 font-medium animate-pulse">
          {text}
          <span className="loading-dots">...</span>
        </p>
      )}
    </div>
  );
};

export const SkeletonLoader: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`skeleton rounded-lg ${className}`}></div>
);

export const CardSkeleton: React.FC = () => (
  <div className="bg-white dark:bg-slate-800 rounded-xl p-6 space-y-4 animate-pulse">
    <div className="skeleton h-4 w-3/4 rounded"></div>
    <div className="skeleton h-3 w-1/2 rounded"></div>
    <div className="skeleton h-20 w-full rounded"></div>
    <div className="flex space-x-2">
      <div className="skeleton h-8 w-16 rounded"></div>
      <div className="skeleton h-8 w-20 rounded"></div>
    </div>
  </div>
);