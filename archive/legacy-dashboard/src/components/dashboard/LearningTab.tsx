import React, { useMemo } from 'react';
import { BookOpen, CheckCircle2, Play, Trophy, Target } from 'lucide-react';
import { Card, CardContent } from '../ui/Card';

interface LearningModule {
    id: string;
    title: string;
    description: string;
    duration: string;
    category: string;
}

const MODULES: LearningModule[] = [
    { id: 'fire-basics', title: 'FIREの基本概念', description: '4%ルールと資産運用の基礎を学びます。', duration: '5分', category: '基礎' },
    { id: 'tax-savings', title: '節税と社会保険', description: '日本の税制を理解し、手取りを最大化します。', duration: '10分', category: '節約' },
    { id: 'index-investing', title: 'インデックス投資の真髄', description: '長期・分散・低コストな投資手法の解説。', duration: '8分', category: '投資' },
    { id: 'side-hustle', title: '副業と事業所得', description: '給与以外の所得を作り、FIREを加速させます。', duration: '12分', category: '稼ぐ' },
];

interface LearningTabProps {
    completedIds: string[];
    onComplete: (id: string) => void;
}

export const LearningTab: React.FC<LearningTabProps> = ({ completedIds, onComplete }) => {
    const progress = useMemo(() => {
        const total = MODULES.length;
        const completed = completedIds.length;
        const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
        return { total, completed, percentage };
    }, [completedIds]);

    return (
        <div className="space-y-6">
            {/* Progress Header */}
            <Card variant="elevated" className="bg-gradient-to-br from-primary-50 to-white dark:from-primary-900/20 dark:to-neutral-900">
                <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-primary-500 rounded-xl">
                                <Trophy className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h3 className="text-h3 text-neutral-900 dark:text-neutral-100">学習進捗</h3>
                                <p className="text-small text-neutral-600 dark:text-neutral-400">
                                    {progress.completed} / {progress.total} モジュール完了
                                </p>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-display text-primary-600 dark:text-primary-400">
                                {progress.percentage}%
                            </div>
                            <div className="text-tiny text-neutral-500 dark:text-neutral-400 flex items-center gap-1">
                                <Target className="w-3 h-3" />
                                目標達成度
                            </div>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="relative w-full h-2 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden">
                        <div
                            className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary-500 to-primary-600 transition-all duration-slow"
                            style={{ width: `${progress.percentage}%` }}
                        />
                    </div>

                    {/* Completion Message */}
                    {progress.percentage === 100 && (
                        <div className="mt-4 p-3 bg-success-50 dark:bg-success-900/20 border border-success-200 dark:border-success-800 rounded-lg text-center">
                            <p className="text-small font-semibold text-success-700 dark:text-success-400 flex items-center justify-center gap-2">
                                <CheckCircle2 className="w-4 h-4" />
                                おめでとうございます！全モジュールを完了しました！
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Learning Modules */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {MODULES.map((module) => {
                    const isCompleted = completedIds.includes(module.id);
                    return (
                        <Card
                            key={module.id}
                            hover={!isCompleted}
                            className={`
                                ${isCompleted
                                    ? 'border-2 border-success-200 dark:border-success-800 bg-success-50/30 dark:bg-success-900/10'
                                    : 'border border-neutral-200 dark:border-neutral-700'
                                }
                            `}
                        >
                            <CardContent className="p-5">
                                <div className="flex justify-between items-start mb-4">
                                    <div className={`p-2 rounded-lg transition-all duration-normal
                                        ${isCompleted
                                            ? 'bg-success-100 dark:bg-success-900/50 text-success-600 dark:text-success-400'
                                            : 'bg-neutral-100 dark:bg-neutral-700 text-neutral-500 dark:text-neutral-400'
                                        }`}>
                                        <BookOpen className="w-5 h-5" />
                                    </div>
                                    <span className="text-tiny font-semibold px-2 py-1 bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 rounded-md">
                                        {module.duration}
                                    </span>
                                </div>
                                <h4 className="text-h3 text-neutral-900 dark:text-neutral-100 mb-1">{module.title}</h4>
                                <p className="text-small text-neutral-600 dark:text-neutral-400 mb-4">{module.description}</p>
                                <div className="flex justify-between items-center">
                                    <span className="text-tiny font-bold text-primary-600 dark:text-primary-400 uppercase tracking-wider">{module.category}</span>
                                    <button
                                        onClick={() => onComplete(module.id)}
                                        className={`
                                            flex items-center gap-2 px-4 py-2 rounded-lg text-small font-semibold 
                                            transition-all duration-normal
                                            ${isCompleted
                                                ? 'bg-success-100 dark:bg-success-900/50 text-success-700 dark:text-success-300'
                                                : 'bg-primary-500 hover:bg-primary-600 text-white shadow-sm hover:shadow-md'
                                            }
                                        `}
                                    >
                                        {isCompleted ? (
                                            <><CheckCircle2 className="w-4 h-4" /> 完了済み</>
                                        ) : (
                                            <><Play className="w-4 h-4" /> 学習を始める</>
                                        )}
                                    </button>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
};
