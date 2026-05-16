
import React, { useMemo, useState } from 'react';
import { Briefcase, TrendingUp, Clock, AlertCircle, CheckCircle, Filter, Bookmark, BookmarkCheck, Brain } from 'lucide-react';
import { jobs, jobCategories } from '../data/jobs';
import type { FireCourse, SavedJob, MbtiType } from '../types';

interface CareerPlannerProps {
    currentAge: number;
    currentAssets: number;
    annualExpenses: number;
    returnRate: number;
    monthlyPension: number;
    pensionStartAge: number;
    fireCourse: FireCourse | null;
    mbti: MbtiType | null;
    savedJobs: SavedJob[];
    onSaveJob: (job: SavedJob) => void;
    onRemoveJob: (jobId: string) => void;
}

export const CareerPlanner: React.FC<CareerPlannerProps> = ({
    currentAge,
    currentAssets,
    annualExpenses,
    returnRate,
    monthlyPension,
    pensionStartAge,
    fireCourse,
    mbti,
    savedJobs,
    onSaveJob,
    onRemoveJob
}) => {

    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [sortBy, setSortBy] = useState<'score' | 'income' | 'hours'>('score');

    // 必要月収を計算
    const requiredMonthlyIncome = useMemo(() => {
        // 年間運用益
        const annualInvestmentIncome = currentAssets * (returnRate / 100);

        // 年金収入（開始年齢に達していれば）
        const annualPensionIncome = currentAge >= pensionStartAge ? monthlyPension * 12 : 0;

        // 必要な年間収入 = 支出 - 運用益 - 年金
        const needAnnualIncome = Math.max(0, annualExpenses - annualInvestmentIncome - annualPensionIncome);

        return Math.ceil(needAnnualIncome / 12 / 10000) * 10000; // 1万円単位に丸める
    }, [currentAssets, annualExpenses, returnRate, monthlyPension, pensionStartAge, currentAge]);

    // 職業をフィルター＆評価
    const evaluatedJobs = useMemo(() => {
        return jobs
            .filter(job => {
                if (selectedCategory === 'all') return true;
                return job.category === selectedCategory;
            })
            .map(job => {
                const monthlyIncome = job.hourlyWage * 4.33 * job.weeklyHoursMax; // 最大時間で働いた場合
                const monthlyIncomeMin = job.hourlyWage * 4.33 * job.weeklyHoursMin;

                // 必要月収を達成できるか
                const canMeetRequirement = monthlyIncome >= requiredMonthlyIncome;

                // 必要な週労働時間を計算
                const requiredWeeklyHours = job.hourlyWage > 0
                    ? (requiredMonthlyIncome / job.hourlyWage / 4.33)
                    : 0;

                // 適合度スコア (0-100)
                let score = 0;

                // FIREタイプとの相性 (20点)
                if (fireCourse && job.suitableFor.includes(fireCourse)) {
                    score += 20;
                }

                // MBTIとの相性 (25点)
                if (mbti && job.suitableMbti && job.suitableMbti.includes(mbti)) {
                    score += 25;
                }

                // 人気度 (15点)
                score += job.popularity * 0.15;

                // 労働時間の妥当性 (25点)
                if (requiredWeeklyHours <= 20) {
                    score += 25;
                } else if (requiredWeeklyHours <= 30) {
                    score += 15;
                } else if (requiredWeeklyHours <= 40) {
                    score += 5;
                }

                // 時給の高さ (15点)
                if (job.hourlyWage >= 2500) {
                    score += 15;
                } else if (job.hourlyWage >= 1500) {
                    score += 10;
                } else if (job.hourlyWage >= 1000) {
                    score += 5;
                }

                return {
                    ...job,
                    monthlyIncome,
                    monthlyIncomeMin,
                    canMeetRequirement,
                    requiredWeeklyHours,
                    score
                };
            })
            .sort((a, b) => {
                switch (sortBy) {
                    case 'income':
                        return b.monthlyIncome - a.monthlyIncome;
                    case 'hours':
                        return a.requiredWeeklyHours - b.requiredWeeklyHours;
                    case 'score':
                    default:
                        return b.score - a.score;
                }
            });
    }, [requiredMonthlyIncome, fireCourse, mbti, selectedCategory, sortBy]);

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-blue-50 rounded-xl">
                    <Briefcase className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-slate-800">職業プランナー</h3>
                    <p className="text-xs text-slate-500">あなたに最適な仕事を見つけよう</p>
                </div>
            </div>

            {/* 必要月収表示 */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 mb-6 border border-blue-100">
                <div className="flex items-start gap-4">
                    <div className="p-3 bg-white rounded-lg shadow-sm">
                        <TrendingUp className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                        <h4 className="text-sm font-bold text-blue-800 mb-2">セミリタイア後に必要な月収</h4>
                        <p className="text-3xl font-bold text-blue-900 mb-2">
                            {(requiredMonthlyIncome / 10000).toLocaleString()}万円
                        </p>
                        <p className="text-xs text-blue-600">
                            年間支出 {(annualExpenses / 10000).toLocaleString()}万円 - 運用益 {Math.round(currentAssets * (returnRate / 100) / 10000).toLocaleString()}万円
                            {currentAge >= pensionStartAge && ` - 年金 ${Math.round(monthlyPension * 12 / 10000).toLocaleString()} 万円`}
                        </p>
                    </div>
                </div>
            </div>

            {/* カテゴリフィルター */}
            <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                    <Filter className="w-4 h-4 text-slate-500" />
                    <span className="text-sm font-medium text-slate-700">カテゴリ</span>
                </div>
                <div className="flex flex-wrap gap-2">
                    <button
                        onClick={() => setSelectedCategory('all')}
                        className={`px - 4 py - 2 rounded - full text - sm font - medium transition - colors ${selectedCategory === 'all'
                                ? 'bg-blue-600 text-white'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            } `}
                    >
                        すべて
                    </button>
                    {Object.entries(jobCategories).map(([key, label]) => (
                        <button
                            key={key}
                            onClick={() => setSelectedCategory(key)}
                            className={`px - 4 py - 2 rounded - full text - sm font - medium transition - colors ${selectedCategory === key
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                } `}
                        >
                            {label}
                        </button>
                    ))}
                </div>
            </div>

            {/* ソート機能 */}
            <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                    <span className="text-sm font-medium text-slate-700">並び替え</span>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => setSortBy('score')}
                        className={`px - 4 py - 2 rounded - lg text - sm font - medium transition - colors ${sortBy === 'score'
                                ? 'bg-indigo-600 text-white'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            } `}
                    >
                        おすすめ順
                    </button>
                    <button
                        onClick={() => setSortBy('income')}
                        className={`px - 4 py - 2 rounded - lg text - sm font - medium transition - colors ${sortBy === 'income'
                                ? 'bg-indigo-600 text-white'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            } `}
                    >
                        収入順
                    </button>
                    <button
                        onClick={() => setSortBy('hours')}
                        className={`px - 4 py - 2 rounded - lg text - sm font - medium transition - colors ${sortBy === 'hours'
                                ? 'bg-indigo-600 text-white'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            } `}
                    >
                        労働時間順
                    </button>
                </div>
            </div>

            {/* 職業リスト */}
            <div className="space-y-4">
                {evaluatedJobs.map((job) => (
                    <div
                        key={job.id}
                        className={`border - 2 rounded - xl p - 5 transition - all ${job.canMeetRequirement
                                ? 'border-green-200 bg-green-50/30'
                                : 'border-orange-200 bg-orange-50/30'
                            } `}
                    >
                        <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <h4 className="text-lg font-bold text-slate-800">{job.name}</h4>
                                    {job.canMeetRequirement ? (
                                        <CheckCircle className="w-5 h-5 text-green-600" />
                                    ) : (
                                        <AlertCircle className="w-5 h-5 text-orange-600" />
                                    )}
                                    {mbti && job.suitableMbti && job.suitableMbti.includes(mbti) && (
                                        <div className="flex items-center gap-1 px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded-full font-bold ml-1">
                                            <Brain className="w-3 h-3" />
                                            相性◎
                                        </div>
                                    )}
                                </div>
                                <p className="text-xs text-slate-500">{jobCategories[job.category as keyof typeof jobCategories]}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-bold text-blue-600 mb-1">時給 {job.hourlyWage.toLocaleString()}円</p>
                                {job.hourlyWage > 0 && (
                                    <p className="text-xs text-slate-500 mb-2">
                                        月収 {Math.round(job.monthlyIncomeMin / 10000)}-{Math.round(job.monthlyIncome / 10000)}万円
                                    </p>
                                )}
                                <button
                                    onClick={() => {
                                        if (savedJobs.some(j => j.id === job.id)) {
                                            onRemoveJob(job.id);
                                        } else {
                                            onSaveJob({
                                                id: job.id,
                                                name: job.name,
                                                category: job.category,
                                                hourlyWage: job.hourlyWage,
                                                savedAt: new Date().toISOString()
                                            });
                                        }
                                    }}
                                    className={`p - 2 rounded - full transition - colors ${savedJobs.some(j => j.id === job.id)
                                            ? 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                                            : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                                        } `}
                                    title={savedJobs.some(j => j.id === job.id) ? "保存済み" : "保存する"}
                                >
                                    {savedJobs.some(j => j.id === job.id) ? <BookmarkCheck className="w-5 h-5" /> : <Bookmark className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        {/* 労働時間情報 */}
                        {job.hourlyWage > 0 && (
                            <div className="flex items-center gap-2 mb-3 p-3 bg-white/50 rounded-lg">
                                <Clock className="w-4 h-4 text-slate-500" />
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-slate-700">
                                        必要労働時間: 週{Math.round(job.requiredWeeklyHours)}時間
                                        <span className="text-xs text-slate-500 ml-2">
                                            （月{Math.round(job.requiredWeeklyHours * 4.33)}時間）
                                        </span>
                                    </p>
                                    {job.requiredWeeklyHours > 30 && (
                                        <p className="text-xs text-orange-600 mt-1">
                                            ⚠️ 週30時間超: セミリタイアとしては労働時間が長めです
                                        </p>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* メリット・デメリット */}
                        <div className="grid grid-cols-2 gap-3 mb-3">
                            <div>
                                <p className="text-xs font-bold text-green-700 mb-1">👍 メリット</p>
                                <ul className="text-xs text-slate-600 space-y-1">
                                    {job.pros.map((pro, i) => (
                                        <li key={i}>• {pro}</li>
                                    ))}
                                </ul>
                            </div>
                            <div>
                                <p className="text-xs font-bold text-orange-700 mb-1">⚠️ 注意点</p>
                                <ul className="text-xs text-slate-600 space-y-1">
                                    {job.cons.map((con, i) => (
                                        <li key={i}>• {con}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* 必要スキル */}
                        {job.skills.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                <span className="text-xs text-slate-500">必要スキル:</span>
                                {job.skills.map((skill, i) => (
                                    <span key={i} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        )}

                        {/* 人気度 */}
                        <div className="mt-3 pt-3 border-t border-slate-200">
                            <p className="text-xs text-slate-500">
                                {job.suitableFor.map(c => c === 'barista' ? 'Barista' : c === 'side' ? 'Side' : c === 'lean' ? 'Lean' : 'Fat').join('/')} FIREで人気度 {job.popularity}%
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
