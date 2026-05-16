import React from 'react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    ReferenceLine,
    Legend
} from 'recharts';
import type { MonteCarloResult } from '../utils/calculations';
import { formatCurrency } from '../utils/calculations';
import { isValidArray } from '../utils/array';

interface MonteCarloChartProps {
    data: MonteCarloResult[];
    fireGoal: number;
    currentAge?: number;
    pastData?: { age: number; assets: number }[];
}

const MonteCarloChart: React.FC<MonteCarloChartProps> = ({ data, fireGoal, pastData }) => {
    if (!isValidArray(data)) {
        return (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 min-h-[400px] flex items-center justify-center">
                <p className="text-slate-500">データを読み込み中...</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 min-h-[400px]">
            <h3 className="text-lg font-bold text-slate-800 mb-2 flex items-center gap-2">
                <span>🎲</span>
                <span>未来予測シミュレーション (モンテカルロ法)</span>
            </h3>
            <p className="text-sm text-slate-500 mb-6">
                市場の変動リスクを考慮した1000回のシミュレーション結果です。
                <br />
                <span className="text-emerald-600 font-bold">上位10% (楽観的)</span>、
                <span className="text-blue-600 font-bold">中央値</span>、
                <span className="text-slate-500 font-bold">下位10% (悲観的)</span> の推移を表示しています。
            </p>

            <div className="h-[250px] sm:h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <defs>
                            <linearGradient id="colorOptimistic" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.1} />
                                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="colorPessimistic" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#64748b" stopOpacity={0.1} />
                                <stop offset="95%" stopColor="#64748b" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis
                            dataKey="age"
                            label={{ value: '年齢', position: 'insideBottomRight', offset: -5 }}
                            stroke="#64748b"
                            tick={{ fill: '#64748b' }}
                        />
                        <YAxis
                            tickFormatter={(value) => `${value / 10000}万`}
                            stroke="#64748b"
                            tick={{ fill: '#64748b' }}
                        />
                        <Tooltip
                            formatter={(value: number) => formatCurrency(value)}
                            labelFormatter={(label) => `${label}歳`}
                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        />
                        <ReferenceLine y={fireGoal} stroke="#ef4444" strokeDasharray="3 3" label={{ value: '目標額', fill: '#ef4444', position: 'insideTopLeft' }} />

                        {/* Past Data Line */}
                        {isValidArray(pastData) && (
                            <Area
                                type="monotone"
                                dataKey="assets"
                                data={pastData}
                                stroke="#94a3b8"
                                strokeWidth={2}
                                strokeDasharray="3 3"
                                fill="none"
                                name="過去の推移"
                                connectNulls
                            />
                        )}

                        {/* 90th Percentile (Optimistic) */}
                        <Area
                            type="monotone"
                            dataKey="percentile90"
                            stroke="#10b981"
                            strokeWidth={2}
                            fillOpacity={1}
                            fill="url(#colorOptimistic)"
                            name="楽観的シナリオ (上位10%)"
                        />

                        {/* 50th Percentile (Median) */}
                        <Area
                            type="monotone"
                            dataKey="percentile50"
                            stroke="#3b82f6"
                            strokeWidth={3}
                            fill="none"
                            name="標準シナリオ (中央値)"
                        />

                        {/* 10th Percentile (Pessimistic) */}
                        <Area
                            type="monotone"
                            dataKey="percentile10"
                            stroke="#64748b"
                            strokeWidth={2}
                            strokeDasharray="5 5"
                            fillOpacity={1}
                            fill="url(#colorPessimistic)"
                            name="悲観的シナリオ (下位10%)"
                        />
                        <Legend />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default MonteCarloChart;
