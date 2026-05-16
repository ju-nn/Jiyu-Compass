import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface StatusCardProps {
    value: string | number;
    label: string;
    change?: string;
    trend?: 'up' | 'down' | 'neutral';
    icon?: LucideIcon;
    variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
}

export const StatusCard: React.FC<StatusCardProps> = ({
    value,
    label,
    change,
    trend = 'neutral',
    icon: Icon,
    variant = 'default'
}) => {
    const variantStyles = {
        default: 'bg-neutral-50 dark:bg-neutral-800/50 border-neutral-200 dark:border-neutral-700',
        primary: 'bg-primary-50 dark:bg-primary-900/20 border-primary-200 dark:border-primary-800',
        success: 'bg-success-50 dark:bg-success-900/20 border-success-200 dark:border-success-800',
        warning: 'bg-warning-50 dark:bg-warning-900/20 border-warning-200 dark:border-warning-800',
        danger: 'bg-danger-50 dark:bg-danger-900/20 border-danger-200 dark:border-danger-800',
    };

    const iconColors = {
        default: 'text-neutral-600 dark:text-neutral-400',
        primary: 'text-primary-600 dark:text-primary-400',
        success: 'text-success-600 dark:text-success-400',
        warning: 'text-warning-600 dark:text-warning-400',
        danger: 'text-danger-600 dark:text-danger-400',
    };

    const trendColors = {
        up: 'text-success-600 dark:text-success-400',
        down: 'text-danger-600 dark:text-danger-400',
        neutral: 'text-neutral-600 dark:text-neutral-400',
    };

    return (
        <div className={`p-4 rounded-lg border ${variantStyles[variant]} transition-all duration-normal hover:shadow-md`}>
            <div className="flex items-start justify-between mb-2">
                <span className="text-small text-neutral-600 dark:text-neutral-400 font-medium">{label}</span>
                {Icon && <Icon className={`w-5 h-5 ${iconColors[variant]}`} />}
            </div>
            <div className="flex items-end justify-between">
                <div className="text-h1 font-bold text-neutral-900 dark:text-neutral-100">{value}</div>
                {change && (
                    <div className={`text-small font-semibold ${trendColors[trend]}`}>
                        {trend === 'up' && '↑ '}
                        {trend === 'down' && '↓ '}
                        {change}
                    </div>
                )}
            </div>
        </div>
    );
};
