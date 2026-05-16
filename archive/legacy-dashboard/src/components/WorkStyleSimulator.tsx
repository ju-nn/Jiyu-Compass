import React, { useState, useMemo } from 'react';
import { TrendingDown, Calendar, Target } from 'lucide-react';
import { ManYenInput } from './ManYenInput';
import { formatCurrency } from '../utils/calculations';
import { safeMap, safeSlice, safeLength } from '../utils/array';

interface WorkStyleSimulatorProps {
    currentAge: number;
    currentAssets: number;
    currentIncome: number;
    expenses: number;
    returnRate: number;
    fireNumber: number;
}

interface Scenario {
    age: number;
    assets: number;
}

export const WorkStyleSimulator: React.FC<WorkStyleSimulatorProps> = ({
    currentAge,
    currentAssets,
    currentIncome,
    expenses,
    returnRate,
    fireNumber
}) => {
    const [scenarioA_newIncome, setScenarioA_newIncome] = useState(3000000);
    const [scenarioB_changeYear, setScenarioB_changeYear] = useState(3);
    const [scenarioB_newIncome, setScenarioB_newIncome] = useState(4000000);

    const simulation = useMemo(() => {
        const rate = returnRate / 100;
        const maxYears = 40;

        // Scenario A: 今すぐ収入を減らす
        const scenarioA: Scenario[] = [];
        let assetsA = currentAssets;
        for (let year = 0; year <= maxYears; year++) {
            scenarioA.push({ age: currentAge + year, assets: assetsA });
            const savingsA = scenarioA_newIncome - expenses;
            if (assetsA >= fireNumber) break;
            assetsA = assetsA * (1 + rate) + savingsA;
        }

        // Scenario B: N年後に収入を減らす
        const scenarioB: Scenario[] = [];
        let assetsB = currentAssets;
        for (let year = 0; year <= maxYears; year++) {
            scenarioB.push({ age: currentAge + year, assets: assetsB });
            const incomeB = year < scenarioB_changeYear ? currentIncome : scenarioB_newIncome;
            const savingsB = incomeB - expenses;
            if (assetsB >= fireNumber) break;
            assetsB = assetsB * (1 + rate) + savingsB;
        }

        // FIRE達成年齢を計算
        const fireAgeA = scenarioA.find(s => s.assets >= fireNumber)?.age || null;
        const fireAgeB = scenarioB.find(s => s.assets >= fireNumber)?.age || null;

        return { scenarioA, scenarioB, fireAgeA, fireAgeB };
    }, [currentAge, currentAssets, currentIncome, expenses, returnRate, fireNumber, scenarioA_newIncome, scenarioB_changeYear, scenarioB_newIncome]);

    const { scenarioA, scenarioB, fireAgeA, fireAgeB } = simulation;

    // グラフ用のデータポイント（最初の20年分）
    const maxDataPoints = Math.min(20, Math.max(safeLength(scenarioA), safeLength(scenarioB)));
    const maxAssets = Math.max(
        ...safeMap(safeSlice(scenarioA, 0, maxDataPoints), s => s.assets),
        ...safeMap(safeSlice(scenarioB, 0, maxDataPoints), s => s.assets),
        fireNumber
    );

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-blue-50 rounded-xl">
                    <TrendingDown className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-slate-800">働き方変更シミュレーター</h3>
                    <p className="text-xs text-slate-500">収入を減らすタイミングを比較</p>
                </div>
            </div>

            {/* Input Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Scenario A */}
                <div className="bg-gradient-to-br from-blue-50 to-blue-50/30 rounded-xl p-5 border-2 border-blue-100">
                    <h4 className="font-bold text-blue-800 mb-1 flex items-center gap-2">
                        <span className="text-2xl">🏃</span>
                        シナリオA: 今すぐ変更
                    </h4>
                    <p className="text-xs text-blue-600 mb-4">すぐに働き方を変える場合</p>
                    <ManYenInput
                        label="変更後の年収"
                        value={scenarioA_newIncome}
                        onChange={setScenarioA_newIncome}
                    />
                </div>

                {/* Scenario B */}
                <div className="bg-gradient-to-br from-emerald-50 to-emerald-50/30 rounded-xl p-5 border-2 border-emerald-100">
                    <h4 className="font-bold text-emerald-800 mb-1 flex items-center gap-2">
                        <span className="text-2xl">🐢</span>
                        シナリオB: 将来変更
                    </h4>
                    <p className="text-xs text-emerald-600 mb-4">もう少し貯めてから変える場合</p>
                    <div className="space-y-3">
                        <ManYenInput
                            label="何年後に変更？"
                            value={scenarioB_changeYear}
                            onChange={setScenarioB_changeYear}
                            unit="年後"
                            max={20}
                        />
                        <ManYenInput
                            label="変更後の年収"
                            value={scenarioB_newIncome}
                            onChange={setScenarioB_newIncome}
                        />
                    </div>
                </div>
            </div>

            {/* Comparison Chart */}
            <div className="bg-slate-50 rounded-xl p-6 mb-6">
                <h4 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    資産推移の比較
                </h4>
                <div className="relative h-64">
                    {/* Y-axis labels */}
                    <div className="absolute left-0 top-0 bottom-0 w-16 flex flex-col justify-between text-xs text-slate-400 text-right pr-2">
                        <span>{formatCurrency(maxAssets)}</span>
                        <span>{formatCurrency(maxAssets * 0.5)}</span>
                        <span>0円</span>
                    </div>

                    {/* Chart area */}
                    <div className="ml-16 h-full relative border-l-2 border-b-2 border-slate-200">
                        {/* FIRE Goal line */}
                        <div
                            className="absolute left-0 right-0 border-t-2 border-dashed border-orange-300"
                            style={{ bottom: `${(fireNumber / maxAssets) * 100}%` }}
                        >
                            <span className="absolute -top-6 right-0 text-xs font-bold text-orange-600 bg-orange-50 px-2 py-1 rounded">
                                FIRE目標
                            </span>
                        </div>

                        {/* Scenario A Line */}
                        <svg className="absolute inset-0 w-full h-full overflow-visible">
                            <polyline
                                points={safeMap(safeSlice(scenarioA, 0, maxDataPoints), (s, i) =>
                                    `${(i / (maxDataPoints - 1)) * 100}%,${100 - (s.assets / maxAssets) * 100}%`
                                ).join(' ')}
                                fill="none"
                                stroke="#3b82f6"
                                strokeWidth="3"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>

                        {/* Scenario B Line */}
                        <svg className="absolute inset-0 w-full h-full overflow-visible">
                            <polyline
                                points={safeMap(safeSlice(scenarioB, 0, maxDataPoints), (s, i) =>
                                    `${(i / (maxDataPoints - 1)) * 100}%,${100 - (s.assets / maxAssets) * 100}%`
                                ).join(' ')}
                                fill="none"
                                stroke="#10b981"
                                strokeWidth="3"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeDasharray="8 4"
                            />
                        </svg>
                    </div>

                    {/* X-axis labels */}
                    <div className="ml-16 mt-2 flex justify-between text-xs text-slate-400">
                        <span>今</span>
                        <span>{Math.floor(maxDataPoints / 2)}年後</span>
                        <span>{maxDataPoints}年後</span>
                    </div>
                </div>

                {/* Legend */}
                <div className="flex gap-6 justify-center mt-4">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-1 bg-blue-500 rounded"></div>
                        <span className="text-xs font-medium text-slate-600">今すぐ変更</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-1 bg-emerald-500 rounded" style={{ backgroundImage: 'repeating-linear-gradient(90deg, #10b981 0, #10b981 8px, transparent 8px, transparent 12px)' }}></div>
                        <span className="text-xs font-medium text-slate-600">将来変更</span>
                    </div>
                </div>
            </div>

            {/* Results */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                    <div className="flex items-center gap-3 mb-2">
                        <Calendar className="w-5 h-5 text-blue-600" />
                        <span className="text-sm font-bold text-blue-800">シナリオA</span>
                    </div>
                    {fireAgeA ? (
                        <p className="text-2xl font-bold text-blue-900">{fireAgeA}歳で達成</p>
                    ) : (
                        <p className="text-sm text-blue-600">この条件では達成困難</p>
                    )}
                    <p className="text-xs text-blue-600 mt-1">
                        {fireAgeA ? `${fireAgeA - currentAge}年後にFIRE達成` : '収入または支出の見直しが必要'}
                    </p>
                </div>

                <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100">
                    <div className="flex items-center gap-3 mb-2">
                        <Calendar className="w-5 h-5 text-emerald-600" />
                        <span className="text-sm font-bold text-emerald-800">シナリオB</span>
                    </div>
                    {fireAgeB ? (
                        <p className="text-2xl font-bold text-emerald-900">{fireAgeB}歳で達成</p>
                    ) : (
                        <p className="text-sm text-emerald-600">この条件では達成困難</p>
                    )}
                    <p className="text-xs text-emerald-600 mt-1">
                        {fireAgeB ? `${fireAgeB - currentAge}年後にFIRE達成` : '収入または支出の見直しが必要'}
                    </p>
                </div>
            </div>

            {/* Recommendation */}
            {fireAgeA && fireAgeB && (
                <div className="mt-6 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border border-yellow-200">
                    <div className="flex items-start gap-3">
                        <span className="text-3xl">💡</span>
                        <div className="flex-1">
                            <h5 className="font-bold text-yellow-900 mb-1">おすすめ</h5>
                            {fireAgeA < fireAgeB ? (
                                <p className="text-sm text-yellow-800">
                                    <strong>今すぐ変更</strong>する方が、<strong>{fireAgeB - fireAgeA}年早く</strong>FIRE達成できます！
                                    資産が少ない今のうちに生活コストを下げることで、複利効果を最大化できます。
                                </p>
                            ) : fireAgeB < fireAgeA ? (
                                <p className="text-sm text-yellow-800">
                                    <strong>もう少し貯めてから変更</strong>する方が、<strong>{fireAgeA - fireAgeB}年早く</strong>FIRE達成できます！
                                    今の高収入で資産の土台を固めてから、自由な働き方に移行するのが賢明です。
                                </p>
                            ) : (
                                <p className="text-sm text-yellow-800">
                                    どちらのシナリオでも同じ年齢でFIRE達成できます。
                                    ライフスタイルの好みで選んでOKです！
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
