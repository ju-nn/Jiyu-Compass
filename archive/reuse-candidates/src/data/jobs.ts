import type { FireCourse, MbtiType } from '../types';

export interface Job {
    id: string;
    name: string;
    category: string;
    hourlyWage: number;
    weeklyHoursMin: number;
    weeklyHoursMax: number;
    pros: string[];
    cons: string[];
    skills: string[];
    suitableFor: FireCourse[];
    suitableMbti: MbtiType[];
    popularity: number; // 0-100, Barista/Side FIREでの人気度
}

export const jobCategories = {
    tech: 'IT・テック',
    creative: 'クリエイティブ',
    education: '教育・講師',
    service: 'サービス・接客',
    freelance: 'フリーランス',
    parttime: 'パート・アルバイト',
};

export const jobs: Job[] = [
    // IT・テック系
    {
        id: 'web-developer',
        name: 'Webエンジニア（リモート）',
        category: 'tech',
        hourlyWage: 3000,
        weeklyHoursMin: 10,
        weeklyHoursMax: 30,
        pros: ['完全リモート', '高時給', 'スキルアップ'],
        cons: ['スキル習得が必要', '案件獲得に営業力が必要'],
        skills: ['プログラミング', 'Web開発'],
        suitableFor: ['side', 'barista'],
        suitableMbti: ['INTJ', 'INTP', 'ISTP', 'ENTJ'],
        popularity: 85,
    },
    {
        id: 'web-designer',
        name: 'Webデザイナー',
        category: 'creative',
        hourlyWage: 2000,
        weeklyHoursMin: 15,
        weeklyHoursMax: 25,
        pros: ['在宅可能', 'クリエイティブ', '需要が安定'],
        cons: ['デザインスキル必要', 'トレンド学習必須'],
        skills: ['デザイン', 'Photoshop', 'Illustrator'],
        suitableFor: ['side', 'barista'],
        suitableMbti: ['ISFP', 'INFP', 'INFJ', 'ENFP'],
        popularity: 75,
    },
    {
        id: 'blog-writer',
        name: 'ブログライター',
        category: 'freelance',
        hourlyWage: 1500,
        weeklyHoursMin: 10,
        weeklyHoursMax: 30,
        pros: ['完全自由', '場所を選ばない', '初心者OK'],
        cons: ['収入が不安定', '単価が低め'],
        skills: ['ライティング'],
        suitableFor: ['side', 'barista'],
        suitableMbti: ['INFP', 'INTP', 'INFJ', 'ISFP'],
        popularity: 65,
    },

    // 教育系
    {
        id: 'online-tutor',
        name: 'オンライン家庭教師',
        category: 'education',
        hourlyWage: 2500,
        weeklyHoursMin: 5,
        weeklyHoursMax: 20,
        pros: ['オンライン', '高時給', 'やりがい'],
        cons: ['夜間・休日中心', '準備時間が必要'],
        skills: ['教える力', '得意科目'],
        suitableFor: ['side', 'barista'],
        suitableMbti: ['INFJ', 'ENFJ', 'INTP', 'ENTJ'],
        popularity: 70,
    },
    {
        id: 'language-teacher',
        name: '語学講師（英語など）',
        category: 'education',
        hourlyWage: 3000,
        weeklyHoursMin: 5,
        weeklyHoursMax: 15,
        pros: ['高時給', 'オンライン可', '国際交流'],
        cons: ['語学力必須', '準備時間'],
        skills: ['語学力', 'コミュニケーション'],
        suitableFor: ['side', 'barista'],
        suitableMbti: ['ENFJ', 'ESFJ', 'ENFP', 'ESFP'],
        popularity: 60,
    },

    // サービス・接客
    {
        id: 'cafe-staff',
        name: 'カフェスタッフ',
        category: 'service',
        hourlyWage: 1100,
        weeklyHoursMin: 15,
        weeklyHoursMax: 30,
        pros: ['シンプル', '社会性維持', '割引特典'],
        cons: ['時給が低い', '立ち仕事', 'シフト制'],
        skills: [],
        suitableFor: ['barista'],
        suitableMbti: ['ESFJ', 'ISFJ', 'ESFP', 'ISFP'],
        popularity: 55,
    },
    {
        id: 'library-staff',
        name: '図書館スタッフ',
        category: 'parttime',
        hourlyWage: 1000,
        weeklyHoursMin: 10,
        weeklyHoursMax: 20,
        pros: ['静か', 'ストレス少', '本好きに最適'],
        cons: ['競争率高', '時給低め'],
        skills: [],
        suitableFor: ['barista', 'lean'],
        suitableMbti: ['ISTJ', 'ISFJ', 'INTJ', 'INFJ'],
        popularity: 50,
    },
    {
        id: 'convenience-store',
        name: 'コンビニスタッフ',
        category: 'parttime',
        hourlyWage: 1100,
        weeklyHoursMin: 20,
        weeklyHoursMax: 40,
        pros: ['求人多数', 'シフト自由度'],
        cons: ['肉体労働', '覚えること多い', '夜勤あり'],
        skills: [],
        suitableFor: ['barista'],
        suitableMbti: ['ISTJ', 'ISTP', 'ESTP', 'ESFJ'],
        popularity: 40,
    },

    // フリーランス
    {
        id: 'photographer',
        name: 'フォトグラファー',
        category: 'freelance',
        hourlyWage: 2500,
        weeklyHoursMin: 10,
        weeklyHoursMax: 20,
        pros: ['クリエイティブ', '自由', '趣味と実益'],
        cons: ['機材投資', '案件獲得が大変'],
        skills: ['撮影技術', '編集'],
        suitableFor: ['side'],
        suitableMbti: ['ISFP', 'ISTP', 'INFP', 'ENFP'],
        popularity: 55,
    },
    {
        id: 'youtube-creator',
        name: 'YouTubeクリエイター',
        category: 'freelance',
        hourlyWage: 0, // 収入変動大
        weeklyHoursMin: 10,
        weeklyHoursMax: 30,
        pros: ['完全自由', '収益の上限なし', 'クリエイティブ'],
        cons: ['収入不安定', '成功まで時間', '精神的負担'],
        skills: ['動画編集', '企画力', 'マーケティング'],
        suitableFor: ['side'],
        suitableMbti: ['ENFP', 'ENTP', 'ESFP', 'ESTP'],
        popularity: 45,
    },
    {
        id: 'handmade-seller',
        name: 'ハンドメイド作家',
        category: 'freelance',
        hourlyWage: 1200,
        weeklyHoursMin: 15,
        weeklyHoursMax: 30,
        pros: ['好きなことで稼ぐ', '在宅', 'スキルアップ'],
        cons: ['売上不安定', '在庫リスク', 'マーケティング必須'],
        skills: ['手作業', '販売'],
        suitableFor: ['side', 'barista'],
        suitableMbti: ['ISFP', 'ISTJ', 'ISFJ', 'INFP'],
        popularity: 50,
    },

    // その他
    {
        id: 'uber-eats',
        name: 'フードデリバリー',
        category: 'parttime',
        hourlyWage: 1300,
        weeklyHoursMin: 10,
        weeklyHoursMax: 40,
        pros: ['完全自由シフト', '運動になる', '即金性'],
        cons: ['天候に左右', '事故リスク', '肉体労働'],
        skills: [],
        suitableFor: ['barista'],
        suitableMbti: ['ISTP', 'ESTP', 'ISFP', 'ESFP'],
        popularity: 60,
    },
    {
        id: 'dog-walker',
        name: 'ペットシッター',
        category: 'service',
        hourlyWage: 1500,
        weeklyHoursMin: 10,
        weeklyHoursMax: 25,
        pros: ['動物好きに最適', 'ストレス少', '運動になる'],
        cons: ['責任重大', '天候に左右', '動物アレルギー注意'],
        skills: ['動物への愛情', '責任感'],
        suitableFor: ['barista', 'side'],
        suitableMbti: ['ISFP', 'ISFJ', 'ESFJ', 'INFP'],
        popularity: 48,
    },
];
