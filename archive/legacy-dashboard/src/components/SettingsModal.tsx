import React from 'react';
import { Modal, ModalBody } from './ui/Modal';
import { Button } from './ui/Button';
import { ManYenInput } from './ManYenInput';
import { CreditCard, TrendingUp, ShieldCheck } from 'lucide-react';
import type { FireInputs } from '../utils/calculations';

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    inputs: FireInputs;
    handleInputChange: (key: keyof FireInputs, value: number | string) => void;
    portfolioType: 'sp500' | 'all_country' | 'custom';
    setPortfolioType: (val: 'sp500' | 'all_country' | 'custom') => void;
    useNisa: boolean;
    setUseNisa: (val: boolean) => void;
    onRediagnose?: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
    isOpen,
    onClose,
    inputs,
    handleInputChange,
    portfolioType,
    setPortfolioType,
    useNisa,
    setUseNisa,
    onRediagnose
}) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title="⚙️ 詳細設定" size="lg">
            <ModalBody>
                <div className="space-y-8 py-4">
                    {/* Investment Strategy */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 font-bold text-slate-800 border-b pb-2">
                            <TrendingUp className="w-5 h-5 text-blue-500" />
                            <h3>運用・投資設定</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-600">利回り（年率％）</label>
                                <ManYenInput
                                    label="利回り（年率％）"
                                    value={inputs.investmentReturnRate}
                                    onChange={(val) => handleInputChange('investmentReturnRate', val)}
                                    unit="%"
                                    step={0.1}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-600">資産取り崩し率（％）</label>
                                <ManYenInput
                                    label="資産取り崩し率（％）"
                                    value={inputs.withdrawalRate}
                                    onChange={(val) => handleInputChange('withdrawalRate', val)}
                                    unit="%"
                                    step={0.1}
                                />
                            </div>
                        </div>

                        <div className="space-y-3 pt-2">
                            <label className="text-sm font-medium text-slate-600 block">ポートフォリオ・プリセット</label>
                            <div className="grid grid-cols-3 gap-2">
                                {(['sp500', 'all_country', 'custom'] as const).map(type => (
                                    <button
                                        key={type}
                                        onClick={() => setPortfolioType(type)}
                                        className={`px-3 py-2 rounded-lg text-xs font-bold border transition-all ${portfolioType === type
                                            ? 'bg-blue-50 border-blue-200 text-blue-700 shadow-sm'
                                            : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                                            }`}
                                    >
                                        {type === 'sp500' ? 'S&P500' : type === 'all_country' ? 'オルカン' : 'カスタム'}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="flex items-center gap-2 p-3 bg-blue-50/50 rounded-xl border border-blue-100">
                            <input
                                type="checkbox"
                                id="useNisa"
                                checked={useNisa}
                                onChange={(e) => setUseNisa(e.target.checked)}
                                className="w-4 h-4 text-blue-600 rounded"
                            />
                            <label htmlFor="useNisa" className="text-sm font-bold text-blue-700">
                                NISAをフル活用する（非課税枠を考慮）
                            </label>
                        </div>
                    </div>

                    {/* Social Security & Inflation */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 font-bold text-slate-800 border-b pb-2">
                            <ShieldCheck className="w-5 h-5 text-emerald-500" />
                            <h3>年金・インフレ設定</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-600">インフレ率（％）</label>
                                <ManYenInput
                                    label="インフレ率（％）"
                                    value={inputs.inflationRate}
                                    onChange={(val) => handleInputChange('inflationRate', val)}
                                    unit="%"
                                    step={0.1}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-600">受取月額年金</label>
                                <ManYenInput
                                    label="受取月額年金"
                                    value={inputs.monthlyPension || 0}
                                    onChange={(val) => handleInputChange('monthlyPension', val)}
                                    unit="万円"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-600">支払中の月額年金保険料</label>
                                <ManYenInput
                                    label="支払中の月額年金保険料"
                                    value={inputs.monthlyPensionContribution || 0}
                                    onChange={(val) => handleInputChange('monthlyPensionContribution', val)}
                                    unit="万円"
                                />
                            </div>
                        </div>
                        <p className="text-xs text-slate-500">
                            年金を払っていない場合は保険料を0、将来の受取見込みも0または低めに設定できます。
                        </p>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center gap-2 font-bold text-slate-800 border-b pb-2">
                            <CreditCard className="w-5 h-5 text-amber-500" />
                            <h3>返済・ローン設定</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <ManYenInput
                                label="月額奨学金返済"
                                value={inputs.monthlyStudentLoanPayment || 0}
                                onChange={(val) => handleInputChange('monthlyStudentLoanPayment', val)}
                            />
                            <ManYenInput
                                label="奨学金完済年齢"
                                value={inputs.studentLoanEndAge || inputs.currentAge}
                                onChange={(val) => handleInputChange('studentLoanEndAge', val)}
                                unit="歳"
                                step={1}
                                min={inputs.currentAge}
                                max={100}
                            />
                            <ManYenInput
                                label="月額住宅ローン"
                                value={inputs.monthlyHousingLoanPayment || 0}
                                onChange={(val) => handleInputChange('monthlyHousingLoanPayment', val)}
                            />
                            <ManYenInput
                                label="住宅ローン完済年齢"
                                value={inputs.housingLoanEndAge || inputs.currentAge}
                                onChange={(val) => handleInputChange('housingLoanEndAge', val)}
                                unit="歳"
                                step={1}
                                min={inputs.currentAge}
                                max={100}
                            />
                            <ManYenInput
                                label="月額車ローン"
                                value={inputs.monthlyCarLoanPayment || 0}
                                onChange={(val) => handleInputChange('monthlyCarLoanPayment', val)}
                            />
                            <ManYenInput
                                label="車ローン完済年齢"
                                value={inputs.carLoanEndAge || inputs.currentAge}
                                onChange={(val) => handleInputChange('carLoanEndAge', val)}
                                unit="歳"
                                step={1}
                                min={inputs.currentAge}
                                max={100}
                            />
                        </div>
                        <p className="text-xs text-slate-500">
                            返済がない項目は月額0のままで大丈夫です。返済中だけ毎年の支出に加算されます。
                        </p>
                    </div>

                    <div className="pt-4 border-t space-y-3">
                        {onRediagnose && (
                            <Button
                                onClick={() => {
                                    onRediagnose();
                                    onClose();
                                }}
                                fullWidth
                                variant="secondary"
                                className="border-2 border-blue-200 hover:border-blue-300"
                            >
                                🔄 FIREコースを再診断する
                            </Button>
                        )}
                        <Button onClick={onClose} fullWidth variant="primary">
                            設定を適用して閉じる
                        </Button>
                    </div>
                </div>
            </ModalBody>
        </Modal>
    );
};
