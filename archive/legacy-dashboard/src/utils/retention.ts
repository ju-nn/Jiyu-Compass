import type { FireInputs } from './calculations';

export interface RetentionState {
    lastLogin: number; // timestamp
    hasCompletedProfile: boolean;
    hasRunSimulation: boolean;
    hasViewedLearning: boolean;
    completedLearningModules: string[];
    currentTab: string;
}

export interface ConciergeAction {
    message: string;
    buttonText: string;
    targetTab: 'analysis' | 'simulation' | 'cases' | 'tools' | 'learning' | 'settings';
    priority: number; // Higher is more important
}

/**
 * Determines the next best action for the user based on their current state.
 */
export const getRecommendedAction = (
    state: RetentionState,
    inputs: FireInputs
): ConciergeAction => {
    // 1. Profile Completion (Highest Priority)
    // Check if critical inputs are default or zero (heuristic)
    const isProfileIncomplete = inputs.currentAge === 30 && inputs.currentAssets === 5000000 && inputs.annualIncome === 4500000;
    // Note: This heuristic is simple; user might actually match defaults, but it's a safe bet for "new user".
    // Better check: has the user actually "saved" or touched inputs? 
    // For now rely on explicit flag passed from Dashboard if possible, or this heuristic.

    if (!state.hasCompletedProfile && isProfileIncomplete) {
        return {
            message: "ようこそ。まずはプロフィールを完成させて、現在の立ち位置を確認しましょう。",
            buttonText: "プロフィール設定へ",
            targetTab: 'settings', // Will trigger onboarding wizard
            priority: 100
        };
    }

    // 2. Simulation (If profile is done but haven't simulated past/future)
    if (!state.hasRunSimulation) {
        return {
            message: "プロフィール入力ありがとうございます。次は未来の資産推移をシミュレーションしてみましょう。",
            buttonText: "シミュレーションを見る",
            targetTab: 'simulation',
            priority: 90
        };
    }

    // 3. Learning (If simulation done but no learning)
    if (state.completedLearningModules.length === 0) {
        return {
            message: "シミュレーション結果はいかがでしたか？FIRE実現のための基礎知識を学びましょう。",
            buttonText: "基礎知識を学ぶ",
            targetTab: 'learning',
            priority: 80
        };
    }

    // 4. Analysis / Expense Breakdown (If saving rate is low)
    const savings = inputs.annualIncome - inputs.annualExpenses;
    const savingsRate = savings / inputs.annualIncome;
    if (savingsRate < 0.2) { // Less than 20% savings rate
        return {
            message: "貯蓄率が少し低めのようです。支出の内訳を見直して、投資余力を増やしませんか？",
            buttonText: "家計分析ツールへ",
            targetTab: 'analysis',
            priority: 70
        };
    }

    // 5. Cases (If advanced)
    if (state.completedLearningModules.length > 2) {
        return {
            message: "知識が身についてきましたね。先人たちのFIRE事例を見て、具体的なイメージを膨らませましょう。",
            buttonText: "FIRE事例を見る",
            targetTab: 'cases',
            priority: 60
        };
    }

    // Default / Maintain
    return {
        message: "順調に進んでいますね。定期的に資産状況を更新して、コンパスの針を合わせましょう。",
        buttonText: "シミュレーションを確認",
        targetTab: 'simulation',
        priority: 10
    };
};
