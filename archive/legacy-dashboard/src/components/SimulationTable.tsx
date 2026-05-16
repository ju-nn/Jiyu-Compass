import React from 'react';
import { Download } from 'lucide-react';
import { formatCurrency } from '../utils/calculations';
import type { SimulationData } from '../utils/calculations';
import { safeMap, isValidArray } from '../utils/array';

interface SimulationTableProps {
    data: SimulationData[];
}

export const SimulationTable: React.FC<SimulationTableProps> = ({ data }) => {
    if (!isValidArray(data)) {
        return (
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                <p className="text-slate-500 text-center">データがありません</p>
            </div>
        );
    }

    const handleDownloadCSV = () => {
        const headers = ['年齢', '資産額', '労働・年金収入', '運用益', '生活費', '取り崩し額', 'リタイア状態'];
        const csvContent = [
            headers.join(','),
            ...safeMap(data, row => [
                row.age,
                row.assets,
                row.income,
                row.investmentReturns,
                row.expenses,
                row.withdrawal,
                row.isRetired ? 'リタイア中' : '現役'
            ].join(','))
        ].join('\n');

        const bom = new Uint8Array([0xEF, 0xBB, 0xBF]); // UTF-8 BOM for Excel compatibility
        const blob = new Blob([bom, csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'fire_simulation_plan.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                    📊 年別推移詳細
                </h3>
                <button
                    onClick={handleDownloadCSV}
                    className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-800 transition-colors"
                >
                    <Download className="w-4 h-4" />
                    CSV出力
                </button>
            </div>

            <div className="overflow-x-auto max-h-[400px]">
                <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 text-slate-500 font-medium sticky top-0 z-10">
                        <tr>
                            <th className="px-4 py-3 border-b text-center w-16">年齢</th>
                            <th className="px-4 py-3 border-b text-right">資産額</th>
                            <th className="px-4 py-3 border-b text-right text-emerald-600">収入 (労働+年金)</th>
                            <th className="px-4 py-3 border-b text-right text-blue-600">運用益</th>
                            <th className="px-4 py-3 border-b text-right text-slate-600">生活費 (インフレ込)</th>
                            <th className="px-4 py-3 border-b text-right text-red-500">取り崩し額</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {safeMap(data, (row) => (
                            <tr key={row.age} className={`hover:bg-slate-50/50 transition-colors ${row.isRetired ? 'bg-orange-50/30' : ''}`}>
                                <td className="px-4 py-3 text-center font-bold text-slate-700">{row.age}歳</td>
                                <td className="px-4 py-3 text-right font-bold text-slate-800">{formatCurrency(row.assets)}</td>
                                <td className="px-4 py-3 text-right text-emerald-600">+{formatCurrency(row.income)}</td>
                                <td className="px-4 py-3 text-right text-blue-600">+{formatCurrency(row.investmentReturns)}</td>
                                <td className="px-4 py-3 text-right text-slate-500">{formatCurrency(row.expenses)}</td>
                                <td className="px-4 py-3 text-right text-red-500 font-medium">
                                    {row.withdrawal > 0 ? `▲${formatCurrency(row.withdrawal)}` : '-'}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
