import React, { useState, useEffect } from 'react';
import { Coffee, ArrowRight, TrendingUp } from 'lucide-react';

interface LatteFactorProps {
    investmentReturnRate: number;
}

export const LatteFactor: React.FC<LatteFactorProps> = ({ investmentReturnRate }) => {
    const [amount, setAmount] = useState<number>(500);
    const [frequency, setFrequency] = useState<'daily' | 'weekly' | 'monthly'>('daily');
    const [years, setYears] = useState<number>(10);
    const [result, setResult] = useState<number>(0);

    useEffect(() => {
        calculateSavings();
    }, [amount, frequency, years, investmentReturnRate]);

    const calculateSavings = () => {
        let monthlyContribution = 0;
        if (frequency === 'daily') {
            monthlyContribution = amount * 30;
        } else if (frequency === 'weekly') {
            monthlyContribution = amount * 4;
        } else {
            monthlyContribution = amount;
        }

        const r = investmentReturnRate / 100 / 12; // Monthly interest rate
        const n = years * 12; // Total months

        // Future Value of a Series formula: PMT * (((1 + r)^n - 1) / r)
        // We assume contribution at the END of each period for simplicity
        if (r === 0) {
            setResult(monthlyContribution * n);
        } else {
            const fv = monthlyContribution * ((Math.pow(1 + r, n) - 1) / r);
            setResult(Math.round(fv));
        }
    };

    const formatCurrency = (val: number) => {
        if (val >= 10000) {
            return `${(val / 10000).toFixed(1)}万円`;
        }
        return `${val.toLocaleString()}円`;
    };

    return (
        <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-6 rounded-2xl shadow-sm border border-orange-100">
            <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-orange-100 rounded-lg text-orange-600">
                    <Coffee size={24} />
                </div>
                <h3 className="text-lg font-bold text-gray-800">「もしこれを買わなければ」計算機</h3>
            </div>

            <p className="text-sm text-gray-600 mb-6">
                何気ない出費を投資に回していたら、将来いくらになる？<br />
                (年利 {investmentReturnRate}% で運用した場合)
            </p>

            <div className="space-y-4">
                {/* Amount Input */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">使っている金額</label>
                    <div className="relative">
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(Number(e.target.value))}
                            className="w-full p-3 pr-8 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                        />
                        <span className="absolute right-3 top-3 text-gray-500">円</span>
                    </div>
                </div>

                {/* Frequency Selector */}
                <div className="grid grid-cols-3 gap-2">
                    {([
                        { id: 'daily', label: '毎日' },
                        { id: 'weekly', label: '毎週' },
                        { id: 'monthly', label: '毎月' }
                    ] as const).map((opt) => (
                        <button
                            key={opt.id}
                            onClick={() => setFrequency(opt.id)}
                            className={`py-2 rounded-lg text-sm font-medium transition-colors ${frequency === opt.id
                                    ? 'bg-orange-500 text-white shadow-md'
                                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-orange-50'
                                }`}
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>

                {/* Years Slider */}
                <div>
                    <label className="flex justify-between text-sm font-medium text-gray-700 mb-1">
                        <span>期間</span>
                        <span className="text-orange-600 font-bold">{years}年後</span>
                    </label>
                    <input
                        type="range"
                        min="1"
                        max="50"
                        value={years}
                        onChange={(e) => setYears(Number(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
                    />
                    <div className="flex justify-between text-xs text-gray-400 mt-1">
                        <span>1年</span>
                        <span>50年</span>
                    </div>
                </div>

                {/* Result Display */}
                <div className="mt-6 pt-6 border-t border-orange-200">
                    <div className="flex items-center gap-2 text-gray-600 mb-2">
                        <span>積み立てると...</span>
                        <ArrowRight size={16} />
                    </div>
                    <div className="flex items-end gap-2 text-orange-600">
                        <TrendingUp size={32} className="mb-2" />
                        <span className="text-4xl font-bold tracking-tight">
                            {formatCurrency(result)}
                        </span>
                        <span className="text-lg font-medium mb-1 text-gray-500">になります！</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-2 text-right">
                        ※ 元本: {formatCurrency((frequency === 'daily' ? amount * 30 : frequency === 'weekly' ? amount * 4 : amount) * 12 * years)}
                    </p>
                </div>
            </div>
        </div>
    );
};
