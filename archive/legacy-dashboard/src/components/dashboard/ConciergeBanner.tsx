import React from 'react';
import { Sparkles, ArrowRight, X } from 'lucide-react';
import type { ConciergeAction } from '../../utils/retention';

interface ConciergeBannerProps {
    action: ConciergeAction;
    onAction: (tab: string) => void;
    onClose: () => void;
    isVisible: boolean;
}

export const ConciergeBanner: React.FC<ConciergeBannerProps> = ({ action, onAction, onClose, isVisible }) => {
    if (!isVisible) return null;

    return (
        <div className="bg-gradient-to-r from-primary-50 to-white dark:from-primary-900/20 dark:to-neutral-900 border-b border-primary-100 dark:border-primary-800/30 animate-fade-in relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <div className="flex items-center justify-between gap-4">
                    {/* Content */}
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                        <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary-500 flex items-center justify-center shadow-md">
                            <Sparkles className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="text-tiny font-bold text-primary-600 dark:text-primary-400 uppercase tracking-wider mb-0.5">
                                おすすめアクション
                            </div>
                            <p className="text-body font-medium text-neutral-900 dark:text-neutral-100 leading-snug">
                                {action.message}
                            </p>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3 flex-shrink-0">
                        <button
                            onClick={() => onAction(action.targetTab)}
                            className="flex items-center gap-2 px-5 py-2.5 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-semibold text-small transition-all duration-normal shadow-sm hover:shadow-md"
                        >
                            {action.buttonText}
                            <ArrowRight className="w-4 h-4" />
                        </button>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors duration-fast"
                            aria-label="閉じる"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
