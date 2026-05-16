import React, { useMemo } from 'react';
import { BENCHMARK_DATA } from '../utils/benchmarks';
import { formatCurrency } from '../utils/calculations';
import { ComparisonChart } from './ComparisonChart';
import { Card } from './ui/Card';

interface AdviceSectionProps {
    age: number;
    assets: number;
    fireGoal: number;
    income: number;
    savings: number;
    expenses: number;
}

export const AdviceSection: React.FC<AdviceSectionProps> = ({
    age, assets, fireGoal,
    income, savings, expenses
}) => {
    // Find closest benchmark
    const ageGroup = Math.floor(age / 10) * 10;
    const benchmarkKey = `${ageGroup}s`;
    const benchmark = BENCHMARK_DATA[benchmarkKey] || BENCHMARK_DATA['20s'];

    // Character Logic with diverse comment patterns
    const coachData = useMemo(() => {
        const progress = (assets / fireGoal) * 100;
        const diffFromMedian = assets - benchmark.medianAssets;
        const savingsRate = savings > 0 ? (savings / income) * 100 : 0;
        const expenseRatio = expenses / benchmark.medianExpenses;

        // コメントパターンのバリエーション
        const getRandomComment = (patterns: string[]) => {
            return patterns[Math.floor(Math.random() * patterns.length)];
        };

        // FIRE達成済み - 伝説の勇者レベル！
        if (progress >= 100) {
            const comments = [
                '🎉 おめでとうございます！ついにFIREドラゴンを倒しました！あなたは今や伝説の勇者です。これからは「お金を使う冒険」の始まりですね。理想のライフスタイルという新たなクエストを楽しんでください！',
                '🏆 経済的自由という最終ボスを撃破！レベルMAXに到達しました！次は「何をして遊ぶか」という贅沢な悩みの時間です。人生の新しいステージを思いっきり謳歌してください！',
                '👑 FIRE王国の住民になりました！資産の取り崩しという新しいスキルを覚える時です。焦らず計画的に、インフレモンスターにも気をつけながら進みましょう。'
            ];
            return {
                mood: 'celebrate',
                icon: '👑',
                bg: 'bg-yellow-50',
                border: 'border-yellow-200',
                text: 'text-yellow-900',
                title: '🎊 伝説の勇者誕生！',
                message: getRandomComment(comments),
                tips: [
                    { icon: '🏆', text: `FIRE達成率: ${progress.toFixed(0)}% - 完全制覇！`, highlight: true },
                    { icon: '🎯', text: '新クエスト: 取り崩し戦略マスター' }
                ]
            };
        }

        // ゴール目前（80%以上） - ラスボス戦直前！
        if (progress >= 80) {
            const comments = [
                '🔥 ラスボス戦まであと少し！HPもMPも十分です。市場変動という雑魚モンスターに惑わされず、今のペースで最終決戦に挑みましょう！',
                '⚔️ あと一歩でFIREドラゴンとの決戦です！この段階では「守りの戦術」が重要。防御力を上げて、安定性重視の装備に変更することも検討してください。',
                '🏃‍♂️ ゴールが見えてきました！焦りは禁物、でも確実に前進あるのみ。最後まで積立という魔法を唱え続けることで、複利の力を最大化できます！'
            ];
            return {
                mood: 'happy',
                icon: '🔥',
                bg: 'bg-blue-50',
                border: 'border-blue-200',
                text: 'text-blue-900',
                title: '🎯 ラスボス戦直前！',
                message: getRandomComment(comments),
                tips: [
                    { icon: '🎯', text: `ラスボスまで: ${formatCurrency(fireGoal - assets)}`, highlight: true },
                    { icon: '📈', text: `攻略進捗: ${progress.toFixed(1)}%` }
                ]
            };
        }

        // 順調（中央値より500万以上多い） - 上級冒険者レベル！
        if (diffFromMedian > 5000000) {
            const comments = [
                `🚀 すごいじゃないですか！同年代の平均より${formatCurrency(diffFromMedian)}も多く資産をゲットしています。この調子で複利という最強魔法を使い続けましょう！レベルアップが止まりません！`,
                `⭐ 素晴らしい冒険ペースです！同年代のプレイヤーを大きく引き離しています。この入金力（攻撃力）を維持できれば、早期FIRE達成というレアエンディングも夢じゃありません！`,
                `🎮 完璧な資産形成プレイです！貯蓄スキルが完全に身についていますね。このまま継続すれば、想定よりも早くクリアできちゃうかもしれません。チートレベルです！`
            ];

            const tips = [];
            if (savingsRate >= 30) {
                tips.push({ icon: '💪', text: `貯蓄率${savingsRate.toFixed(0)}% - 攻撃力MAX！`, highlight: true });
            }
            if (expenseRatio < 0.8) {
                tips.push({ icon: '🛡️', text: '同年代より低支出 - 防御力も完璧！' });
            }
            tips.push({ icon: '📊', text: `平均より+${formatCurrency(diffFromMedian)} - 大幅リード中！` });

            return {
                mood: 'confident',
                icon: '🚀',
                bg: 'bg-emerald-50',
                border: 'border-emerald-200',
                text: 'text-emerald-900',
                title: '🌟 上級冒険者レベル！',
                message: getRandomComment(comments),
                tips
            };
        }

        // やや遅れ気味（中央値より200万以上少ない） - 冒険開始！
        if (diffFromMedian < -2000000) {
            const comments = [
                '🌱 冒険はここから始まります！まずは支出という敵を倒して「種銭」をゲットしましょう。固定費削減は序盤の最強スキルです。家計の「内訳」をチェックしてみませんか？',
                '🎯 資産形成という壮大な冒険のスタート地点です！まずは月1万円からでも積立魔法を覚えましょう。小さな一歩が大きな変化を生む、それがRPGの鉄則です！',
                '💪 焦る必要なんてありません！大切なのは「今日から冒険を始めること」。過去は変えられませんが、未来は今の行動で作れます。一緒に頑張りましょう！'
            ];

            const tips = [];
            if (savingsRate < 10) {
                tips.push({ icon: '💡', text: '初期クエスト: 貯蓄率10%達成を目指そう！', highlight: true });
            }
            if (expenseRatio > 1.2) {
                tips.push({ icon: '⚠️', text: '支出モンスターが強め、討伐の余地あり！' });
            }
            tips.push({ icon: '🎯', text: 'まずは固定費ボスから攻略しよう' });

            return {
                mood: 'worried',
                icon: '🌱',
                bg: 'bg-orange-50',
                border: 'border-orange-200',
                text: 'text-orange-900',
                title: '🚀 冒険スタート！',
                message: getRandomComment(comments),
                tips
            };
        }

        // 平均的（デフォルト） - 堅実な冒険者
        const comments = [
            '🏃‍♂️ 資産形成はマラソンRPGです！焦らず、でも確実に毎月の積立魔法を唱え続けることが最強の攻略法ですよ。経験値は着実に貯まっています！',
            '📈 順調にレベルアップ中です！この調子で継続すれば、複利という伝説の魔法効果が徐々に実感できるようになります。',
            '⭐ 良いペースで冒険してますね！「継続は力なり」はRPGの基本中の基本。毎月コツコツ経験値を積むことで、着実にゴールに近づいています！',
            '🛡️ 堅実な資産形成プレイができています。市場変動という雑魚モンスターに一喜一憂せず、長期目線で淡々と進みましょう。それが勇者の道です！'
        ];

        const tips = [];
        if (savingsRate >= 20) {
            tips.push({ icon: '👏', text: `貯蓄率${savingsRate.toFixed(0)}% - 良いペース！`, highlight: true });
        }
        if (expenseRatio < 1.0) {
            tips.push({ icon: '✨', text: '支出管理スキルが素晴らしい！' });
        }
        if (savingsRate >= 30) {
            tips.push({ icon: '🚀', text: '高い入金力で複利効果を最大化中！' });
        }
        if (tips.length === 0) {
            tips.push({ icon: '💪', text: '継続は力なり、このペースをキープ！' });
        }

        return {
            mood: 'neutral',
            icon: '🎮',
            bg: 'bg-slate-50',
            border: 'border-slate-200',
            text: 'text-slate-900',
            title: '🎯 堅実な冒険者',
            message: getRandomComment(comments),
            tips
        };
    }, [assets, fireGoal, benchmark, savings, income, expenses]);

    return (
        <Card 
            className={`border-2 ${coachData.bg} ${coachData.border} ${coachData.text} relative overflow-hidden group`}
            hover={true}
            padding="md"
        >

            <div className="flex gap-5 md:gap-4 items-start relative z-10">
                <div className="flex-shrink-0 relative">
                    <div className="w-20 h-20 md:w-16 md:h-16 bg-white rounded-full flex items-center justify-center text-5xl md:text-4xl shadow-lg border-4 border-white transform transition-transform group-hover:scale-110 duration-300">
                        {coachData.icon}
                        {/* Emotion Badge */}
                        {coachData.mood === 'worried' && <div className="absolute -top-1 -right-1 text-2xl md:text-xl animate-bounce">💦</div>}
                        {coachData.mood === 'celebrate' && <div className="absolute -top-1 -right-1 text-2xl md:text-xl animate-bounce">🎉</div>}
                    </div>
                </div>

                <div className="flex-1 pt-1 min-w-0">
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl rounded-tl-none p-5 md:p-4 shadow-sm border border-white/50 relative">
                        <h3 className="text-lg md:text-base font-bold mb-2 flex items-center gap-2">
                            {coachData.title}
                        </h3>
                        <p className="text-sm md:text-xs opacity-90 leading-relaxed font-medium mb-4">
                            {coachData.message}
                        </p>

                        {/* Tips Section (統合された改善ポイント) */}
                        {coachData.tips && coachData.tips.length > 0 && (
                            <div className="mb-4 space-y-2 md:space-y-1.5">
                                {coachData.tips.map((tip, idx) => (
                                    <div
                                        key={idx}
                                        className={`flex items-center gap-2 text-sm md:text-xs font-medium ${tip.highlight ? 'bg-white/60 px-3 py-2 md:py-1.5 rounded-lg' : ''
                                            }`}
                                    >
                                        <span className="text-base md:text-sm">{tip.icon}</span>
                                        <span className={tip.highlight ? 'font-bold' : ''}>{tip.text}</span>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Integrated Analysis Chart */}
                        <div className="mt-4 pt-4 border-t border-slate-100/50">
                            <div className="flex items-center gap-2 mb-3">
                                <span className="text-xl md:text-lg">📊</span>
                                <span className="font-bold text-sm md:text-xs opacity-70">同年代と比較分析</span>
                            </div>
                            <div className="bg-white rounded-xl p-2 border border-slate-100 shadow-inner">
                                <ComparisonChart
                                    age={age}
                                    assets={assets}
                                    income={income}
                                    savings={savings}
                                    expenses={expenses}
                                    compact={true}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    );
};
