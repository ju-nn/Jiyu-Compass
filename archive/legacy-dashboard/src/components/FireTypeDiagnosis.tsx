import React, { useState } from 'react';
import { User, RefreshCcw, Sparkles } from 'lucide-react';

type FireType = 'fat' | 'lean' | 'side' | 'barista' | 'coast';

interface Question {
    id: number;
    text: string;
    options: {
        text: string;
        points: { [key in FireType]?: number };
    }[];
}

const questions: Question[] = [
    {
        id: 1,
        text: "現在の仕事についてどう思いますか？",
        options: [
            { text: "完全に辞めたい。二度と働きたくない", points: { fat: 2, lean: 3 } },
            { text: "今の仕事は嫌いだが、軽い仕事なら続けたい", points: { barista: 3, side: 2 } },
            { text: "仕事自体は好きなので、自分のペースで続けたい", points: { side: 3, coast: 2 } },
        ]
    },
    {
        id: 2,
        text: "節約生活についてどう感じますか？",
        options: [
            { text: "苦にならない。ミニマリスト的な生活が好き", points: { lean: 3 } },
            { text: "ある程度は我慢できるが、たまには贅沢したい", points: { side: 2, barista: 2, coast: 1 } },
            { text: "節約は絶対イヤ。贅沢に暮らしたい", points: { fat: 3 } },
        ]
    },
    {
        id: 3,
        text: "投資や資産運用に対するスタンスは？",
        options: [
            { text: "リスクを取ってでも最速で増やしたい", points: { lean: 1, fat: 1 } },
            { text: "コツコツ積み立てて、時間をかけて増やしたい", points: { coast: 3, barista: 2 } },
            { text: "ある程度資産ができれば、あとは運用益で補いたい", points: { side: 2, coast: 2 } },
        ]
    }
];

const fireTypes: { [key in FireType]: { title: string, desc: string, icon: string, color: string } } = {
    fat: {
        title: "Fat FIRE (ファット・ファイア)",
        desc: "豊富な資産を持ち、贅沢な生活を送りながらリタイアする理想形。難易度は高いが自由度はMAX！",
        icon: "💎",
        color: "bg-purple-100 text-purple-700 border-purple-200"
    },
    lean: {
        title: "Lean FIRE (リーン・ファイア)",
        desc: "極限まで支出を削り、ミニマルな生活で早期リタイアを実現。仙人のような自由人スタイル。",
        icon: "🧘",
        color: "bg-stone-100 text-stone-700 border-stone-200"
    },
    side: {
        title: "Side FIRE (サイド・ファイア)",
        desc: "資産運用益＋副業収入で生活費を賄うハイブリッド型。好きな仕事だけを選んで生きる現代的なスタイル。",
        icon: "💻",
        color: "bg-blue-100 text-blue-700 border-blue-200"
    },
    barista: {
        title: "Barista FIRE (バリスタ・ファイア)",
        desc: "パートタイムやアルバイトで社会保険を維持しつつ、不足分を資産運用益で補うスタイル。",
        icon: "☕",
        color: "bg-amber-100 text-amber-700 border-amber-200"
    },
    coast: {
        title: "Coast FIRE (コースト・ファイア)",
        desc: "老後のための資産は確保済み。あとは日々の生活費分だけ稼げばOKという精神的余裕のある状態。",
        icon: "🏖️",
        color: "bg-teal-100 text-teal-700 border-teal-200"
    }
};

export const FireTypeDiagnosis: React.FC = () => {
    const [step, setStep] = useState(0); // 0: Start, 1-N: Questions, N+1: Result
    const [scores, setScores] = useState<{ [key in FireType]: number }>({ fat: 0, lean: 0, side: 0, barista: 0, coast: 0 });

    const handleAnswer = (points: { [key in FireType]?: number }) => {
        const newScores = { ...scores };
        (Object.keys(points) as FireType[]).forEach(type => {
            newScores[type] += points[type] || 0;
        });
        setScores(newScores);
        setStep(step + 1);
    };

    const getResult = (): FireType => {
        let maxScore = -1;
        let type: FireType = 'side'; // Default
        (Object.keys(scores) as FireType[]).forEach(t => {
            if (scores[t] > maxScore) {
                maxScore = scores[t];
                type = t;
            }
        });
        return type;
    };

    const reset = () => {
        setScores({ fat: 0, lean: 0, side: 0, barista: 0, coast: 0 });
        setStep(0);
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col items-center justify-center min-h-[300px] text-center relative overflow-hidden">
            {/* Decor */}
            <div className="absolute -top-10 -left-10 w-24 h-24 bg-blue-50 rounded-full opacity-50" />
            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-yellow-50 rounded-full opacity-50" />

            {step === 0 && (
                <div className="animate-in fade-in zoom-in duration-300">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <User className="w-8 h-8 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 mb-2">FIREタイプ診断</h3>
                    <p className="text-sm text-slate-500 mb-6 max-w-xs mx-auto">
                        あなたの性格や価値観から、最適なFIREスタイルを診断します。(全3問)
                    </p>
                    <button
                        onClick={() => setStep(1)}
                        className="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-200 hover:bg-blue-700 hover:shadow-xl transition-all flex items-center gap-2 mx-auto"
                    >
                        <Sparkles className="w-5 h-5" />
                        診断を始める
                    </button>
                </div>
            )}

            {step > 0 && step <= questions.length && (
                <div className="w-full max-w-md animate-in slide-in-from-right duration-300" key={step}>
                    <div className="flex justify-between text-xs font-bold text-slate-400 mb-4 uppercase tracking-wider">
                        <span>Question {step}</span>
                        <span>{step} / {questions.length}</span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-800 mb-6">
                        {questions[step - 1].text}
                    </h3>
                    <div className="space-y-3">
                        {questions[step - 1].options.map((opt, idx) => (
                            <button
                                key={idx}
                                onClick={() => handleAnswer(opt.points)}
                                className="w-full text-left p-4 rounded-xl border border-slate-200 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 transition-all text-sm font-medium text-slate-600"
                            >
                                {opt.text}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {step > questions.length && (
                <div className="animate-in fade-in zoom-in duration-500 w-full">
                    <p className="text-xs text-slate-400 font-bold mb-2 uppercase tracking-widest">Diagnosis Result</p>
                    {(() => {
                        const resultType = getResult();
                        const info = fireTypes[resultType];
                        return (
                            <div className={`p-6 rounded-2xl border-2 ${info.color} relative`}>
                                <div className="text-4xl mb-3">{info.icon}</div>
                                <h3 className="text-2xl font-bold mb-2">{info.title}</h3>
                                <div className="w-12 h-1 bg-current opacity-20 mx-auto my-3 rounded-full" />
                                <p className="text-sm opacity-90 leading-relaxed font-medium">
                                    {info.desc}
                                </p>
                            </div>
                        );
                    })()}

                    <button
                        onClick={reset}
                        className="mt-6 text-slate-400 hover:text-slate-600 text-sm flex items-center gap-2 mx-auto transition-colors"
                    >
                        <RefreshCcw className="w-4 h-4" />
                        もう一度診断する
                    </button>
                </div>
            )}
        </div>
    );
};
