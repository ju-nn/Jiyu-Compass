import React, { useState } from 'react';
import { X, Briefcase, Coffee, Sun, ArrowRight } from 'lucide-react';
import type { FireInputs } from '../utils/calculations';

interface QuickSetupModalProps {
    isOpen: boolean;
    onClose: () => void;
    onApply: (inputs: Partial<FireInputs>) => void;
}

type LifestyleType = 'full' | 'side' | 'barista';

export const QuickSetupModal: React.FC<QuickSetupModalProps> = ({ isOpen, onClose, onApply }) => {
    const [step, setStep] = useState(1);
    const [age, setAge] = useState<string>('');
    const [assets, setAssets] = useState<string>('');

    if (!isOpen) return null;

    const handleNext = () => {
        if (step === 1 && age && assets) {
            setStep(2);
        }
    };
    const handleSelectAndApply = (type: LifestyleType) => {
        const baseInputs: Partial<FireInputs> = {
            currentAge: Number(age),
            currentAssets: Number(assets) * 10000,
        };

        let templateInputs: Partial<FireInputs> = { ...baseInputs };

        // Template Logic
        switch (type) {
            case 'full': // 完全リタイア
                templateInputs = {
                    ...templateInputs,
                    retirementAge: Number(age),
                    postRetirementIncome: 0,
                    withdrawalRate: 4,
                };
                break;
            case 'side': // サイドFIRE (週20時間労働など)
                templateInputs = {
                    ...templateInputs,
                    retirementAge: Number(age),
                    postRetirementIncome: 120000,
                    withdrawalRate: 4,
                };
                break;
            case 'barista': // バリスタFIRE (生活費そこそこ稼ぐ)
                templateInputs = {
                    ...templateInputs,
                    retirementAge: Number(age),
                    postRetirementIncome: 200000,
                    withdrawalRate: 3.5,
                };
                break;
        }

        onApply(templateInputs);
        onClose();
        setStep(1); // Reset
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full overflow-hidden">
                {/* Header */}
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                    <h2 className="text-lg font-bold text-slate-800">かんたんFIRE診断</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6">
                    {step === 1 ? (
                        <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                            <div className="text-center mb-6">
                                <h3 className="text-xl font-bold text-slate-800 mb-2">まずは現状を教えてください</h3>
                                <p className="text-slate-500 text-sm">シミュレーションの出発点を設定します</p>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">現在の年齢 (歳)</label>
                                    <input
                                        type="number"
                                        value={age}
                                        onChange={(e) => setAge(e.target.value)}
                                        placeholder="例: 32"
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none text-lg"
                                        autoFocus
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">現在の資産額 (万円)</label>
                                    <input
                                        type="number"
                                        value={assets}
                                        onChange={(e) => setAssets(e.target.value)}
                                        placeholder="例: 2700"
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none text-lg"
                                    />
                                    <p className="text-xs text-slate-400 mt-1 text-right">※ 貯金、株式投資などの合計</p>
                                </div>
                            </div>

                            <button
                                onClick={handleNext}
                                disabled={!age || !assets}
                                className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-colors mt-4"
                            >
                                次へ進む
                                <ArrowRight className="w-5 h-5" />
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                            <div className="text-center mb-4">
                                <h3 className="text-xl font-bold text-slate-800 mb-2">理想のスタイルは？</h3>
                                <p className="text-slate-500 text-sm">あなたの目指すリタイア後の生活を選んでください</p>
                            </div>

                            <div className="grid gap-3">
                                <button
                                    onClick={() => handleSelectAndApply('full')}
                                    className="p-4 rounded-xl border-2 border-slate-100 hover:border-blue-500 hover:bg-blue-50 transition-all text-left relative overflow-hidden group"
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="p-3 rounded-lg bg-blue-100 text-blue-600">
                                            <Sun className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-800 mb-1">完全リタイア (Full FIRE)</h4>
                                            <p className="text-xs text-slate-500 leading-relaxed">
                                                働かずに資産収入だけで自由に暮らすスタイル。<br />
                                                趣味や旅行に全ての時間を使いたい方向け。
                                            </p>
                                        </div>
                                    </div>
                                </button>

                                <button
                                    onClick={() => handleSelectAndApply('side')}
                                    className="p-4 rounded-xl border-2 border-emerald-500 bg-emerald-50 ring-2 ring-emerald-200 ring-offset-2 text-left transition-all relative overflow-hidden group shadow-md"
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="p-3 rounded-lg bg-emerald-100 text-emerald-600">
                                            <Coffee className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-800 mb-1">サイドFIRE (Side FIRE)</h4>
                                            <p className="text-xs text-slate-500 leading-relaxed">
                                                資産収入 + 少労働(週2~3日)で暮らす。<br />
                                                社会との繋がりを持ちつつ、自由な時間を最大化。
                                            </p>
                                            <div className="mt-2 inline-block px-2 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded-md">
                                                人気No.1 (月12万程度の労働)
                                            </div>
                                        </div>
                                    </div>
                                </button>

                                <button
                                    onClick={() => handleSelectAndApply('barista')}
                                    className="p-4 rounded-xl border-2 border-slate-100 hover:border-orange-500 hover:bg-orange-50 transition-all text-left relative overflow-hidden group"
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="p-3 rounded-lg bg-orange-100 text-orange-600">
                                            <Briefcase className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-800 mb-1">バリスタFIRE</h4>
                                            <p className="text-xs text-slate-500 leading-relaxed">
                                                生活費の半分以上を労働で賄い、資産を減らさない。<br />
                                                雇用の安心感と資産の安心感のいいとこ取り。
                                            </p>
                                        </div>
                                    </div>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
