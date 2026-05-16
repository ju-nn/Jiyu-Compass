
import type { FireCase } from '../types';

export const fireCases: FireCase[] = [
    // --- Lean FIRE / Solo Cases ---
    {
        id: 'lean-minimalist',
        name: 'タケシさん',
        age: 32,
        occupation: 'フリーランスエンジニア',
        fireType: 'lean',
        currentAssets: 3200,
        fireGoal: 4000,
        annualIncome: 500,
        annualExpenses: 150,
        savingsRate: 70,
        progressRate: 80,
        yearsToFire: 2,
        description: '月12万円で暮らすミニマリスト。地方都市で自由を謳歌',
        story: '新卒でブラック企業に入社し消耗。26歳でミニマリズムに目覚め、生活費を極限まで圧縮。現在は週3日だけ働き、残りは読書や散歩をして過ごす。「足るを知る」ことで誰よりも早く自由を手に入れた。'
    },
    {
        id: 'lean-rural',
        name: 'ハナコさん',
        age: 45,
        occupation: '元事務職 → 農業手伝い',
        fireType: 'lean',
        currentAssets: 2500,
        fireGoal: 2500,
        annualIncome: 120,
        annualExpenses: 100,
        savingsRate: 20,
        progressRate: 100,
        yearsToFire: 0,
        description: '空き家バンクで家賃を排除。半自給自足のLean FIRE',
        story: '千葉県の古民家を格安で購入しDIY。野菜は畑で自給し、固定費はほぼ通信費と光熱費のみ。必要な現金は農繁期のアルバイトで稼ぐ。お金を使わない豊かな暮らしを実践中。'
    },

    // --- Side / Barista FIRE Cases ---
    {
        id: 'side-designer',
        name: 'ユキさん',
        age: 29,
        occupation: 'Webデザイナー',
        fireType: 'side',
        currentAssets: 1500,
        fireGoal: 4500,
        annualIncome: 450,
        annualExpenses: 240,
        savingsRate: 46,
        progressRate: 33,
        yearsToFire: 12,
        description: '都会暮らしを維持しながらSide FIRE。好きな仕事だけ選ぶ',
        story: '都内のIT企業勤務。完全リタイアは退屈そうなので、資産収入が月10万を超えたら独立予定。嫌なクライアントの仕事は断れる「選択の自由」を持つために資産形成中。'
    },
    {
        id: 'barista-coffee',
        name: 'ケンジさん',
        age: 42,
        occupation: '元営業マネージャー → カフェ店員',
        fireType: 'barista',
        currentAssets: 5000,
        fireGoal: 5000,
        annualIncome: 200,
        annualExpenses: 280,
        savingsRate: 0,
        progressRate: 100,
        yearsToFire: 0,
        description: 'Barista FIRE達成済み。責任のない仕事でストレスフリー',
        story: '40歳で資産5000万円を達成し退職。現在は週3日、近所のカフェでアルバイト。資産収入(月15万) + バイト代(月8万)で生活。社会保険もバイト先で加入し、最強の安定感を手に入れた。'
    },

    // --- Fat / Coast FIRE Cases ---
    {
        id: 'fat-investor',
        name: 'ダイスケさん',
        age: 38,
        occupation: '外資系金融',
        fireType: 'fat',
        currentAssets: 15000,
        fireGoal: 30000,
        annualIncome: 2000,
        annualExpenses: 800,
        savingsRate: 60,
        progressRate: 50,
        yearsToFire: 8,
        description: '高年収×高配当株でFat FIRE。家族と世界一周が夢',
        story: '激務の対価として高収入を得ているが、45歳での完全引退を決意。教育費や旅行費を妥協したくないため、目標額は3億円。高配当株投資でキャッシュフローを重視したポートフォリオを構築中。'
    },
    {
        id: 'coast-chill',
        name: 'ミサトさん',
        age: 30,
        occupation: 'マーケター',
        fireType: 'side', // Coast FIRE的な概念だが区分はSideに近い
        currentAssets: 2000,
        fireGoal: 5000,
        annualIncome: 500,
        annualExpenses: 400,
        savingsRate: 20, // 貯蓄ペースを落としている
        progressRate: 40,
        yearsToFire: 20,
        description: 'Coast FIRE状態。老後資金は確保済みなので「今」を楽しむ',
        story: '20代で頑張って2000万円貯めた。これを30年放置すれば複利で老後資金は十分（Coast FIRE達成）。そのため現在は貯蓄率を落とし、趣味の旅行や体験にお金を使う「バランス型」にシフトした。'
    },

    // --- Family / Couple Cases ---
    {
        id: 'couple-dinks',
        name: 'T夫妻',
        age: 34,
        occupation: '共働き会社員',
        fireType: 'side',
        currentAssets: 4000,
        fireGoal: 8000,
        annualIncome: 1100,
        annualExpenses: 450,
        savingsRate: 60,
        progressRate: 50,
        yearsToFire: 7,
        description: 'DINKS(共働き・子なし)の最強馬力で最速FIREへ',
        story: '夫婦で財布を統合し、生活費を最適化。2馬力の入金力で月40万円をインデックス投資へ。互いに40歳での早期退職を目標に、週末はスパイスカレー作りを楽しむのが唯一の贅沢。'
    },
    {
        id: 'family-kids',
        name: 'サトシ家',
        age: 39,
        occupation: 'メーカー勤務',
        fireType: 'side',
        currentAssets: 3500,
        fireGoal: 7000,
        annualIncome: 800,
        annualExpenses: 500, // 子供2人の教育費込み
        savingsRate: 37,
        progressRate: 50,
        yearsToFire: 13,
        description: '子供2人でも諦めない。ジュニアNISAフル活用の教育費戦略',
        story: '「子供がいるからFIRE無理」は言い訳。教育費はジュニアNISAで確保済み。子供が大学に入る頃にはサイドFIREし、PTAや地域活動に積極的に関わる「地元の名士」的なリタイア生活を目指す。'
    }
];
