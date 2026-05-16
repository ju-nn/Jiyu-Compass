

export type FireCourse = 'fat' | 'side' | 'lean' | 'barista';

export type MbtiType = 'INTJ' | 'INTP' | 'ENTJ' | 'ENTP' | 'INFJ' | 'INFP' | 'ENFJ' | 'ENFP' | 'ISTJ' | 'ISFJ' | 'ESTJ' | 'ESFJ' | 'ISTP' | 'ISFP' | 'ESTP' | 'ESFP';


export interface FireCase {
    id: string;
    name: string;
    age: number;
    occupation: string;
    fireType: FireCourse;
    currentAssets: number;
    fireGoal: number;
    annualIncome: number;
    annualExpenses: number;
    savingsRate: number;
    progressRate: number;
    yearsToFire: number | null;
    description: string;
    story: string;
}

export interface SavedJob {
    id: string;
    name: string;
    category: string;
    hourlyWage: number;
    savedAt: string;
}

export interface UserProfile {
    name: string;
    fireCourse: FireCourse | null;
    completedLearningIds: string[];
    xp: number;
    rank: string;
    mbti: MbtiType | null;
    savedJobs: SavedJob[];
}

export interface ExpenseBreakdown {
    housing: number;    // 住居費
    electricity: number; // 水道光熱費
    communication: number; // 通信費
    food: number;       // 食費
    insurance: number;  // 保険料
    subscription: number; // サブスク・月額サービス
    entertainment: number; // 娯楽・交際費
    other: number;      // その他
}
