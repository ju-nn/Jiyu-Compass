import React, { useState, useEffect } from 'react';
import { X, Save, Calculator, Home, Zap, Wifi, ShoppingCart, Shield, Gamepad2, CreditCard, HelpCircle } from 'lucide-react';
import { ManYenInput } from './ManYenInput';
import type { ExpenseBreakdown } from '../types';

interface ExpenseBreakdownModalProps {
    currentBreakdown: ExpenseBreakdown | null;
    currentAnnualExpenses: number;
    onSave: (breakdown: ExpenseBreakdown, newAnnualExpenses: number) => void;
    onClose: () => void;
}

const categories = [
    { key: 'housing', label: '住居費', icon: Home, desc: '家賃、住宅ローン、管理費など' },
    { key: 'electricity', label: '水道光熱費', icon: Zap, desc: '電気、ガス、水道' },
    { key: 'communication', label: '通信費', icon: Wifi, desc: 'スマホ、インターネット回線' },
    { key: 'food', label: '食費・日用品', icon: ShoppingCart, desc: '外食含む' },
    { key: 'insurance', label: '保険料', icon: Shield, desc: '生命保険、医療保険など' },
    { key: 'subscription', label: 'サブスク', icon: CreditCard, desc: '動画、音楽、ジムなど月額サービス' },
    { key: 'entertainment', label: '娯楽・交際費', icon: Gamepad2, desc: '趣味、交際、お小遣い' },
    { key: 'other', label: 'その他', icon: HelpCircle, desc: '医療費、被服費、特別費積立など' },
];

export const ExpenseBreakdownModal: React.FC<ExpenseBreakdownModalProps> = ({
    currentBreakdown,
    currentAnnualExpenses,
    onSave,
    onClose
}) => {
    const [breakdown, setBreakdown] = useState<ExpenseBreakdown>(() => {
        if (currentBreakdown) return currentBreakdown;
        // 初期値がない場合は、現在の年間支出から逆算して適当に割り振る...のは難しいので0スタート
        return {
            housing: 0,
            electricity: 0,
            communication: 0,
            food: 0,
            insurance: 0,
            subscription: 0,
            entertainment: 0,
            other: 0,
        };
    });

    const [monthlyTotal, setMonthlyTotal] = useState(0);

    useEffect(() => {
        const total = Object.values(breakdown).reduce((a, b) => a + b, 0);
        setMonthlyTotal(total);
    }, [breakdown]);

    const handleInputChange = (key: keyof ExpenseBreakdown, value: number) => {
        setBreakdown(prev => ({ ...prev, [key]: value }));
    };

    const handleSave = () => {
        // 年額換算 (詳細入力がある場合は、それが正となる)
        const newAnnualExpenses = monthlyTotal * 12;
        onSave(breakdown, newAnnualExpenses);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="bg-slate-50 border-b border-slate-100 p-4 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-slate-700 font-bold">
                        <Calculator className="w-5 h-5 text-blue-600" />
                        <span>家計詳細内訳 (月額)</span>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                        <X className="w-5 h-5 text-slate-500" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-4">
                        <div className="flex justify-between items-start mb-2">
                            <p className="text-xs text-blue-600 font-bold">現在の月額合計</p>
                            <p className="text-xs text-blue-400">現在設定中の年額: {(currentAnnualExpenses / 10000).toLocaleString()}万円</p>
                        </div>
                        <div className="flex items-baseline gap-2">
                            <span className="text-3xl font-bold text-blue-900">{(monthlyTotal / 10000).toLocaleString()}</span>
                            <span className="text-sm text-blue-700">万円 / 月</span>
                        </div>
                        <p className="text-xs text-slate-500 mt-2">
                            × 12ヶ月 = 年間 {(monthlyTotal * 12 / 10000).toLocaleString()} 万円
                        </p>
                    </div>

                    <div className="space-y-4">
                        {categories.map(cat => {
                            const Icon = cat.icon;
                            return (
                                <div key={cat.key} className="flex items-start gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                                    <div className="p-2 bg-white border border-slate-100 rounded-lg shadow-sm text-slate-500 mt-1">
                                        <Icon className="w-5 h-5" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="mb-1">
                                            <span className="text-sm font-bold text-slate-700">{cat.label}</span>
                                            <span className="text-xs text-slate-400 ml-2">{cat.desc}</span>
                                        </div>
                                        <ManYenInput
                                            value={breakdown[cat.key as keyof ExpenseBreakdown]}
                                            onChange={(val) => handleInputChange(cat.key as keyof ExpenseBreakdown, val)}
                                            label=""
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-slate-600 font-bold hover:bg-slate-200 rounded-lg transition-colors"
                    >
                        キャンセル
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-6 py-2 bg-blue-600 text-white font-bold rounded-lg shadow-md hover:bg-blue-700 transition-all flex items-center gap-2"
                    >
                        <Save className="w-4 h-4" />
                        保存して年間支出に反映
                    </button>
                </div>
            </div>
        </div>
    );
};
