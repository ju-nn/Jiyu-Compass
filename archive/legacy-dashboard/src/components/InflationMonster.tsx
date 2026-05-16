import React, { useState, useEffect } from 'react';
import { Ghost, ArrowRight } from 'lucide-react';

interface InflationMonsterProps {
    defaultInflationRate: number;
}

export const InflationMonster: React.FC<InflationMonsterProps> = ({ defaultInflationRate }) => {
    const [currentPrice, setCurrentPrice] = useState<number>(1000);
    const [years, setYears] = useState<number>(30);
    const [inflationRate, setInflationRate] = useState<number>(defaultInflationRate);
    const [futurePrice, setFuturePrice] = useState<number>(0);

    useEffect(() => {
        const future = currentPrice * Math.pow(1 + inflationRate / 100, years);
        setFuturePrice(Math.round(future));
    }, [currentPrice, years, inflationRate]);

    // Monster level based on price increase ratio
    const increaseRatio = futurePrice / currentPrice;

    const getMonsterInfo = () => {
        if (increaseRatio < 1.2) return {
            name: "ベビーインフレ",
            color: "text-green-500",
            bg: "bg-green-100",
            icon: <Ghost className="w-12 h-12 text-green-500" />,
            desc: "まだかわいいもの。でも油断は禁物。"
        };
        if (increaseRatio < 1.5) return {
            name: "リトルインフレ",
            color: "text-blue-500",
            bg: "bg-blue-100",
            icon: <Ghost className="w-16 h-16 text-blue-500" />,
            desc: "気づかないうちに財布の中身を食べている。"
        };
        if (increaseRatio < 2.0) return {
            name: "インフレオーガ",
            color: "text-orange-500",
            bg: "bg-orange-100",
            icon: <Ghost className="w-20 h-20 text-orange-500" />,
            desc: "かなり凶暴。現金の価値を半分近く奪うぞ！"
        };
        if (increaseRatio < 3.0) return {
            name: "キングインフレ",
            color: "text-red-500",
            bg: "bg-red-100",
            icon: <Ghost className="w-24 h-24 text-red-500" />,
            desc: "圧倒的な破壊力。対策しないと資産は消滅する..."
        };
        return {
            name: "ゴッドインフレ",
            color: "text-purple-600",
            bg: "bg-purple-100",
            icon: <Ghost className="w-32 h-32 text-purple-600 animate-bounce" />,
            desc: "絶望的なインフレ。世界は彼のものだ..."
        };
    };

    const monster = getMonsterInfo();

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="bg-slate-800 p-4 text-white flex items-center gap-2">
                <Ghost className="w-6 h-6 text-purple-400" />
                <h3 className="font-bold">インフレモンスター図鑑</h3>
            </div>

            <div className="p-6">
                <p className="text-sm text-slate-600 mb-6">
                    「現金なら安心」と思っていませんか？<br />
                    時間の経過とともに現金の価値を食べるモンスター、それがインフレです。
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Controls */}
                    <div className="space-y-6">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 mb-1">今の価格 (例: ランチ代)</label>
                            <div className="relative">
                                <input
                                    type="number"
                                    value={currentPrice}
                                    onChange={(e) => setCurrentPrice(Number(e.target.value))}
                                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                />
                                <span className="absolute right-3 top-3 text-slate-400 font-bold">円</span>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-500 mb-1">
                                経過年数: <span className="text-purple-600 text-base">{years}年後</span>
                            </label>
                            <input
                                type="range"
                                min="1"
                                max="50"
                                value={years}
                                onChange={(e) => setYears(Number(e.target.value))}
                                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-500 mb-1">
                                インフレ率 (年): <span className="text-purple-600 text-base">{inflationRate}%</span>
                            </label>
                            <input
                                type="range"
                                min="0"
                                max="10"
                                step="0.1"
                                value={inflationRate}
                                onChange={(e) => setInflationRate(Number(e.target.value))}
                                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                            />
                            <p className="text-xs text-slate-400 mt-1">※ 日本政府の目標は2.0%です</p>
                        </div>
                    </div>

                    {/* Simulation Result */}
                    <div className="bg-slate-50 rounded-xl p-6 flex flex-col items-center justify-center text-center border-2 border-dashed border-slate-200 relative">
                        <div className="absolute top-2 left-2 px-2 py-1 bg-white border border-slate-200 rounded text-xs font-bold text-slate-500">
                            モンスター出現中
                        </div>

                        <div className={`mb-4 p-6 rounded-full ${monster.bg} transition-all duration-500 transform hover:scale-110`}>
                            {monster.icon}
                        </div>

                        <h4 className={`text-xl font-extrabold ${monster.color} mb-2`}>{monster.name}</h4>
                        <p className="text-sm text-slate-600 mb-6 max-w-xs">{monster.desc}</p>

                        <div className="w-full bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xs text-slate-500">今の {currentPrice.toLocaleString()}円 は...</span>
                                <span className="text-xs text-slate-500">{years}年後</span>
                            </div>
                            <div className="flex items-center justify-center gap-3">
                                <span className="text-lg font-bold text-slate-400 line-through decoration-2 decoration-red-400">
                                    {currentPrice.toLocaleString()}円
                                </span>
                                <ArrowRight className="text-slate-300" />
                                <span className="text-3xl font-extrabold text-slate-800">
                                    {futurePrice.toLocaleString()}円
                                </span>
                            </div>
                            <div className="mt-2 text-xs font-bold text-red-500 bg-red-50 inline-block px-2 py-1 rounded">
                                +{(futurePrice - currentPrice).toLocaleString()}円 の値上げ
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
