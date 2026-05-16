import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
    icon: LucideIcon;
    title: string;
    description: string;
    actionLabel?: string;
    onAction?: () => void;
    iconColor?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
    icon: Icon,
    title,
    description,
    actionLabel,
    onAction,
    iconColor = 'text-slate-400'
}) => {
    return (
        <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className={`p-6 bg-slate-50 dark:bg-slate-800 rounded-full mb-6 ${iconColor}`}>
                <Icon className="w-12 h-12" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-3 text-center">
                {title}
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 text-center max-w-md mb-6">
                {description}
            </p>
            {actionLabel && onAction && (
                <button
                    onClick={onAction}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold hover:from-blue-700 hover:to-indigo-700 transition-all-smooth hover:scale-105 shadow-lg hover:shadow-xl"
                >
                    {actionLabel}
                </button>
            )}
        </div>
    );
};
