import React from 'react';
import { formatCurrency } from '../../utils/calculations';

export const ExitStrategyTab: React.FC<{ currentAge: number, currentAssets: number }> = ({ currentAge, currentAssets }) => {
    return (
        <div className="p-8 bg-white rounded-xl shadow-sm border border-slate-200">
            <h2 className="text-xl font-bold mb-4">出口戦略シミュレーター (一時停止中)</h2>
            <p className="text-slate-600 mb-4">
                表示エラー修正のため、グラフ機能を一時的に無効化しています。
            </p>
            <div className="p-4 bg-blue-50 rounded-lg">
                <p>現在の資産: {formatCurrency(currentAssets)}</p>
                <p>現在の年齢: {currentAge}歳</p>
            </div>
        </div>
    );
};
