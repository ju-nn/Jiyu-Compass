import React from 'react';
import { BookOpen, CheckCircle2, ExternalLink, Sparkles } from 'lucide-react';
import { Card, CardContent } from '../ui/Card';
import { RECOMMENDED_BOOKS } from '../../config/monetization';
import type { FireCourse } from '../../types';

interface BooksTabProps {
    fireCourse: FireCourse | null;
    completedLearningCount: number;
    compact?: boolean;
}

const COURSE_LABELS: Record<FireCourse, string> = {
    lean: 'Lean FIRE',
    side: 'Side FIRE',
    barista: 'Barista FIRE',
    fat: 'Fat FIRE',
};

export const BooksTab: React.FC<BooksTabProps> = ({ fireCourse, completedLearningCount, compact = false }) => {
    const matchedBooks = fireCourse
        ? RECOMMENDED_BOOKS.filter((book) => book.fitFor.includes(fireCourse))
        : RECOMMENDED_BOOKS.slice(0, 4);
    const fallbackBooks = RECOMMENDED_BOOKS.filter((book) => !matchedBooks.some((matched) => matched.id === book.id));
    const personalizedBooks = [...matchedBooks, ...fallbackBooks].slice(0, compact ? 2 : 4);
    const learningTone = completedLearningCount >= 3
        ? '基礎学習が進んでいるので、投資方針と人生設計を深める本を優先しています。'
        : 'まずは家計・投資・FIREの全体像をつかめる本を中心にしています。';

    return (
        <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 mb-8 shadow-sm">
                <div className="flex items-start gap-4">
                    <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-xl">
                        <BookOpen className="w-6 h-6 text-blue-500" />
                    </div>
                    <div className="space-y-3">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 text-xs font-bold">
                            <Sparkles className="w-3.5 h-3.5" />
                            {fireCourse ? `${COURSE_LABELS[fireCourse]}のあなた向け` : '今の入力からおすすめ'}
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">
                            次に読むと効く書籍
                        </h3>
                        <p className="text-sm text-slate-600 dark:text-slate-300">
                            {learningTone} Amazonリンクはアソシエイトタグ付きなので、購入されると開発継続の応援になります。
                        </p>
                    </div>
                </div>
            </div>

            <div className={`grid grid-cols-1 ${compact ? '' : 'md:grid-cols-2'} gap-6`}>
                {personalizedBooks.map((book, index) => (
                    <Card key={book.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 group">
                        <CardContent className="p-0 flex h-full min-h-[240px]">
                            <div className="w-1/3 min-w-[112px] bg-slate-50 dark:bg-slate-800/50 p-4 flex items-center justify-center border-r border-slate-100 dark:border-slate-800">
                                <img
                                    src={book.imageUrl}
                                    alt={book.title}
                                    className="max-h-40 object-contain shadow-md rounded-sm group-hover:scale-105 transition-transform duration-300"
                                />
                            </div>

                            <div className="w-2/3 p-5 flex flex-col">
                                <div className="flex justify-between items-start gap-2 mb-2">
                                    <span className="text-xs font-bold px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-md">
                                        {book.category}
                                    </span>
                                    {index === 0 && (
                                        <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                                            <CheckCircle2 className="w-3.5 h-3.5" />
                                            最優先
                                        </span>
                                    )}
                                </div>
                                <h4 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-1 leading-tight line-clamp-2">
                                    {book.title}
                                </h4>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mb-3 line-clamp-1">
                                    {book.author}
                                </p>
                                <p className="text-sm text-slate-600 dark:text-slate-300 mb-4 flex-grow line-clamp-3">
                                    {book.description}
                                </p>
                                <p className="text-xs text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-900/40 rounded-lg px-3 py-2 mb-4">
                                    {book.reason}
                                </p>

                                <a
                                    href={book.amazonUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="mt-auto inline-flex items-center justify-center gap-2 w-full px-4 py-2 bg-[#ff9900] hover:bg-[#ff9900]/90 text-white text-sm font-bold rounded-lg transition-colors shadow-sm"
                                >
                                    Amazonで見る
                                    <ExternalLink className="w-4 h-4" />
                                </a>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <p className="text-xs text-slate-400 text-center mt-8">
                ※当サイトはAmazonアソシエイトとして、適格販売により収入を得ています。
            </p>
        </div>
    );
};
