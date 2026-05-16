import React from 'react';
import { Settings, ChevronRight, ArrowRight } from 'lucide-react';
import { ManYenInput } from '../ManYenInput';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import type { FireInputs } from '../../utils/calculations';

interface InputSectionProps {
    inputs: FireInputs;
    handleInputChange: (key: keyof FireInputs, value: number | string | boolean) => void;
    achievableAge: number | null;
    grossIncome: number;
    setGrossIncome: (val: number) => void;
    setShowAdvanced: (val: boolean) => void;
    onOpenExpenseBreakdown?: () => void;
}

export const InputSection: React.FC<InputSectionProps> = ({
    inputs,
    handleInputChange,
    achievableAge,
    grossIncome,
    setGrossIncome,
    setShowAdvanced,
    onOpenExpenseBreakdown
}) => {
    // Mobile accordion state
    const [isExpanded, setIsExpanded] = React.useState(false);

    // Auto-expand on large screens (simple check on mount)
    React.useEffect(() => {
        if (window.innerWidth >= 1024) {
            setIsExpanded(true);
        }
    }, []);

    return (
        <Card className="h-fit">
            <CardHeader>
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="w-full flex items-center justify-between lg:cursor-default"
                >
                    <CardTitle className="mb-0 flex items-center gap-2">
                        <Settings className="w-5 h-5 md:w-4 md:h-4 text-slate-400" />
                        プロフィール設定
                    </CardTitle>
                    <div className="lg:hidden p-1 bg-slate-50 rounded-full text-slate-400">
                        <ChevronRight className={`w-5 h-5 transition-transform duration-300 ${isExpanded ? 'rotate-90' : ''}`} />
                    </div>
                </button>
            </CardHeader>

            <CardContent className={`space-y-6 md:space-y-4 ${isExpanded ? 'block animate-slide-in-bottom' : 'hidden lg:block'}`}>
                {/* Basic Profile */}
                <div className="space-y-4 md:space-y-3">
                    <ManYenInput
                        label="現在の年齢"
                        value={inputs.currentAge}
                        onChange={(val) => handleInputChange('currentAge', val)}
                        unit="歳"
                        step={1}
                        max={100}
                    />
                    <div>
                        <ManYenInput
                            label="引退予定年齢"
                            value={inputs.retirementAge}
                            onChange={(val) => handleInputChange('retirementAge', val)}
                            unit="歳"
                            step={1}
                            max={100}
                        />
                        {achievableAge !== null && achievableAge < 100 && (
                            <div className="mt-2 text-xs flex items-center gap-2 bg-emerald-50 text-emerald-700 px-3 py-2 rounded-lg border border-emerald-100">
                                <span>🚀 現在のペースなら <strong>{achievableAge}歳</strong> でFIRE可能</span>
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => handleInputChange('retirementAge', achievableAge)}
                                    className="ml-auto text-emerald-800 hover:text-emerald-950 underline"
                                >
                                    設定する
                                </Button>
                            </div>
                        )}
                    </div>
                </div>

                <div className="border-t border-slate-100 pt-6 md:pt-4 space-y-4 md:space-y-3">
                    <ManYenInput
                        label="現在の資産額"
                        value={inputs.currentAssets}
                        onChange={(val) => handleInputChange('currentAssets', val)}
                    />

                    <div className="p-4 bg-slate-50 rounded-xl space-y-3">
                        <ManYenInput
                            label="額面年収 (税込)"
                            value={grossIncome}
                            onChange={(val) => setGrossIncome(val)}
                        />
                        <div className="flex items-center justify-center">
                            <ArrowRight className="w-4 h-4 text-slate-400 rotate-90" />
                        </div>
                        <ManYenInput
                            label="手取り年収 (自動計算)"
                            value={inputs.annualIncome}
                            onChange={(val) => handleInputChange('annualIncome', val)}
                        />
                        <p className="text-xs text-slate-400 text-right">*社会保険料・税金を概算で控除</p>
                    </div>

                    <div className="relative">
                        <ManYenInput
                            label="年間支出"
                            value={inputs.annualExpenses}
                            onChange={(val) => handleInputChange('annualExpenses', val)}
                        />
                        {onOpenExpenseBreakdown && (
                            <Button
                                size="sm"
                                variant="secondary"
                                onClick={onOpenExpenseBreakdown}
                                className="absolute top-0 right-0 text-xs"
                            >
                                詳細内訳を入力
                            </Button>
                        )}
                    </div>
                </div>

                {/* Unified Settings Button */}
                <div className="pt-4 border-t border-slate-100">
                    <Button
                        variant="secondary"
                        fullWidth
                        onClick={() => setShowAdvanced(true)}
                        icon={<Settings className="w-4 h-4" />}
                        className="bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold border-slate-200"
                    >
                        詳細設定を変更
                    </Button>
                    <p className="text-[10px] text-slate-400 mt-2 text-center">
                        利回り・インフレ率・年金・NISA設定など
                    </p>
                </div>
            </CardContent>
        </Card>
    );
};
