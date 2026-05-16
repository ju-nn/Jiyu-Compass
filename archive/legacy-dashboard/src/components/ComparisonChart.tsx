import React from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    Cell
} from 'recharts';
import { getBenchmark } from '../utils/benchmarks';
import { formatCurrency } from '../utils/calculations';

interface ComparisonChartProps {
    age: number;
    assets: number; // Yen
    income: number; // Yen (Net or Gross? Usually compare Gross for benchmarks, but user inputs Net... let's assume we use what we have. If user inputs Net, we should ideally compare to Net Median, but benchmark is likely Gross. Dashboard has Gross Income now, so use that if avail, else Net.)
    savings: number; // Yen
    expenses: number; // Yen
    compact?: boolean;
}

export const ComparisonChart: React.FC<ComparisonChartProps> = ({ age, assets, income, savings, expenses, compact = false }) => {
    const benchmark = getBenchmark(age);

    if (!benchmark) return null;

    // Prepare data
    // We want to compare User vs Median
    // But Assets scale is totally different from Income/Expenses.
    // So maybe we normalize them to "percent of median" to show on one chart?
    // Or just show raw values in a Bar chart but realize bars will be tiny/huge.
    // Let's use "Percent of Median" (Where 100% = Median).

    const data = [
        {
            subject: '年収',
            user: (income / benchmark.medianIncome) * 100,
            median: 100,
            userValue: income,
            medianValue: benchmark.medianIncome,
            unit: '円'
        },
        {
            subject: '資産',
            user: (assets / benchmark.medianAssets) * 100,
            median: 100,
            userValue: assets,
            medianValue: benchmark.medianAssets,
            unit: '円'
        },
        {
            subject: '貯蓄',
            user: (savings / benchmark.medianSavings) * 100,
            median: 100,
            userValue: savings,
            medianValue: benchmark.medianSavings,
            unit: '円'
        },
        {
            subject: '支出',
            user: (expenses / benchmark.medianExpenses) * 100,
            median: 100,
            userValue: expenses,
            medianValue: benchmark.medianExpenses,
            unit: '円'
        },
    ];

    // Custom Tooltip to show actual values
    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            // payload[0] is user, payload[1] is median usually (depends on bar order)
            // But we can find them by dataKey
            const userPoint = payload.find((p: any) => p.dataKey === 'user');
            const medianPoint = payload.find((p: any) => p.dataKey === 'median');
            const userVal = userPoint?.payload.userValue;
            const medianVal = medianPoint?.payload.medianValue;

            return (
                <div className="bg-white p-3 border border-slate-200 shadow-lg rounded-lg">
                    <p className="font-bold text-slate-700 mb-2">{label}</p>
                    <div className="space-y-1 text-sm">
                        <p className="text-blue-600">
                            あなた: <span className="font-semibold">{formatCurrency(userVal)}</span>
                            <span className="text-xs text-slate-400 ml-1">
                                (中央値比: {Math.round(userPoint?.value)}%)
                            </span>
                        </p>
                        <p className="text-slate-500">
                            中央値: {formatCurrency(medianVal)}
                        </p>
                    </div>
                </div>
            );
        }
        return null;
    };

    return (
        <div className={`bg-white rounded-2xl p-6 shadow-sm border border-slate-100 ${compact ? 'border-none shadow-none p-0' : ''}`}>
            {!compact && (
                <h3 className="font-bold text-slate-700 mb-4 flex items-center gap-2">
                    <span>世間との比較（中央値比率）</span>
                    <span className="text-xs font-normal text-slate-400 bg-slate-100 px-2 py-1 rounded">100% = 同年代中央値</span>
                </h3>
            )}
            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={data}
                        layout="vertical"
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                        <XAxis type="number" domain={[0, 'auto']} hide />
                        <YAxis type="category" dataKey="subject" width={40} tick={{ fontSize: 12 }} />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Bar name="あなた" dataKey="user" fill="#3b82f6" radius={[0, 4, 4, 0]}>
                            {
                                data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.user >= 100 ? '#10b981' : '#3b82f6'} />
                                ))
                            }
                        </Bar>
                        <Bar name="同年代中央値" dataKey="median" fill="#94a3b8" radius={[0, 4, 4, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
            <p className="text-xs text-slate-400 mt-2 text-right">
                ※ 中央値を100%とした時のあなたの割合。緑色は中央値超えを表します。
            </p>

            {/* Improvement Suggestions */}
            <div className="mt-6 pt-4 border-t border-slate-100">
                <h4 className="font-bold text-slate-700 mb-3 flex items-center gap-2">
                    <span className="text-lg">💡</span> 改善ポイント
                </h4>
                <div className="space-y-3">
                    {(() => {
                        const suggestions = [];

                        // 1. High Expenses
                        if (expenses > benchmark.medianExpenses * 1.1) {
                            suggestions.push(
                                <div key="expenses" className="bg-red-50 p-3 rounded-lg border border-red-100 text-sm">
                                    <p className="font-bold text-red-700 mb-1">支出が少し多めかもしれません</p>
                                    <p className="text-red-600">
                                        同年代の中央値より支出が約{Math.round((expenses / benchmark.medianExpenses - 1) * 100)}%高いです。
                                        固定費（家賃や保険、サブスク）を見直すことで、生活満足度を下げずに改善できる可能性があります。
                                    </p>
                                </div>
                            );
                        } else if (expenses < benchmark.medianExpenses * 0.9) {
                            suggestions.push(
                                <div key="expenses-good" className="bg-emerald-50 p-3 rounded-lg border border-emerald-100 text-sm">
                                    <p className="font-bold text-emerald-700 mb-1">素晴らしい支出管理です</p>
                                    <p className="text-emerald-600">
                                        同年代よりも低い支出水準を維持できています。この調子で浮いた分を投資に回せば、FIRE達成が大きく近づきます。
                                    </p>
                                </div>
                            );
                        }

                        // 2. Savings Rate (Rough calculation: Savings / Income)
                        // If income is 0 or low, this might be skewed, but let's try.
                        if (income > 0) {
                            const savingsRate = savings / income;
                            if (savingsRate < 0.1) {
                                suggestions.push(
                                    <div key="savings" className="bg-orange-50 p-3 rounded-lg border border-orange-100 text-sm">
                                        <p className="font-bold text-orange-700 mb-1">貯蓄率をもう少し上げられそうです</p>
                                        <p className="text-orange-600">
                                            現在の貯蓄率は約{Math.round(savingsRate * 100)}%です。FIREを目指すなら、まずは20%以上を目標に「先取り貯蓄」を始めてみましょう。
                                        </p>
                                    </div>
                                );
                            } else if (savingsRate > 0.3) {
                                suggestions.push(
                                    <div key="savings-good" className="bg-blue-50 p-3 rounded-lg border border-blue-100 text-sm">
                                        <p className="font-bold text-blue-700 mb-1">高い貯蓄力を維持できています</p>
                                        <p className="text-blue-600">
                                            貯蓄率{Math.round(savingsRate * 100)}%は非常に優秀です。この入金力を維持できれば、複利効果も最大化されます。
                                        </p>
                                    </div>
                                );
                            }
                        }

                        if (suggestions.length === 0) {
                            return (
                                <p className="text-sm text-slate-500">
                                    特に大きな問題点は見当たりません。バランス良く資産形成ができています。
                                </p>
                            );
                        }
                        return suggestions;
                    })()}
                </div>
            </div>
        </div>
    );
};
