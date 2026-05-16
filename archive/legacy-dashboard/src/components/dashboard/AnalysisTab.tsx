import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { formatCurrency } from '../../utils/calculations';
import type { FireInputs } from '../../utils/calculations';
import type { ExpenseBreakdown, FireCourse, SavedJob } from '../../types';

interface AnalysisTabProps {
    inputs: FireInputs;
    fireNumber: number;
    grossIncome: number;
    expenseBreakdown: ExpenseBreakdown | null;
    onSwitchToSimulation: () => void;
    onOpenExpenseBreakdown: () => void;
    fireCourse: FireCourse | null;
    savedJobs: SavedJob[];
}

export const AnalysisTab: React.FC<AnalysisTabProps> = (props) => {
    const savingsRate = props.inputs.annualIncome > 0
        ? ((props.inputs.annualIncome - props.inputs.annualExpenses) / props.inputs.annualIncome) * 100
        : 0;

    const expenseData = props.expenseBreakdown ? [
        { name: '住居費', value: props.expenseBreakdown.housing },
        { name: '食費', value: props.expenseBreakdown.food },
        { name: '水道光熱費', value: props.expenseBreakdown.electricity },
        { name: '通信費', value: props.expenseBreakdown.communication },
        { name: '保険', value: props.expenseBreakdown.insurance },
        { name: 'その他', value: props.expenseBreakdown.other },
    ].filter(item => item.value > 0) : [];

    const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#64748b'];

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-bold text-slate-500">貯蓄率</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-baseline gap-2">
                            <span className="text-3xl font-black text-emerald-600">{savingsRate.toFixed(1)}</span>
                            <span className="text-sm font-bold text-slate-400">%</span>
                        </div>
                        <p className="text-xs text-slate-500 mt-2">
                            {savingsRate >= 50 ? '卓越した貯蓄習慣です！' : savingsRate >= 20 ? '良好なペースです。' : '少しずつ改善しましょう。'}
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-bold text-slate-500">FIREコース</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-xl font-bold text-slate-800">
                            {props.fireCourse ? props.fireCourse.toUpperCase() : '未設定'}
                        </div>
                        <p className="text-xs text-slate-500 mt-2">
                            現在の戦略に合わせた目標設定がなされています。
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-bold text-slate-500">年収比率(ネット/グロス)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-xl font-bold text-slate-800">
                            {props.grossIncome > 0 ? (props.inputs.annualIncome / props.grossIncome * 100).toFixed(1) : '-'}%
                        </div>
                        <p className="text-xs text-slate-500 mt-2">
                            額面年収: {formatCurrency(props.grossIncome)}
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>支出の内訳</CardTitle>
                        <button
                            onClick={props.onOpenExpenseBreakdown}
                            className="text-xs text-indigo-600 font-bold hover:underline"
                        >
                            詳細を編集
                        </button>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[250px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={expenseData}
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {expenseData.map((_entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <RechartsTooltip formatter={(value) => formatCurrency(value as number)} />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>FIRE達成へのアドバイス</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100 italic text-sm text-slate-700">
                            " {savingsRate >= 30 ? '今のペースを維持すれば、目標は十分に射程圏内です。投資のボラティリティに備え、生活防衛資金を確保しておきましょう。' : 'まずは固定費の見直しから始め、貯蓄率を5%引き上げることを目指しましょう。'} "
                        </div>
                        <div className="space-y-2">
                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">チェックポイント</h4>
                            <ul className="text-sm space-y-1">
                                <li className="flex items-center gap-2">✅ 生活費のインフレ率を2%で見込んでいますか？</li>
                                <li className="flex items-center gap-2">✅ NISAの枠を最大限活用する設定になっていますか？</li>
                                <li className="flex items-center gap-2">✅ サイドFIREの場合、想定年収は現実的ですか？</li>
                            </ul>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};
