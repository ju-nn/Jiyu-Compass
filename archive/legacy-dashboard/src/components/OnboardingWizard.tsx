import React, { useState, useEffect } from 'react';
import { Plane, User, CheckCircle2, ArrowRight, Sparkles, ChevronRight, Coffee, Laptop, Bike, Palmtree } from 'lucide-react';
import type { FireInputs } from '../utils/calculations';
import { ManYenInput } from './ManYenInput';

import type { FireCourse } from '../types';

interface OnboardingWizardProps {
    initialInputs: FireInputs;
    onComplete: (inputs: FireInputs, course: FireCourse, mbti: null) => void;
}

const courses: { id: FireCourse; title: string; icon: string; desc: string; color: string }[] = [
    { id: 'side', title: 'Side FIRE コース', icon: '💻', desc: '資産収入＋好きな副業で生きる、現代の最適解。', color: 'bg-blue-50 border-blue-200 hover:border-blue-400' },
    { id: 'fat', title: 'Fat FIRE コース', icon: '💎', desc: '圧倒的な資産で、贅沢も自由も思いのままに。', color: 'bg-purple-50 border-purple-200 hover:border-purple-400' },
    { id: 'barista', title: 'Barista FIRE コース', icon: '☕', desc: '週3労働＋資産収入。社会との繋がりを保ちつつ自由に。', color: 'bg-amber-50 border-amber-200 hover:border-amber-400' },
    { id: 'lean', title: 'Lean FIRE コース', icon: '🧘', desc: 'ミニマリズムを極め、早期の完全自由を目指す。', color: 'bg-stone-50 border-stone-200 hover:border-stone-400' },
];

interface JobOption {
    id: string;
    title: string;
    income: number;
    icon: React.ElementType;
    desc: string;
}

const jobOptions: JobOption[] = [
    { id: 'barista', title: 'カフェ・店舗スタッフ', income: 80000, icon: Coffee, desc: '週3日程度、社会との接点を持ちながら。' },
    { id: 'freelance', title: '在宅・フリーランス', income: 100000, icon: Laptop, desc: 'スキルを活かして、場所を選ばずに働く。' },
    { id: 'gig', title: 'ギグワーク・軽作業', income: 50000, icon: Bike, desc: '自分の好きなタイミングで、気楽に稼ぐ。' },
    { id: 'none', title: '完全リタイア', income: 0, icon: Palmtree, desc: '労働からは卒業。自由な時間を謳歌する。' },
];

// 診断用の質問データ
interface Question {
    id: number;
    text: string;
    options: {
        text: string;
        points: { [key in FireCourse]?: number };
    }[];
}

const questions: Question[] = [
    {
        id: 1,
        text: "現在の仕事についてどう思いますか？",
        options: [
            { text: "完全に辞めたい。二度と働きたくない", points: { fat: 2, lean: 3 } },
            { text: "今の仕事は嫌いだが、軽い仕事なら続けたい", points: { barista: 3, side: 2 } },
            { text: "仕事自体は好きなので、自分のペースで続けたい", points: { side: 3 } },
        ]
    },
    {
        id: 2,
        text: "節約生活についてどう感じますか？",
        options: [
            { text: "苦にならない。ミニマリスト的な生活が好き", points: { lean: 3 } },
            { text: "ある程度は我慢できるが、たまには贅沢したい", points: { side: 2, barista: 2 } },
            { text: "節約は絶対イヤ。贅沢に暮らしたい", points: { fat: 3 } },
        ]
    },
    {
        id: 3,
        text: "投資や資産運用に対するスタンスは？",
        options: [
            { text: "リスクを取ってでも最速で増やしたい", points: { lean: 1, fat: 1 } },
            { text: "コツコツ積み立てて、時間をかけて増やしたい", points: { barista: 2, side: 1 } },
            { text: "ある程度資産ができれば、あとは運用益で補いたい", points: { side: 2 } },
        ]
    }
];

export const OnboardingWizard: React.FC<OnboardingWizardProps> = ({ initialInputs, onComplete }) => {
    // 0: Welcome, 1: Profile + Job (combined), 2: Course Selection (with diagnosis), 3: Departing
    const [step, setStep] = useState(0);
    const [inputs, setInputs] = useState<FireInputs>(initialInputs);
    const [selectedCourse, setSelectedCourse] = useState<FireCourse | null>(null);
    const [selectedJobId, setSelectedJobId] = useState<string | null>(null);

    // 診断関連のstate
    const [showDiagnosis, setShowDiagnosis] = useState(false);
    const [diagnosisStep, setDiagnosisStep] = useState(0);
    const [scores, setScores] = useState<{ [key in FireCourse]: number }>({ fat: 0, lean: 0, side: 0, barista: 0 });
    const [recommendedCourse, setRecommendedCourse] = useState<FireCourse | null>(null);

    useEffect(() => {
        setInputs(initialInputs);
        if (initialInputs.postRetirementJob) {
            const category = jobOptions.find(j => j.title === initialInputs.postRetirementJob)?.id;
            if (category) setSelectedJobId(category);
        }
    }, [initialInputs]);

    const handleInputChange = (key: keyof FireInputs, value: number | string) => {
        setInputs(prev => ({ ...prev, [key]: value }));
    };

    const handleDiagnosisAnswer = (points: { [key in FireCourse]?: number }) => {
        const newScores = { ...scores };
        (Object.keys(points) as FireCourse[]).forEach(type => {
            newScores[type] += points[type] || 0;
        });
        setScores(newScores);

        if (diagnosisStep === questions.length - 1) {
            let maxScore = -1;
            let recommended: FireCourse = 'side';
            (Object.keys(newScores) as FireCourse[]).forEach(t => {
                if (newScores[t] > maxScore) {
                    maxScore = newScores[t];
                    recommended = t;
                }
            });
            setRecommendedCourse(recommended);
            setSelectedCourse(recommended);
            setShowDiagnosis(false);
            setDiagnosisStep(0);
        } else {
            setDiagnosisStep(diagnosisStep + 1);
        }
    };

    const handleJobSelect = (job: JobOption) => {
        setSelectedJobId(job.id);
        handleInputChange('postRetirementIncome', job.income);
        handleInputChange('postRetirementJob', job.title);
    };

    const handleNext = () => {
        if (step === 2 && !selectedCourse) return;

        setStep(step + 1);

        if (step === 2) {
            setTimeout(() => {
                onComplete(inputs, selectedCourse as FireCourse, null);
            }, 2000);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-hidden relative flex flex-col">
                {/* Header / ProgressBar */}
                <div className="bg-slate-50 dark:bg-slate-900 border-b border-slate-100 dark:border-slate-700 p-4 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-bold">
                        <Plane className="w-5 h-5 text-blue-600" />
                        <span>FIRE Flight Concierge</span>
                    </div>
                    <div className="flex gap-1">
                        {[0, 1, 2, 3].map(i => (
                            <div key={i} className={`w-2 h-2 rounded-full ${i <= step ? 'bg-blue-600' : 'bg-slate-300'}`} />
                        ))}
                    </div>
                </div>

                <div className="flex-1 p-4 md:p-6 flex flex-col items-center justify-center text-center overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">

                    {/* STEP 0: WELCOME */}
                    {step === 0 && (
                        <div className="animate-in fade-in zoom-in duration-500 space-y-6 w-full max-w-md">
                            <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-blue-100">
                                <User className="w-10 h-10 text-blue-600" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">Welcome Aboard.</h2>
                                <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">
                                    FIREへの旅へようこそ。<br />
                                    機長の私が、あなたを経済的自由という目的地までご案内します。
                                </p>
                            </div>
                            <button
                                onClick={() => setStep(1)}
                                className="mt-8 px-8 py-3 bg-blue-600 text-white font-bold rounded-full shadow-lg hover:bg-blue-700 hover:shadow-xl transition-all flex items-center gap-2 mx-auto"
                            >
                                チェックインを開始する
                                <ArrowRight className="w-5 h-5" />
                            </button>
                        </div>
                    )}

                    {/* STEP 1: PROFILE + JOB (COMBINED) */}
                    {step === 1 && (
                        <div className="w-full max-w-lg animate-in slide-in-from-right duration-500 space-y-6">
                            <h2 className="text-xl font-bold text-center mb-6 text-slate-700 dark:text-slate-300">基本情報の入力</h2>

                            {/* 基本情報 */}
                            <div className="bg-white dark:bg-slate-700 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-600 space-y-4">
                                <h3 className="text-sm font-bold text-slate-600 dark:text-slate-400 mb-4">現在の状況</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <ManYenInput
                                        label="年齢"
                                        value={inputs.currentAge}
                                        onChange={(v) => handleInputChange('currentAge', v)}
                                        unit="歳"
                                        max={100}
                                        className="bg-slate-50 dark:bg-slate-800"
                                    />
                                    <ManYenInput
                                        label="現在の資産額"
                                        value={inputs.currentAssets}
                                        onChange={(v) => handleInputChange('currentAssets', v)}
                                        className="bg-slate-50 dark:bg-slate-800"
                                    />
                                    <ManYenInput
                                        label="年収 (税込)"
                                        value={inputs.annualIncome}
                                        onChange={(v) => handleInputChange('annualIncome', v)}
                                        className="bg-slate-50 dark:bg-slate-800"
                                    />
                                    <ManYenInput
                                        label="年間支出"
                                        value={inputs.annualExpenses}
                                        onChange={(v) => handleInputChange('annualExpenses', v)}
                                        className="bg-slate-50 dark:bg-slate-800"
                                    />
                                </div>
                            </div>

                            {/* FIRE後の働き方 */}
                            <div className="bg-white dark:bg-slate-700 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-600 space-y-4">
                                <h3 className="text-sm font-bold text-slate-600 dark:text-slate-400 mb-4">FIRE後の働き方</h3>
                                <div className="space-y-3">
                                    {jobOptions.map(job => (
                                        <button
                                            key={job.id}
                                            onClick={() => handleJobSelect(job)}
                                            className={`w-full p-3 rounded-xl border-2 transition-all flex items-center gap-3 text-left
                                                ${selectedJobId === job.id
                                                    ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-500 ring-1 ring-blue-500'
                                                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-600 hover:border-blue-300'
                                                }`}
                                        >
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0
                                                ${selectedJobId === job.id ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-600' : 'bg-slate-100 dark:bg-slate-700 text-slate-500'}`}>
                                                <job.icon className="w-5 h-5" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="font-bold text-slate-800 dark:text-slate-200 text-sm">{job.title}</div>
                                                <div className="text-xs text-slate-500 dark:text-slate-400 truncate">{job.desc}</div>
                                            </div>
                                            <div className="text-right shrink-0">
                                                <div className={`text-sm font-bold ${selectedJobId === job.id ? 'text-blue-600' : 'text-slate-400'}`}>
                                                    {job.income > 0 ? `+${job.income.toLocaleString()}円` : '¥0'}
                                                </div>
                                                <div className="text-[10px] text-slate-400">/月</div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <button
                                onClick={() => setStep(2)}
                                className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl shadow-lg hover:bg-blue-700 transition-all flex items-center justify-center gap-2 group"
                            >
                                <span>次へ進む</span>
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    )}

                    {/* STEP 2: COURSE SELECTION (with inline diagnosis) */}
                    {step === 2 && !showDiagnosis && (
                        <div className="w-full animate-in slide-in-from-right duration-500 space-y-6">
                            <div>
                                <h2 className="text-xl font-bold mb-2 text-slate-800 dark:text-slate-200">フライトコースの選択</h2>
                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                    今回の旅の目的地（目指すFIREスタイル）をお選びください。
                                </p>
                            </div>

                            {/* 診断ボタン */}
                            {!recommendedCourse && (
                                <button
                                    onClick={() => setShowDiagnosis(true)}
                                    className="w-full py-3 bg-gradient-to-r from-yellow-400 to-orange-400 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                                >
                                    <Sparkles className="w-5 h-5" />
                                    あなたに最適なコースを診断する
                                </button>
                            )}

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
                                {courses.map(course => (
                                    <button
                                        key={course.id}
                                        onClick={() => setSelectedCourse(course.id)}
                                        className={`p-4 rounded-xl border-2 transition-all relative
                                            ${selectedCourse === course.id
                                                ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-500 ring-4 ring-blue-100 dark:ring-blue-900/50'
                                                : `${course.color} dark:bg-slate-700 dark:border-slate-600 hover:bg-opacity-80`
                                            }`}
                                    >
                                        {recommendedCourse === course.id && (
                                            <div className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg flex items-center gap-1">
                                                <Sparkles className="w-3 h-3" />
                                                おすすめ
                                            </div>
                                        )}

                                        <div className="text-3xl mb-2">{course.icon}</div>
                                        <h3 className="font-bold text-slate-800 dark:text-slate-200">{course.title}</h3>
                                        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">{course.desc}</p>

                                        {selectedCourse === course.id && (
                                            <div className="absolute top-3 right-3 text-blue-600">
                                                <CheckCircle2 className="w-6 h-6 fill-blue-100 dark:fill-blue-900" />
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>

                            <button
                                onClick={handleNext}
                                disabled={!selectedCourse}
                                className={`w-full py-4 text-white font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2
                                    ${selectedCourse
                                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-xl transform hover:-translate-y-1'
                                        : 'bg-slate-300 dark:bg-slate-700 cursor-not-allowed'}`}
                            >
                                <Plane className={`w-5 h-5 ${selectedCourse ? 'animate-pulse' : ''}`} />
                                出発する (Launch Dashboard)
                            </button>
                        </div>
                    )}

                    {/* DIAGNOSIS QUESTIONS */}
                    {step === 2 && showDiagnosis && (
                        <div className="w-full max-w-md animate-in slide-in-from-right duration-500" key={diagnosisStep}>
                            <div className="flex items-center justify-center gap-2 mb-6">
                                <Sparkles className="w-6 h-6 text-yellow-500" />
                                <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">あなたに最適なコースを診断</h2>
                            </div>
                            <div className="flex justify-between text-xs font-bold text-slate-400 mb-4 uppercase tracking-wider">
                                <span>Question {diagnosisStep + 1}</span>
                                <span>{diagnosisStep + 1} / {questions.length}</span>
                            </div>
                            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-6">
                                {questions[diagnosisStep].text}
                            </h3>
                            <div className="space-y-3">
                                {questions[diagnosisStep].options.map((opt, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => handleDiagnosisAnswer(opt.points)}
                                        className="w-full text-left p-4 rounded-xl border border-slate-200 dark:border-slate-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:border-blue-200 dark:hover:border-blue-700 hover:text-blue-700 dark:hover:text-blue-300 transition-all text-sm font-medium text-slate-600 dark:text-slate-400"
                                    >
                                        {opt.text}
                                    </button>
                                ))}
                            </div>
                            <button
                                onClick={() => {
                                    setShowDiagnosis(false);
                                    setDiagnosisStep(0);
                                }}
                                className="mt-6 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 text-sm flex items-center gap-1 mx-auto transition-colors"
                            >
                                診断をスキップ
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    )}

                    {/* STEP 3: DEPARTING */}
                    {step === 3 && (
                        <div className="animate-in zoom-in duration-700 flex flex-col items-center">
                            <div className="w-24 h-24 bg-blue-500 rounded-full flex items-center justify-center mb-6 animate-bounce">
                                <Plane className="w-12 h-12 text-white" />
                            </div>
                            <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-200">Take Off!</h2>
                            <p className="text-slate-500 dark:text-slate-400 mt-2">
                                快適な空の旅をお楽しみください。<br />
                                Dashboardを最適化しています...
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
