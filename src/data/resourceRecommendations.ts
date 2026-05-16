import type { StabilityStatus, WorkPainLevel } from '../utils/compass';

export type ResourceKind = 'learn' | 'work';

export interface ResourceRecommendation {
  id: string;
  kind: ResourceKind;
  title: string;
  body: string;
  action: string;
  tags: string[];
}

export interface TimeToolRecommendation {
  id: string;
  title: string;
  category: string;
  body: string;
  amazonQuery: string;
  price: number;
  savedHoursPerWeek: number;
  hourlyValue: number;
  lifespanYears: number;
}

export interface TimeToolRecommendationWithImpact extends TimeToolRecommendation {
  annualSavedHours: number;
  paybackYears: number;
  fiveYearValue: number;
  fiveYearProfit: number;
}

const TIME_TOOL_RECOMMENDATIONS: TimeToolRecommendation[] = [
  {
    id: 'washer-dryer',
    title: 'ドラム式洗濯乾燥機',
    category: '家事を減らす',
    body: '干す、取り込む、天気を見る時間をまとめて減らしやすい買い物です。',
    amazonQuery: 'ドラム式洗濯乾燥機',
    price: 180000,
    savedHoursPerWeek: 2.5,
    hourlyValue: 1500,
    lifespanYears: 7,
  },
  {
    id: 'dishwasher',
    title: '食洗機',
    category: '毎日の後片付け',
    body: '食後の洗い物を短くして、平日の夜に戻ってくる時間を作ります。',
    amazonQuery: '食洗機 工事不要',
    price: 50000,
    savedHoursPerWeek: 1.75,
    hourlyValue: 1500,
    lifespanYears: 5,
  },
  {
    id: 'robot-vacuum',
    title: 'ロボット掃除機',
    category: '床掃除の自動化',
    body: '掃除を始める面倒さを減らし、部屋をきれいに保つ手間を減らします。',
    amazonQuery: 'ロボット掃除機 水拭き',
    price: 40000,
    savedHoursPerWeek: 1,
    hourlyValue: 1500,
    lifespanYears: 4,
  },
  {
    id: 'meal-delivery',
    title: '宅配弁当・ミールキット',
    category: '食事の時短',
    body: '献立を考える、買い出し、下ごしらえをまとめて短くします。',
    amazonQuery: 'ミールキット 宅配',
    price: 24000,
    savedHoursPerWeek: 3,
    hourlyValue: 1500,
    lifespanYears: 1,
  },
  {
    id: 'grocery-delivery',
    title: 'ネットスーパー',
    category: '買い出しを減らす',
    body: '移動、店内を回る、重い荷物を運ぶ時間を減らします。',
    amazonQuery: 'ネットスーパー 食品',
    price: 12000,
    savedHoursPerWeek: 1.5,
    hourlyValue: 1500,
    lifespanYears: 1,
  },
  {
    id: 'cleaning-service',
    title: '家事代行・掃除サービス',
    category: '掃除を外に出す',
    body: '水回りや床掃除など、まとまった家事時間を外に出します。',
    amazonQuery: '家事代行 掃除',
    price: 96000,
    savedHoursPerWeek: 2,
    hourlyValue: 1500,
    lifespanYears: 1,
  },
  {
    id: 'cordless-vacuum',
    title: 'コードレス掃除機',
    category: '掃除の着手を軽くする',
    body: '掃除機を出す面倒さを減らして、短い掃除をすぐ終えやすくします。',
    amazonQuery: 'コードレス掃除機',
    price: 35000,
    savedHoursPerWeek: 0.75,
    hourlyValue: 1500,
    lifespanYears: 4,
  },
  {
    id: 'electric-pressure-cooker',
    title: '電気圧力鍋',
    category: '調理の放置化',
    body: '火加減を見る時間を減らし、煮込み料理を放置しやすくします。',
    amazonQuery: '電気圧力鍋',
    price: 25000,
    savedHoursPerWeek: 1.25,
    hourlyValue: 1500,
    lifespanYears: 5,
  },
  {
    id: 'clothes-steamer',
    title: '衣類スチーマー',
    category: '身支度の時短',
    body: 'アイロン台を出す手間を減らし、服のしわ取りを短くします。',
    amazonQuery: '衣類スチーマー',
    price: 12000,
    savedHoursPerWeek: 0.5,
    hourlyValue: 1500,
    lifespanYears: 4,
  },
  {
    id: 'smart-lock',
    title: 'スマートロック',
    category: '小さな手間を消す',
    body: '鍵を探す、閉め忘れを確認する、家族に鍵を渡す手間を減らします。',
    amazonQuery: 'スマートロック',
    price: 25000,
    savedHoursPerWeek: 0.35,
    hourlyValue: 1500,
    lifespanYears: 4,
  },
  {
    id: 'auto-soap-dispenser',
    title: '自動ソープディスペンサー',
    category: '小さな家事を減らす',
    body: '詰め替えや汚れの拭き取りなど、毎日の小さな手間を減らします。',
    amazonQuery: '自動 ソープディスペンサー',
    price: 4000,
    savedHoursPerWeek: 0.2,
    hourlyValue: 1500,
    lifespanYears: 3,
  },
];

export const getTimeToolRecommendations = ({
  workPain,
}: {
  monthlyBalance: number;
  workPain: WorkPainLevel;
}): TimeToolRecommendationWithImpact[] => {
  const urgencyBoost = workPain === 'high' ? 1.15 : 1;

  return TIME_TOOL_RECOMMENDATIONS
    .map((tool) => {
      const annualSavedHours = tool.savedHoursPerWeek * 52;
      const annualValue = annualSavedHours * tool.hourlyValue * urgencyBoost;
      const paybackYears = annualValue > 0 ? tool.price / annualValue : Infinity;
      const measuredYears = Math.min(5, tool.lifespanYears);
      const fiveYearValue = annualValue * measuredYears;
      const fiveYearProfit = fiveYearValue - tool.price;

      return {
        ...tool,
        hourlyValue: tool.hourlyValue * urgencyBoost,
        annualSavedHours,
        paybackYears,
        fiveYearValue,
        fiveYearProfit,
      };
    })
    .sort((a, b) => {
      if (b.fiveYearProfit !== a.fiveYearProfit) {
        return b.fiveYearProfit - a.fiveYearProfit;
      }

      return b.annualSavedHours - a.annualSavedHours;
    });
};

export const getResourceRecommendations = ({
  stabilityStatus,
  workPain,
  investmentExperience,
  cashEmergencyFundMonths,
  fireProgress,
}: {
  stabilityStatus: StabilityStatus;
  workPain: WorkPainLevel;
  investmentExperience: string;
  cashEmergencyFundMonths: number;
  fireProgress: number;
}): ResourceRecommendation[] => {
  const resources: ResourceRecommendation[] = [];

  if (fireProgress >= 100) {
    resources.push(
      {
        id: 'withdrawal-policy',
        kind: 'learn',
        title: '資産の使い方を決める',
        body: '1年の生活費、現金で持つ期間、投資が下がった年に減らす支出を整理します。',
        action: '生活費と現金で持つ分を確認する',
        tags: ['資産の使い方', '使い方'],
      },
      {
        id: 'post-fire-test-week',
        kind: 'work',
        title: '仕事を減らした暮らしを試す',
        body: '完全に辞める前に、理想の時間割・支出・仕事との距離感を小さく試します。',
        action: '1週間の理想スケジュールを書く',
        tags: ['暮らし', '働き方'],
      },
    );
  } else if (fireProgress >= 80) {
    resources.push({
      id: 'near-freedom-line-checklist',
      kind: 'learn',
      title: 'FIRE前の守りを確認する',
      body: '目標額に近い時期ほど、生活費の見込み、現金の割合、退職後に増える支払いを確認します。',
      action: '退職後に増える支払いを1つ調べる',
      tags: ['FIRE前', '不安を確認'],
    });
  }

  if (stabilityStatus === 'deficit') {
    resources.push({
      id: 'fixed-cost-review',
      kind: 'learn',
      title: '固定費を1つだけ見直す',
      body: '通信費、保険、サブスク、家賃まわりから、毎月ずっと効く支出を1つ選びます。',
      action: '今月の固定費を3つ書き出す',
      tags: ['赤字脱出', '支出'],
    });
  }

  if (cashEmergencyFundMonths < 3) {
    resources.push({
      id: 'emergency-fund',
      kind: 'learn',
      title: '急な出費用の貯金を作る',
      body: '投資より先に、急な出費や収入減で困らないよう、すぐ使える貯金を育てます。',
      action: '生活費1か月分の不足額を見る',
      tags: ['急な出費', '貯金'],
    });
  }

  if (investmentExperience === 'none' && cashEmergencyFundMonths >= 3) {
    resources.push({
      id: 'index-investing',
      kind: 'learn',
      title: '投資の3つの基本を確認する',
      body: 'NISAや投資信託を始める前に、長く続ける・分けて買う・手数料を低くする、を確認します。',
      action: '少額で積み立てる金額を決める',
      tags: ['投資準備', 'NISA'],
    });
  }

  if (workPain === 'high') {
    resources.push({
      id: 'remote-side-work',
      kind: 'work',
      title: '在宅でできる小さな仕事を探す',
      body: 'Web作業、文章を書く仕事、オンライン講師など、通勤やしばられる時間が増えにくい仕事から見ます。',
      action: '週3時間だけ試せる仕事を1つ探す',
      tags: ['働き方', '副収入'],
    });
  } else {
    resources.push({
      id: 'work-lightness',
      kind: 'work',
      title: '働く量を少し軽くする条件を考える',
      body: '転職や退職の前に、残業、通勤、シフト、仕事量のどこを減らせるかを数字で見ます。',
      action: '減らしたい負担を1つ選ぶ',
      tags: ['仕事を減らす', '仕事'],
    });
  }

  return resources.slice(0, 3);
};
