import React, { useState, useEffect, useCallback, useMemo, Suspense } from 'react';
import { TrendingUp, Plane, FolderOpen, Calendar } from 'lucide-react';
import { calculateFireNumber, simulateAssetGrowth, calculateYearsToFire, calculateMonteCarlo, calculateSideFireShortcut, calculatePastAssetTrajectory } from '../utils/calculations';
import type { FireInputs, SimulationData, MonteCarloResult } from '../utils/calculations';
import { calculateNetIncome, calculateGrossIncomeFromNet } from '../utils/tax';
import { safeGetLocalStorage, safeSetLocalStorage } from '../utils/storage';
import { PORTFOLIO_VOLATILITY } from '../constants';
import { useDarkMode } from '../hooks/useDarkMode';
import { LoadingSpinner } from './ui/LoadingSpinner';
import { useToast } from './ui/Toast';
import { useSwipeable } from '../hooks/useSwipeable';

// Sub Components - Lazy loaded for better performance
import { InputSection } from './dashboard/InputSection';
// Lazy load heavy components
import { StrategySection } from './dashboard/StrategySection';
import { KnowledgeSection } from './dashboard/KnowledgeSection';
import { calculatePlayerStats, GAME_ITEMS } from '../utils/gameSystem';
import { checkAchievements, type Achievement } from '../utils/achievementSystem';
import { AchievementNotification } from './AchievementNotification';
import { LevelUpNotification, EquipmentUnlockNotification } from './LevelUpNotification';
import { Coffee } from 'lucide-react';
import { MONETIZATION } from '../config/monetization';

// Lazy load heavy components
const OnboardingWizard = React.lazy(() => import('./OnboardingWizard').then(m => ({ default: m.OnboardingWizard })));
const ExpenseBreakdownModal = React.lazy(() => import('./ExpenseBreakdownModal').then(m => ({ default: m.ExpenseBreakdownModal })));
const ChangelogModal = React.lazy(() => import('./ChangelogModal').then(m => ({ default: m.ChangelogModal })));
import { SettingsModal } from './SettingsModal';
import { getRecommendedAction } from '../utils/retention';
import type { RetentionState, ConciergeAction } from '../utils/retention';
import type { FireCourse, SavedJob, MbtiType, ExpenseBreakdown } from '../types';
import { ScenarioManagementModal } from './ScenarioManagementModal';
import { ScenarioComparison } from './ScenarioComparison';
import { LifeEventSettingsModal } from './LifeEventSettingsModal';
import { InstallPrompt } from './InstallPrompt';
import { ConciergeBanner } from './dashboard/ConciergeBanner';

export const Dashboard: React.FC = () => {
    // Dark mode
    const { isDark, toggle: toggleDarkMode } = useDarkMode();

    // Toast notifications
    const { showToast, ToastContainer } = useToast();

    // --- State Management ---
    const [inputs, setInputs] = useState<FireInputs>(() => {
        return safeGetLocalStorage('fireInputs', {
            currentAge: 30,
            retirementAge: 50,
            currentAssets: 5000000,
            annualIncome: 4500000,
            annualExpenses: 2500000,
            investmentReturnRate: 4.0,
            inflationRate: 2.0,
            withdrawalRate: 4.0,
            pensionStartAge: 65,
            monthlyPension: 0,
            postRetirementIncome: 0,
            adjustIncomeForInflation: true
        });
    });

    const [fireCourse, setFireCourse] = useState<FireCourse | null>(() => {
        return safeGetLocalStorage('fireCourse', null);
    });

    const [mbti, setMbti] = useState<MbtiType | null>(() => {
        return safeGetLocalStorage('fireMbti', null);
    });

    // Expense Breakdown State (Phase 22)
    const [expenseBreakdown, setExpenseBreakdown] = useState<ExpenseBreakdown | null>(() => {
        return safeGetLocalStorage('fireExpenseBreakdown', null);
    });
    const [showExpenseModal, setShowExpenseModal] = useState(false);
    const [showChangelog, setShowChangelog] = useState(false);
    const [showScenarioModal, setShowScenarioModal] = useState(false);
    const [showScenarioComparison, setShowScenarioComparison] = useState(false);
    const [showLifePlanModal, setShowLifePlanModal] = useState(false);

    useEffect(() => {
        safeSetLocalStorage('fireInputs', inputs);
    }, [inputs]);

    useEffect(() => {
        if (fireCourse) {
            safeSetLocalStorage('fireCourse', fireCourse);
        }
    }, [fireCourse]);

    useEffect(() => {
        if (mbti) {
            safeSetLocalStorage('fireMbti', mbti);
        }
    }, [mbti]);

    useEffect(() => {
        if (expenseBreakdown) {
            safeSetLocalStorage('fireExpenseBreakdown', expenseBreakdown);
        }
    }, [inputs, fireCourse, mbti]);

    const handleLoadScenario = useCallback((newInputs: FireInputs) => {
        setInputs(newInputs);
        showToast('シナリオを読み込みました', 'success');
        setShowScenarioModal(false);
    }, [showToast]);

    const handleUpdateLifePlan = useCallback((updates: Partial<FireInputs>) => {
        setInputs(prev => ({ ...prev, ...updates }));
        showToast('ライフプランを更新しました', 'success');
    }, [showToast]);

    const handleSaveExpenseBreakdown = useCallback((breakdown: ExpenseBreakdown, newAnnualExpenses: number) => {
        setExpenseBreakdown(breakdown);
        setInputs(prev => ({ ...prev, annualExpenses: newAnnualExpenses }));
        setShowExpenseModal(false);
        showToast('家計詳細を保存しました', 'success');
    }, [showToast]);

    const [data, setData] = useState<SimulationData[]>([]);
    const [mcData, setMcData] = useState<MonteCarloResult[]>([]);

    // Derived Financial Metrics
    const fireNumber = useMemo(() => {
        return calculateFireNumber(inputs.annualExpenses, inputs.withdrawalRate);
    }, [inputs.annualExpenses, inputs.withdrawalRate]);

    const yearsToFire = useMemo(() => {
        return calculateYearsToFire(
            inputs.currentAssets,
            inputs.annualIncome - inputs.annualExpenses,
            inputs.investmentReturnRate,
            fireNumber
        );
    }, [inputs.currentAssets, inputs.annualIncome, inputs.annualExpenses, inputs.investmentReturnRate, fireNumber]);

    const achievableAge = yearsToFire !== null ? inputs.currentAge + yearsToFire : null;

    // Check if onboarding was completed before
    const [showOnboarding, setShowOnboarding] = useState(() => {
        const onboardingCompleted = safeGetLocalStorage('onboardingCompleted', false);
        return !onboardingCompleted && !fireCourse;
    });

    // UI Toggles
    const [showAdvanced, setShowAdvanced] = useState(false);

    const [activeTab, setActiveTab] = useState<'strategy' | 'quest' | 'knowledge'>('strategy');

    // Swipe gesture for tab switching
    const handleSwipeLeft = useCallback(() => {
        setActiveTab(current => {
            if (current === 'strategy') return 'quest';
            if (current === 'quest') return 'knowledge';
            return current;
        });
    }, []);

    const handleSwipeRight = useCallback(() => {
        setActiveTab(current => {
            if (current === 'knowledge') return 'quest';
            if (current === 'quest') return 'strategy';
            return current;
        });
    }, []);

    // Swipe handlers
    const handlers = useSwipeable({
        onSwipedLeft: () => handleSwipeLeft(),
        onSwipedRight: () => handleSwipeRight()
    });

    // Learning State (Phase 20)
    const [completedLearningIds, setCompletedLearningIds] = useState<string[]>(() => {
        return safeGetLocalStorage('fireLearningProgress', []);
    });

    useEffect(() => {
        safeSetLocalStorage('fireLearningProgress', completedLearningIds);
    }, [completedLearningIds]);

    const handleLearningComplete = useCallback((id: string) => {
        setCompletedLearningIds(prev => [...prev, id]);
    }, []);

    // User Profile State (Jobs)
    const [savedJobs, setSavedJobs] = useState<SavedJob[]>(() => {
        return safeGetLocalStorage('fireSavedJobs', []);
    });

    useEffect(() => {
        safeSetLocalStorage('fireSavedJobs', savedJobs);
    }, [savedJobs]);

    const handleSaveJob = useCallback((job: SavedJob) => {
        setSavedJobs(prev => {
            if (prev.some(j => j.id === job.id)) return prev;
            return [...prev, job];
        });
    }, []);

    const handleRemoveJob = useCallback((jobId: string) => {
        setSavedJobs(prev => prev.filter(j => j.id !== jobId));
    }, []);

    // Business Logic Switches
    const [useNisa, setUseNisa] = useState(false);
    const [isMonteCarlo, setIsMonteCarlo] = useState(false);
    const [sideFireShortcut, setSideFireShortcut] = useState<number | null>(null);
    const [portfolioType, setPortfolioType] = useState<'sp500' | 'all_country' | 'custom'>('custom');

    // Achievement & RPG State (Global)
    const [newAchievement, setNewAchievement] = useState<Achievement | null>(null);
    const [isWarmedUp, setIsWarmedUp] = useState(false);
    const [playerAchievements, setPlayerAchievements] = useState<{
        unlockedAchievements: string[];
        progress: Record<string, number>;
        lastChecked: Date;
        streakDays: number;
        totalSaved: number;
    }>(() => {
        return safeGetLocalStorage('playerAchievements', {
            unlockedAchievements: [],
            progress: {},
            lastChecked: new Date(),
            streakDays: 0,
            totalSaved: inputs.currentAssets
        });
    });

    const playerStats = useMemo(() => {
        return calculatePlayerStats(inputs.currentAssets, inputs.annualIncome > 0 ? ((inputs.annualIncome - inputs.annualExpenses) / inputs.annualIncome) * 100 : 0, inputs.currentAge, yearsToFire || 0);
    }, [inputs.currentAssets, inputs.annualIncome, inputs.annualExpenses, inputs.currentAge, yearsToFire]);

    // Level Up & Equipment States
    const [previousLevel, setPreviousLevel] = useState(() => safeGetLocalStorage('previousLevel', playerStats.level));
    const [previousEquipmentCount, setPreviousEquipmentCount] = useState(() => safeGetLocalStorage('previousEquipmentCount', playerStats.unlockedItems.length));
    const [levelUpData, setLevelUpData] = useState<{ oldLevel: number; newLevel: number; newTitle: string } | null>(null);
    const [newEquipment, setNewEquipment] = useState<any | null>(null);

    useEffect(() => {
        const timer = setTimeout(() => setIsWarmedUp(true), 3000);
        return () => clearTimeout(timer);
    }, []);

    // Achievement Tracking
    useEffect(() => {
        const fireProgress = fireNumber > 0 ? (inputs.currentAssets / fireNumber) * 100 : 0;

        const { newAchievements, updatedProgress } = checkAchievements(playerAchievements, {
            assets: inputs.currentAssets,
            savingsRate: inputs.annualIncome > 0 ? ((inputs.annualIncome - inputs.annualExpenses) / inputs.annualIncome) * 100 : 0,
            fireProgress,
            equipmentCount: playerStats.unlockedItems.length,
            totalSaved: Math.max(playerAchievements.totalSaved, inputs.currentAssets)
        });

        if (newAchievements.length > 0) {
            const updatedAchievements = {
                ...playerAchievements,
                unlockedAchievements: [...playerAchievements.unlockedAchievements, ...newAchievements.map(a => a.id)],
                progress: updatedProgress,
                totalSaved: Math.max(playerAchievements.totalSaved, inputs.currentAssets)
            };

            setPlayerAchievements(updatedAchievements);
            safeSetLocalStorage('playerAchievements', updatedAchievements);

            if (isWarmedUp) {
                setNewAchievement(newAchievements[0]);
            }
        }
    }, [inputs, fireNumber, yearsToFire, isWarmedUp, playerStats.unlockedItems.length]);

    // Level Up & Equipment Detection
    useEffect(() => {
        if (!isWarmedUp) return;

        // Level Up Check
        if (playerStats.level > previousLevel) {
            setLevelUpData({
                oldLevel: previousLevel,
                newLevel: playerStats.level,
                newTitle: playerStats.title
            });
            setPreviousLevel(playerStats.level);
            safeSetLocalStorage('previousLevel', playerStats.level);
        }

        // Equipment Check
        if (playerStats.unlockedItems.length > previousEquipmentCount) {
            const lastUnlockedId = playerStats.unlockedItems[playerStats.unlockedItems.length - 1];
            const item = GAME_ITEMS.find(i => i.id === lastUnlockedId);
            if (item) {
                setNewEquipment(item);
            }
            setPreviousEquipmentCount(playerStats.unlockedItems.length);
            safeSetLocalStorage('previousEquipmentCount', playerStats.unlockedItems.length);
        }
    }, [playerStats, isWarmedUp, previousLevel, previousEquipmentCount]);

    // Independent state for Gross Income
    const [grossIncome, setGrossIncome] = useState<number>(0);

    // Auto-calculate Net Income
    useEffect(() => {
        if (grossIncome > 0) {
            const net = calculateNetIncome(grossIncome);
            setInputs(prev => ({ ...prev, annualIncome: net }));
        }
    }, [grossIncome]);

    // Phase 34: Auto-calculate Gross Income from Net if coming from onboarding
    useEffect(() => {
        if (grossIncome === 0 && inputs.annualIncome > 0) {
            const gross = calculateGrossIncomeFromNet(inputs.annualIncome);
            setGrossIncome(gross);
        }
    }, []); // Only on mount

    // Main Simulation Effect
    useEffect(() => {
        const simData = simulateAssetGrowth(inputs, useNisa);
        setData(simData);

        if (isMonteCarlo) {
            const volatility = PORTFOLIO_VOLATILITY[portfolioType];
            const mc = calculateMonteCarlo(inputs, volatility);
            setMcData(mc);
        }
    }, [inputs, useNisa, isMonteCarlo, portfolioType]);

    // Past Asset Trajectory (Phase 31 - Restored)
    const [showPast, setShowPast] = useState(false);
    const pastData = useMemo(() => {
        if (!showPast) return [];
        return calculatePastAssetTrajectory(inputs.currentAge, inputs.currentAssets, inputs.annualIncome - inputs.annualExpenses);
    }, [inputs.currentAge, inputs.currentAssets, inputs.annualIncome, inputs.annualExpenses, showPast]);

    const handleInputChange = useCallback((key: keyof FireInputs, value: number | string | boolean) => {
        setInputs(prev => {
            const newInputs = { ...prev, [key]: value };
            return newInputs;
        });
    }, []);

    // Retention / Concierge State (Phase 33)
    const [showConcierge, setShowConcierge] = useState(true);
    const [conciergeAction, setConciergeAction] = useState<ConciergeAction | null>(null);
    const [hasCompletedProfile, setHasCompletedProfile] = useState(() => {
        return safeGetLocalStorage('fireProfileCompleted', false);
    });

    useEffect(() => {
        // Calculate recommended action
        const currentState: RetentionState = {
            lastLogin: Date.now(),
            hasCompletedProfile: hasCompletedProfile,
            hasRunSimulation: activeTab === 'strategy' || safeGetLocalStorage('fireHasRunSimulation', false),
            hasViewedLearning: activeTab === 'knowledge',
            completedLearningModules: completedLearningIds,
            currentTab: activeTab
        };

        const action = getRecommendedAction(currentState, inputs);
        setConciergeAction(action);
    }, [inputs, activeTab, completedLearningIds, hasCompletedProfile]);

    // Track detailed actions
    useEffect(() => {
        if (activeTab === 'strategy') {
            safeSetLocalStorage('fireHasRunSimulation', true);
        }
    }, [activeTab]);

    const handleConciergeAction = useCallback((targetTab: string) => {
        if (targetTab === 'settings') {
            setShowOnboarding(true);
        } else {
            // Map old tabs to new ones if necessary
            const tabMap: Record<string, string> = {
                'simulation': 'strategy',
                'analysis': 'strategy',
                'learning': 'knowledge',
                'cases': 'knowledge'
            };
            const mappedTab = tabMap[targetTab] || targetTab;
            setActiveTab(mappedTab as any);
        }
    }, []);

    const handleOnboardingComplete = useCallback((newInputs: FireInputs, course: FireCourse, userMbti: MbtiType | null) => {
        setInputs(newInputs);
        setFireCourse(course);
        setMbti(userMbti);
        setShowOnboarding(false);
        setHasCompletedProfile(true);
        safeSetLocalStorage('fireProfileCompleted', true);
        safeSetLocalStorage('onboardingCompleted', true); // Save onboarding completion
        showToast(`${course.toUpperCase()} FIREコースで設定完了しました！`, 'success');
    }, [showToast]);

    const handleSideFireDiagnosis = useCallback(() => {
        const yearsSaved = calculateSideFireShortcut(inputs);
        setSideFireShortcut(yearsSaved);
        if (yearsSaved > 0) {
            showToast(`Side FIREで${yearsSaved}年短縮可能です！`, 'info');
        }
        setTimeout(() => setSideFireShortcut(null), 5000);
    }, [inputs, showToast]);

    const handleRediagnose = useCallback(() => {
        localStorage.removeItem('onboardingCompleted');
        localStorage.removeItem('fireProfileCompleted');
        setShowOnboarding(true);
        showToast('FIREコースの再診断を開始します', 'info');
    }, [showToast]);


    const getCourseIcon = (c: FireCourse) => {
        switch (c) {
            case 'fat': return '💎 Fat FIRE';
            case 'side': return '💻 Side FIRE';
            case 'lean': return '🧘 Lean FIRE';
            case 'barista': return '☕ Barista FIRE';
            default: return '';
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 font-sans text-slate-900 dark:text-slate-100 transition-colors">
            {/* Onboarding Wizard */}
            {showOnboarding && (
                <Suspense fallback={
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                        <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-2xl">
                            <LoadingSpinner size="lg" text="設定画面を読み込み中" />
                        </div>
                    </div>
                }>
                    <OnboardingWizard
                        initialInputs={inputs}
                        onComplete={handleOnboardingComplete}
                    />
                </Suspense>
            )}

            {showExpenseModal && (
                <Suspense fallback={
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                        <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-2xl">
                            <LoadingSpinner size="lg" text="家計詳細画面を読み込み中" />
                        </div>
                    </div>
                }>
                    <ExpenseBreakdownModal
                        currentBreakdown={expenseBreakdown}
                        currentAnnualExpenses={inputs.annualExpenses}
                        onSave={handleSaveExpenseBreakdown}
                        onClose={() => setShowExpenseModal(false)}
                    />
                </Suspense>
            )}

            {showChangelog && (
                <Suspense fallback={
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                        <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-2xl">
                            <LoadingSpinner size="lg" text="更新履歴を読み込み中" />
                        </div>
                    </div>
                }>
                    <ChangelogModal onClose={() => setShowChangelog(false)} />
                </Suspense>
            )}

            {/* Header */}
            <header className="bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 sticky top-0 z-30 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="h-14 flex items-center justify-between">
                        {/* Logo */}
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-primary-500 flex items-center justify-center">
                                <TrendingUp className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h1 className="text-h3 text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                                    ジユウノコンパス
                                    {fireCourse && (
                                        <span className="text-tiny px-2 py-0.5 rounded-md bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 border border-primary-200 dark:border-primary-800">
                                            {getCourseIcon(fireCourse).split(' ')[0]}
                                        </span>
                                    )}
                                </h1>
                            </div>
                        </div>

                        {/* Desktop Navigation */}
                        <nav className="hidden md:flex items-center gap-1">
                            {[
                                { id: 'strategy', label: '私の戦略', icon: '📊' },
                                { id: 'quest', label: 'クエスト', icon: '🎯' },
                                { id: 'knowledge', label: 'ナレッジ', icon: '📚' }
                            ].map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id as any)}
                                    className={`px-4 py-2 rounded-lg text-small font-semibold transition-all duration-normal flex items-center gap-2
                                        ${activeTab === tab.id
                                            ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
                                            : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-neutral-100'
                                        }`}
                                >
                                    <span>{tab.icon}</span>
                                    {tab.label}
                                </button>
                            ))}
                        </nav>

                        {/* Actions */}
                        <div className="flex items-center gap-2">
                            <a
                                href={MONETIZATION.buyMeACoffeeUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-[#FFDD00] hover:bg-[#FFDD00]/90 text-black rounded-lg text-sm font-bold transition-all duration-normal shadow-sm hover:shadow-md border border-[#FFDD00]/20"
                                title="開発者を応援する"
                            >
                                <Coffee className="w-4 h-4" />
                                <span>応援する</span>
                            </a>
                            <button
                                onClick={() => setShowScenarioModal(true)}
                                className="p-2 text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-all duration-fast"
                                title="シナリオ管理"
                            >
                                <FolderOpen className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => setShowLifePlanModal(true)}
                                className="p-2 text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-all duration-fast"
                                title="ライフプラン"
                            >
                                <Calendar className="w-5 h-5" />
                            </button>
                            <button
                                onClick={toggleDarkMode}
                                className="p-2 text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-all duration-fast"
                                title={isDark ? 'ライトモード' : 'ダークモード'}
                            >
                                {isDark ? (
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                                    </svg>
                                ) : (
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                                    </svg>
                                )}
                            </button>
                            <button
                                onClick={() => setShowOnboarding(true)}
                                className="flex items-center gap-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg text-small font-semibold transition-all duration-normal shadow-sm hover:shadow-md"
                            >
                                <Plane className="w-4 h-4" />
                                <span className="hidden sm:inline">設定</span>
                            </button>
                        </div>
                    </div>

                    {/* Mobile Navigation */}
                    <div className="md:hidden pb-3 border-t border-neutral-100 dark:border-neutral-800 pt-2 space-y-2">
                        <div className="flex items-center justify-between px-2 pb-2">
                            <a
                                href={MONETIZATION.buyMeACoffeeUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 px-3 py-1.5 bg-[#FFDD00] hover:bg-[#FFDD00]/90 text-black rounded-lg text-xs font-bold transition-all duration-normal shadow-sm w-full justify-center"
                            >
                                <Coffee className="w-3.5 h-3.5" />
                                <span>開発者を応援する ☕️</span>
                            </a>
                        </div>
                        <div className="flex gap-2">
                            {[
                                { id: 'strategy', label: 'マイ戦略', icon: '📊' },
                                { id: 'quest', label: 'クエスト', icon: '🎯' },
                                { id: 'knowledge', label: 'ナレッジ', icon: '📚' }
                            ].map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id as any)}
                                    className={`flex-1 px-3 py-2 rounded-lg text-tiny font-semibold transition-all duration-normal flex items-center justify-center gap-1.5
                                        ${activeTab === tab.id
                                            ? 'bg-primary-500 text-white shadow-sm'
                                            : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
                                        }`}
                                >
                                    <span className="text-sm">{tab.icon}</span>
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </header>

            {conciergeAction && (
                <ConciergeBanner
                    action={conciergeAction}
                    onAction={handleConciergeAction}
                    onClose={() => setShowConcierge(false)}
                    isVisible={showConcierge}
                />
            )}

            <main {...handlers} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">


                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Inputs */}
                    <div className="lg:col-span-1">
                        <InputSection
                            inputs={inputs}
                            handleInputChange={handleInputChange}
                            achievableAge={achievableAge}
                            grossIncome={grossIncome}
                            setGrossIncome={setGrossIncome}
                            setShowAdvanced={setShowAdvanced}
                            onOpenExpenseBreakdown={() => setShowExpenseModal(true)}
                        />


                    </div>

                    {/* Right Column: Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Content Area */}
                        <div className="min-h-[600px]">
                            <Suspense fallback={
                                <div className="flex items-center justify-center h-96">
                                    <LoadingSpinner size="lg" text="コンテンツを読み込み中" />
                                </div>
                            }>
                                {activeTab === 'strategy' && (
                                    <StrategySection
                                        inputs={inputs}
                                        fireNumber={fireNumber}
                                        data={data}
                                        mcData={mcData}
                                        isMonteCarlo={isMonteCarlo}
                                        setIsMonteCarlo={setIsMonteCarlo}
                                        useNisa={useNisa}
                                        sideFireShortcut={sideFireShortcut}
                                        onDiagnosisSideFire={handleSideFireDiagnosis}
                                        grossIncome={grossIncome}
                                        expenseBreakdown={expenseBreakdown}
                                        onOpenExpenseBreakdown={() => setShowExpenseModal(true)}
                                        fireCourse={fireCourse}
                                        savedJobs={savedJobs}
                                        onSaveJob={handleSaveJob}
                                        onRemoveJob={handleRemoveJob}
                                        mbti={mbti}
                                        investmentReturnRate={inputs.investmentReturnRate}
                                        monthlyPension={inputs.monthlyPension}
                                        pensionStartAge={inputs.pensionStartAge}
                                        pastData={pastData}
                                        showPast={showPast}
                                        setShowPast={setShowPast}
                                    />
                                )}

                                {activeTab === 'knowledge' && (
                                    <KnowledgeSection
                                        fireCourse={fireCourse}
                                        completedLearningIds={completedLearningIds}
                                        onLearningComplete={handleLearningComplete}
                                        investmentReturnRate={inputs.investmentReturnRate}
                                    />
                                )}
                            </Suspense>
                        </div>
                    </div>
                </div>

                <SettingsModal
                    isOpen={showAdvanced}
                    onClose={() => setShowAdvanced(false)}
                    inputs={inputs}
                    handleInputChange={handleInputChange}
                    portfolioType={portfolioType}
                    setPortfolioType={setPortfolioType}
                    useNisa={useNisa}
                    setUseNisa={setUseNisa}
                    onRediagnose={handleRediagnose}
                />
            </main>

            {/* Modals */}
            <Suspense fallback={null}>
                {showOnboarding && (
                    <OnboardingWizard initialInputs={inputs} onComplete={handleOnboardingComplete} />
                )}
                {showExpenseModal && (
                    <ExpenseBreakdownModal
                        onClose={() => setShowExpenseModal(false)}
                        currentBreakdown={expenseBreakdown}
                        onSave={handleSaveExpenseBreakdown}
                        currentAnnualExpenses={inputs.annualExpenses}
                    />
                )}
                {showChangelog && (
                    <ChangelogModal onClose={() => setShowChangelog(false)} />
                )}
            </Suspense>

            <ScenarioManagementModal
                isOpen={showScenarioModal}
                onClose={() => setShowScenarioModal(false)}
                currentInputs={inputs}
                onLoadScenario={handleLoadScenario}
            />

            <LifeEventSettingsModal
                isOpen={showLifePlanModal}
                onClose={() => setShowLifePlanModal(false)}
                inputs={inputs}
                onUpdate={handleUpdateLifePlan}
            />

            <ScenarioComparison
                isOpen={showScenarioComparison}
                onClose={() => setShowScenarioComparison(false)}
            />

            {/* Achievements & Notifications */}
            {newAchievement && (
                <AchievementNotification
                    achievement={newAchievement}
                    onClose={() => setNewAchievement(null)}
                    isVisible={true}
                />
            )}

            {levelUpData && (
                <LevelUpNotification
                    oldLevel={levelUpData.oldLevel}
                    newLevel={levelUpData.newLevel}
                    newTitle={levelUpData.newTitle}
                    onClose={() => setLevelUpData(null)}
                    isVisible={true}
                />
            )}

            {newEquipment && (
                <EquipmentUnlockNotification
                    equipmentName={newEquipment.name}
                    equipmentIcon={newEquipment.icon}
                    equipmentDescription={newEquipment.description}
                    rarity={newEquipment.rarity}
                    onClose={() => setNewEquipment(null)}
                    isVisible={true}
                />
            )}

            {/* Toast Container */}
            <ToastContainer />

            {/* PWA Install Prompt */}
            <InstallPrompt />
        </div>
    );
};

export default Dashboard;
