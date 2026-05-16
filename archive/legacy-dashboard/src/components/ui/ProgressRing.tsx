import React from 'react';

interface ProgressRingProps {
    percentage: number;
    size?: 'sm' | 'md' | 'lg';
    label?: string;
    color?: 'primary' | 'success' | 'warning' | 'danger';
    showPercentage?: boolean;
}

export const ProgressRing: React.FC<ProgressRingProps> = ({
    percentage,
    size = 'md',
    label,
    color = 'primary',
    showPercentage = true
}) => {
    const sizes = {
        sm: { width: 80, stroke: 6, fontSize: 'text-body' },
        md: { width: 120, stroke: 8, fontSize: 'text-h2' },
        lg: { width: 160, stroke: 10, fontSize: 'text-h1' },
    };

    const colors = {
        primary: 'text-primary-500',
        success: 'text-success-500',
        warning: 'text-warning-500',
        danger: 'text-danger-500',
    };

    const { width, stroke, fontSize } = sizes[size];
    const radius = (width - stroke) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;

    return (
        <div className="flex flex-col items-center gap-2">
            <div className="relative" style={{ width, height: width }}>
                <svg width={width} height={width} className="transform -rotate-90">
                    {/* Background circle */}
                    <circle
                        cx={width / 2}
                        cy={width / 2}
                        r={radius}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={stroke}
                        className="text-neutral-200 dark:text-neutral-700"
                    />
                    {/* Progress circle */}
                    <circle
                        cx={width / 2}
                        cy={width / 2}
                        r={radius}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={stroke}
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        strokeLinecap="round"
                        className={`${colors[color]} transition-all duration-slow`}
                    />
                </svg>
                {showPercentage && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className={`${fontSize} font-bold text-neutral-900 dark:text-neutral-100`}>
                            {Math.round(percentage)}%
                        </span>
                    </div>
                )}
            </div>
            {label && (
                <span className="text-small text-neutral-600 dark:text-neutral-400 font-medium text-center">
                    {label}
                </span>
            )}
        </div>
    );
};
