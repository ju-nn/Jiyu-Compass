import React, { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, X } from 'lucide-react';
import { ScenarioManager } from '../utils/scenarioManager';
import { simulateAssetGrowth } from '../utils/calculations';

interface ScenarioComparisonProps {
    isOpen: boolean;
    onClose: () => void;
    currentScenarioName?: string;
}

const COLORS = [
    '#3b82f6', // blue
    '#10b981', // green
    '#f59e0b', // amber
    '#ef4444', // red
    '#8b5cf6', // purple
    '#ec4899', // pink
];

export const ScenarioComparison: React.FC<ScenarioComparisonProps> = ({
    isOpen,
    onClose,
    currentScenarioName: _currentScenarioName = '現在のシナリオ'
}) => {
    const [selectedScenarios, setSelectedScenarios] = useState<string[]>([]);
    const scenarios = ScenarioManager.getScenarios();

    const toggleScenario = (id: string) => {
        setSelectedScenarios(prev =>
            prev.includes(id)
                ? prev.filter(s => s !== id)
                : prev.length < 5 ? [...prev, id] : prev
        );
    };

    const comparisonData = useMemo(() => {
        if (selectedScenarios.length === 0) return [];

        const selectedScenarioData = scenarios.filter(s => selectedScenarios.includes(s.id));

        // Get simulation data for each scenario
        const simulations = selectedScenarioData.map(scenario => ({
            name: scenario.name,
            data: simulateAssetGrowth(scenario.inputs, false)
        }));

        // Find max age across all scenarios
        const maxAge = Math.max(...simulations.map(s => s.data[s.data.length - 1]?.age || 0));

        // Create combined data points
        const combinedData: any[] = [];
        for (let age = simulations[0]?.data[0]?.age || 0; age <= maxAge; age++) {
            const dataPoint: any = { age };
            simulations.forEach(sim => {
                const point = sim.data.find(d => d.age === age);
                dataPoint[sim.name] = point ? point.assets / 10000 : null;
            });
            combinedData.push(dataPoint);
        }

        return combinedData;
    }, [selectedScenarios, scenarios]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden border border-gray-200 dark:border-gray-700">

                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
                    <div className="flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">シナリオ比較</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
                    {/* Scenario Selection */}
                    <div className="mb-6">
                        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                            比較するシナリオを選択 (最大5つ)
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                            {scenarios.map((scenario) => (
                                <button
                                    key={scenario.id}
                                    onClick={() => toggleScenario(scenario.id)}
                                    disabled={!selectedScenarios.includes(scenario.id) && selectedScenarios.length >= 5}
                                    className={`p-3 rounded-lg border-2 transition-all text-left ${selectedScenarios.includes(scenario.id)
                                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                                        } ${!selectedScenarios.includes(scenario.id) && selectedScenarios.length >= 5
                                            ? 'opacity-50 cursor-not-allowed'
                                            : ''
                                        }`}
                                >
                                    <div className="flex items-center gap-2">
                                        <div
                                            className="w-3 h-3 rounded-full"
                                            style={{
                                                backgroundColor: selectedScenarios.includes(scenario.id)
                                                    ? COLORS[selectedScenarios.indexOf(scenario.id)]
                                                    : '#d1d5db'
                                            }}
                                        />
                                        <div className="flex-1 min-w-0">
                                            <div className="font-medium text-gray-900 dark:text-gray-100 truncate">
                                                {scenario.name}
                                            </div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400">
                                                {new Date(scenario.updatedAt).toLocaleDateString()}
                                            </div>
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                        {scenarios.length === 0 && (
                            <div className="text-center py-8 text-gray-400 dark:text-gray-500 text-sm">
                                保存されたシナリオがありません。<br />
                                シナリオ管理から現在の設定を保存してください。
                            </div>
                        )}
                    </div>

                    {/* Comparison Chart */}
                    {selectedScenarios.length > 0 && (
                        <div className="bg-white dark:bg-gray-750 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
                                資産推移の比較
                            </h3>
                            <ResponsiveContainer width="100%" height={400}>
                                <LineChart data={comparisonData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                    <XAxis
                                        dataKey="age"
                                        label={{ value: '年齢', position: 'insideBottom', offset: -5 }}
                                        stroke="#6b7280"
                                    />
                                    <YAxis
                                        label={{ value: '資産 (万円)', angle: -90, position: 'insideLeft' }}
                                        stroke="#6b7280"
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: '#fff',
                                            border: '1px solid #e5e7eb',
                                            borderRadius: '8px'
                                        }}
                                        formatter={(value: any) => `${Math.round(value).toLocaleString()}万円`}
                                    />
                                    <Legend />
                                    {selectedScenarios.map((scenarioId, index) => {
                                        const scenario = scenarios.find(s => s.id === scenarioId);
                                        return (
                                            <Line
                                                key={scenarioId}
                                                type="monotone"
                                                dataKey={scenario?.name}
                                                stroke={COLORS[index]}
                                                strokeWidth={2}
                                                dot={false}
                                                activeDot={{ r: 6 }}
                                            />
                                        );
                                    })}
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    )}

                    {selectedScenarios.length === 0 && (
                        <div className="text-center py-12 text-gray-400 dark:text-gray-500">
                            シナリオを選択してください
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
