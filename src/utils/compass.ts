import {
  calculateFireNumber,
  formatCurrency,
} from './calculations';
import { getBenchmark } from './benchmarks';

export type WorkReductionGoal = 'stabilize' | 'save' | 'reduce_work' | 'semi_retire' | 'fire';
export type ExperienceLevel = 'none' | 'starting' | 'some';
export type StabilityStatus = 'deficit' | 'fragile' | 'building' | 'steady';
export type DiagnosisStep = 'profile' | 'life' | 'result' | 'quest';
export type MoneyStressLevel = 'low' | 'medium' | 'high';
export type WorkPainLevel = 'low' | 'medium' | 'high';
export type QuestCategory = 'saving' | 'income' | 'defense' | 'investment' | 'work';

export interface CompassInputs {
  currentAge: number;
  cashSavings: number;
  investedAssets: number;
  /** @deprecated Use cashSavings + investedAssets for new calculations. */
  currentAssets: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  workReductionGoal: WorkReductionGoal;
  savingsExperience: ExperienceLevel;
  investmentExperience: ExperienceLevel;
  moneyStress: MoneyStressLevel;
  workPain: WorkPainLevel;
  expectedReturnRate: number;
  withdrawalRate: number;
}

export interface ProjectionPoint {
  age: number;
  cashSavings: number;
  investedAssets: number;
  totalAssets: number;
  /** @deprecated Use totalAssets. */
  assets: number;
  label: string;
}

export interface GoalStep {
  id: string;
  label: string;
  targetAmount: number;
  currentAmount: number;
  progress: number;
  status: 'complete' | 'active' | 'locked';
  helper: string;
}

export interface Mission {
  id: string;
  category: QuestCategory;
  title: string;
  body: string;
  impact: string;
  difficulty: 'easy' | 'normal' | 'boss';
  xp: number;
  why: string;
  steps: string[];
  tips: string[];
  completionChecks: string[];
}

export interface LifeRpgStatus {
  title: string;
  level: number;
  stageName: string;
  bossName: string;
  shieldLabel: string;
  shieldProgress: number;
  workLightnessLabel: string;
  workLightnessProgress: number;
}

export interface CompassResult {
  annualIncome: number;
  annualExpenses: number;
  annualSavings: number;
  monthlyBalance: number;
  savingsRate: number;
  cashSavings: number;
  investedAssets: number;
  totalAssets: number;
  cashEmergencyFundMonths: number;
  fireNumber: number;
  fireProgress: number;
  yearsToFire: number | null;
  achievableFireAge: number | null;
  emergencyFundMonths: number;
  stabilityStatus: StabilityStatus;
  headline: string;
  nextGoal: GoalStep;
  goalSteps: GoalStep[];
  missions: Mission[];
  recommendedQuests: Mission[];
  rpgStatus: LifeRpgStatus;
  projection: ProjectionPoint[];
  metricInsights: MetricInsights;
  story: CompassStory;
}

export const COMPASS_STORAGE_KEY = 'fireCompass:v1';

export interface CompassSaveData {
  inputs: CompassInputs;
  diagnosisStep: DiagnosisStep;
  selectedQuestId: string | null;
  completedQuestIds: string[];
  questCheckState: Record<string, string[]>;
  lastCheckDate: string | null;
}

export interface MetricInsight {
  label: string;
  helper: string;
  tone: 'good' | 'warn' | 'danger' | 'neutral';
}

export interface MetricInsights {
  monthlyBuffer: MetricInsight;
  savingsRate: MetricInsight;
  emergencyFund: MetricInsight;
}

export interface CompassStory {
  positionLabel: string;
  positionHelper: string;
  currentStatusText: string;
  currentStatusHelper: string;
  baselineFutureText: string;
  baselineFutureHelper: string;
  improvedFutureText: string;
  improvedActionText: string;
  futureAge: number;
  futureTotalAssets: number;
  futureInvestedAssets: number;
  estimatedMonthlyInvestmentGain: number;
  assumedMonthlyImprovement: number;
}

export const defaultCompassInputs: CompassInputs = {
  currentAge: 28,
  cashSavings: 800000,
  investedAssets: 0,
  currentAssets: 800000,
  monthlyIncome: 250000,
  monthlyExpenses: 205000,
  workReductionGoal: 'reduce_work',
  savingsExperience: 'starting',
  investmentExperience: 'none',
  moneyStress: 'medium',
  workPain: 'high',
  expectedReturnRate: 4,
  withdrawalRate: 4,
};

export const defaultCompassSaveData: CompassSaveData = {
  inputs: defaultCompassInputs,
  diagnosisStep: 'profile',
  selectedQuestId: null,
  completedQuestIds: [],
  questCheckState: {},
  lastCheckDate: null,
};

export const normalizeCompassInputs = (rawInputs: Partial<CompassInputs>): CompassInputs => {
  const legacyAssets = safeNumber(rawInputs.currentAssets ?? 0, 0);
  const rawCashSavings = rawInputs.cashSavings;
  const rawInvestedAssets = rawInputs.investedAssets;
  const cashSavings = Math.max(0, safeNumber(rawCashSavings ?? legacyAssets, 0));
  const investedAssets = Math.max(0, safeNumber(rawInvestedAssets ?? 0, 0));

  return {
    ...defaultCompassInputs,
    ...rawInputs,
    currentAge: clamp(Math.round(safeNumber(rawInputs.currentAge ?? defaultCompassInputs.currentAge, 28)), 16, 100),
    cashSavings,
    investedAssets,
    currentAssets: cashSavings + investedAssets,
    monthlyIncome: Math.max(0, safeNumber(rawInputs.monthlyIncome ?? defaultCompassInputs.monthlyIncome, 0)),
    monthlyExpenses: Math.max(0, safeNumber(rawInputs.monthlyExpenses ?? defaultCompassInputs.monthlyExpenses, 0)),
    expectedReturnRate: clamp(safeNumber(rawInputs.expectedReturnRate ?? defaultCompassInputs.expectedReturnRate, 4), -10, 20),
    withdrawalRate: clamp(safeNumber(rawInputs.withdrawalRate ?? defaultCompassInputs.withdrawalRate, 4), 1, 10),
  };
};

export const normalizeCompassSaveData = (
  stored: Partial<CompassSaveData> | Partial<CompassInputs>,
): CompassSaveData => {
  if ('inputs' in stored && stored.inputs) {
    return {
      ...defaultCompassSaveData,
      ...stored,
      inputs: normalizeCompassInputs(stored.inputs),
      completedQuestIds: stored.completedQuestIds ?? [],
      questCheckState: stored.questCheckState ?? {},
      selectedQuestId: stored.selectedQuestId ?? null,
      lastCheckDate: stored.lastCheckDate ?? null,
    };
  }

  return {
    ...defaultCompassSaveData,
    inputs: normalizeCompassInputs(stored as Partial<CompassInputs>),
  };
};

const clamp = (value: number, min: number, max: number) => {
  return Math.min(max, Math.max(min, value));
};

const safeNumber = (value: number, fallback: number) => {
  return Number.isFinite(value) ? value : fallback;
};

const buildGoal = (
  id: string,
  label: string,
  targetAmount: number,
  currentAmount: number,
  helper: string,
  previousComplete: boolean,
): GoalStep => {
  const progress = targetAmount <= 0 ? 100 : clamp((currentAmount / targetAmount) * 100, 0, 100);
  const complete = progress >= 100;

  return {
    id,
    label,
    targetAmount,
    currentAmount,
    progress,
    status: complete ? 'complete' : previousComplete ? 'active' : 'locked',
    helper,
  };
};

export const evaluateCompass = (rawInputs: CompassInputs): CompassResult => {
  const inputs = normalizeCompassInputs(rawInputs);
  const totalAssets = inputs.cashSavings + inputs.investedAssets;

  const annualIncome = inputs.monthlyIncome * 12;
  const annualExpenses = inputs.monthlyExpenses * 12;
  const annualSavings = annualIncome - annualExpenses;
  const monthlyBalance = inputs.monthlyIncome - inputs.monthlyExpenses;
  const savingsRate = inputs.monthlyIncome > 0 ? (monthlyBalance / inputs.monthlyIncome) * 100 : 0;
  const fireNumber = calculateFireNumber(annualExpenses, inputs.withdrawalRate);
  const yearsToFire = calculateYearsToTargetWithSplit(inputs, annualSavings, fireNumber);
  const achievableFireAge = yearsToFire === null ? null : inputs.currentAge + yearsToFire;
  const cashEmergencyFundMonths = inputs.monthlyExpenses > 0
    ? inputs.cashSavings / inputs.monthlyExpenses
    : 12;
  const emergencyFundMonths = cashEmergencyFundMonths;
  const fireProgress = fireNumber > 0 ? clamp((totalAssets / fireNumber) * 100, 0, 100) : 0;

  const stabilityStatus: StabilityStatus = monthlyBalance < 0
    ? 'deficit'
    : cashEmergencyFundMonths < 1
      ? 'fragile'
      : cashEmergencyFundMonths < 3
        ? 'building'
        : 'steady';

  const oneMonthFund = inputs.monthlyExpenses;
  const threeMonthFund = inputs.monthlyExpenses * 3;
  const sixMonthFund = inputs.monthlyExpenses * 6;
  const oneDayWorkFreedom = Math.max(inputs.monthlyExpenses * 12 * 0.2, 600000);
  const semiRetireTarget = Math.max(fireNumber * 0.5, threeMonthFund);

  const stepsSeed = [
    ['positive-balance', '赤字脱出', 0, monthlyBalance >= 0 ? 1 : 0, 'まず毎月の流出を止める段階です。'] as const,
    ['monthly-buffer', '月1万円の余力', 10000, Math.max(0, monthlyBalance), '小さな黒字は、働き方を軽くする最初の燃料です。'] as const,
    ['emergency-1m', '生活防衛資金1か月', oneMonthFund, inputs.cashSavings, '予定外の出費で崩れない土台を作ります。'] as const,
    ['emergency-3m', '生活防衛資金3か月', threeMonthFund, inputs.cashSavings, '仕事や収入が揺れても考える時間を確保します。'] as const,
    ['invest-start', '少額投資スタート準備', sixMonthFund, inputs.cashSavings, '守りを固めたら、長期・分散・低コストを学び始めます。'] as const,
    ['reduce-work', '週1日分の労働を軽くする', oneDayWorkFreedom, totalAssets, '資産と余力で「働き方の選択肢」を増やします。'] as const,
    ['semi-retire', 'セミリタイア圏', semiRetireTarget, totalAssets, '生活費の一部を資産で支えられる状態です。'] as const,
    ['fire', 'FIRE圏', fireNumber, totalAssets, '働かない選択も現実に入る最終ステージです。'] as const,
  ];

  let previousComplete = true;
  const goalSteps = stepsSeed.map(([id, label, target, current, helper]) => {
    const step = buildGoal(id, label, target, current, helper, previousComplete);
    previousComplete = step.status === 'complete';
    return step;
  });
  const nextGoal = goalSteps.find((step) => step.status === 'active')
    ?? goalSteps[goalSteps.length - 1];

  const missions = buildMissions(inputs, stabilityStatus, monthlyBalance, emergencyFundMonths, nextGoal);
  const recommendedQuests = buildRecommendedQuests(
    inputs,
    stabilityStatus,
    monthlyBalance,
    emergencyFundMonths,
    nextGoal,
  );
  const rpgStatus = buildLifeRpgStatus(inputs, stabilityStatus, savingsRate, emergencyFundMonths, nextGoal);
  const projection = buildProjection(inputs, annualSavings);
  const metricInsights = buildMetricInsights(inputs, monthlyBalance, savingsRate, emergencyFundMonths);
  const story = buildCompassStory(inputs, stabilityStatus, monthlyBalance, savingsRate, emergencyFundMonths, projection, recommendedQuests[0]);

  const headline = stabilityStatus === 'deficit'
    ? '今はFIRE計算より、赤字脱出ミッションが最優先です。'
    : stabilityStatus === 'fragile'
      ? 'まず1か月分の守りを作れば、選択肢が増え始めます。'
      : stabilityStatus === 'building'
        ? '生活防衛ラインを伸ばしながら、少額投資の準備に入れます。'
        : '土台はできています。働き方を軽くする次のステージへ進めます。';

  return {
    annualIncome,
    annualExpenses,
    annualSavings,
    monthlyBalance,
    savingsRate,
    cashSavings: inputs.cashSavings,
    investedAssets: inputs.investedAssets,
    totalAssets,
    fireNumber,
    fireProgress,
    yearsToFire,
    achievableFireAge,
    emergencyFundMonths,
    cashEmergencyFundMonths,
    stabilityStatus,
    headline,
    nextGoal,
    goalSteps,
    missions,
    recommendedQuests,
    rpgStatus,
    projection,
    metricInsights,
    story,
  };
};

const buildCompassStory = (
  inputs: CompassInputs,
  status: StabilityStatus,
  monthlyBalance: number,
  savingsRate: number,
  emergencyFundMonths: number,
  projection: ProjectionPoint[],
  firstMission?: Mission,
): CompassStory => {
  const futureAge = inputs.currentAge >= 60 ? inputs.currentAge + 5 : Math.min(inputs.currentAge + 10, 60);
  const years = Math.max(0, futureAge - inputs.currentAge);
  const baselinePoint = getProjectionAtAge(projection, futureAge);
  const assumedMonthlyImprovement = buildAssumedMonthlyImprovement(monthlyBalance);
  const improvedAnnualSavings = monthlyBalance * 12 + assumedMonthlyImprovement * 12;
  const improvedPoint = simulateSplitRoute(inputs, improvedAnnualSavings, years);
  const estimatedMonthlyInvestmentGain = Math.round((improvedPoint.investedAssets * 0.04) / 12);
  const positionInsight = buildPositionInsight(inputs, monthlyBalance, savingsRate, emergencyFundMonths);
  const improvementLabel = assumedMonthlyImprovement > 0
    ? `月${formatReadableMoney(assumedMonthlyImprovement)}の余力`
    : '今の余力';
  const monthlyGainLabel = formatReadableMoney(estimatedMonthlyInvestmentGain);

  const currentStatusText = status === 'deficit'
    ? '毎月の収支が赤字です。まず、お金が減っていく流れを止めたい状態です。'
    : monthlyBalance < 10000
      ? '毎月ほぼギリギリです。貯金や投資に回せる余力がまだ小さい状態です。'
      : emergencyFundMonths < 3
        ? '毎月お金は残り始めています。次は、急な出費に耐える貯金を育てたい状態です。'
        : '生活の土台はでき始めています。働き方を少し軽くする準備に入れる状態です。';

  const currentStatusHelper = `${positionInsight.helper} 月の余力 ${formatReadableMoney(monthlyBalance)}、貯蓄率 ${savingsRate.toFixed(1)}%、生活防衛資金 ${emergencyFundMonths.toFixed(1)}か月分です。`;

  const baselineFutureText = buildBaselineFutureText(
    inputs,
    status,
    monthlyBalance,
    baselinePoint,
    futureAge,
  );
  const baselineFutureHelper = buildLifeChangeHelper(inputs.currentAge);

  const improvedFutureText = `${improvementLabel}を作って続けると、${futureAge}歳ごろには投資資産が約${formatCurrency(improvedPoint.investedAssets)}。年4%目安なら、お金があなたの代わりに毎月約${monthlyGainLabel}ぶん働いてくれる計算です。`;

  const improvedActionText = firstMission
    ? `次の1手は「${firstMission.title}」です。ここを終えると、家計を軽くする最初の道筋ができます。`
    : '次の1手は、月の余力を作ることです。小さくても、毎月残る形を作ります。';

  return {
    positionLabel: positionInsight.label,
    positionHelper: positionInsight.helper,
    currentStatusText,
    currentStatusHelper,
    baselineFutureText,
    baselineFutureHelper,
    improvedFutureText,
    improvedActionText,
    futureAge,
    futureTotalAssets: improvedPoint.totalAssets,
    futureInvestedAssets: improvedPoint.investedAssets,
    estimatedMonthlyInvestmentGain,
    assumedMonthlyImprovement,
  };
};

const buildAssumedMonthlyImprovement = (monthlyBalance: number) => {
  if (monthlyBalance < 0) return Math.abs(monthlyBalance) + 10000;
  if (monthlyBalance < 10000) return 10000 - monthlyBalance;
  return 0;
};

const buildPositionInsight = (
  inputs: CompassInputs,
  monthlyBalance: number,
  savingsRate: number,
  emergencyFundMonths: number,
) => {
  const benchmark = getBenchmark(inputs.currentAge);
  const medianAssets = benchmark?.medianAssets ?? 1000000;
  const totalAssets = inputs.cashSavings + inputs.investedAssets;
  const assetRatio = medianAssets > 0 ? totalAssets / medianAssets : 0;

  const savingsScore = monthlyBalance < 0
    ? 1
    : savingsRate < 10
      ? 2
      : savingsRate < 20
        ? 3
        : savingsRate < 40
          ? 4
          : 5;
  const defenseScore = emergencyFundMonths < 1
    ? 1
    : emergencyFundMonths < 3
      ? 2
      : emergencyFundMonths < 6
        ? 4
        : 5;
  const assetScore = assetRatio < 0.25
    ? 1
    : assetRatio < 0.75
      ? 2
      : assetRatio < 1.25
        ? 3
        : assetRatio < 2
          ? 4
          : 5;
  const score = savingsScore * 0.45 + defenseScore * 0.35 + assetScore * 0.2;

  const label = score >= 4.5
    ? '100人の村なら上から10番目前後'
    : score >= 3.8
      ? '100人の村なら上から30番目前後'
      : score >= 3
        ? '100人の村ならちょうど50番目あたり'
        : score >= 2.2
          ? '100人の村なら下から30番目前後'
          : '100人の村なら下から10番目前後';

  return {
    label,
    helper: '※ この順位は正確な統計ではなく、貯蓄率・生活防衛資金・同年代の資産目安から独自に算出したざっくりとした目安です。',
  };
};

const buildBaselineFutureText = (
  inputs: CompassInputs,
  status: StabilityStatus,
  monthlyBalance: number,
  baselinePoint: ProjectionPoint,
  futureAge: number,
) => {
  if (status === 'deficit') {
    const monthlyDeficit = Math.abs(monthlyBalance);
    const monthsToCashRunout = monthlyDeficit > 0
      ? Math.floor(inputs.cashSavings / monthlyDeficit)
      : null;
    const runoutText = monthsToCashRunout === null
      ? '貯金が減っていく状態です'
      : monthsToCashRunout <= 0
        ? '貯金だけで見ると、すでに底が見えている状態です'
        : monthsToCashRunout < 12
          ? `貯金だけで見ると、約${monthsToCashRunout}か月で底をつく見込みです`
          : `貯金だけで見ると、約${inputs.currentAge + Math.floor(monthsToCashRunout / 12)}歳ごろに底をつく見込みです`;

    return `このペースだと、${runoutText}。余力がないまま40歳以降や65歳以降の負担変化を迎えると、家計が詰まりやすくなります。`;
  }

  if (monthlyBalance < 10000) {
    return `${futureAge}歳ごろの総資産は約${formatCurrency(baselinePoint.totalAssets)}の目安です。ただ、月の余力が小さいままだと、急な出費や働き方の変化で家計が詰まりやすい状態が続きます。`;
  }

  return `${futureAge}歳ごろには、貯金と投資資産の合計が約${formatCurrency(baselinePoint.totalAssets)}、投資資産が約${formatCurrency(baselinePoint.investedAssets)}の目安です。次はこの流れを崩さないことが大事です。`;
};

const buildLifeChangeHelper = (currentAge: number) => {
  if (currentAge < 40) {
    return '制度メモ: 40歳から介護保険料が始まります。将来の負担は人によって違うため、ここでは「余力がない時に効きやすい変化」として扱います。';
  }

  if (currentAge < 65) {
    return '制度メモ: 65歳以降は働き方や収入が変わる人が増えます。ここでは「今の働き方をずっと続けられる」と決めつけずに見ます。';
  }

  return '制度メモ: 医療費や介護の負担は年齢・所得・地域で変わります。ここでは将来を保証せず、家計の余力を見るための目安にしています。';
};

const formatReadableMoney = (value: number) => {
  const rounded = Math.round(value);
  if (Math.abs(rounded) < 10000) {
    return `${rounded.toLocaleString('ja-JP')}円`;
  }

  return formatCurrency(rounded);
};

const getProjectionAtAge = (projection: ProjectionPoint[], age: number) => {
  return projection.find((point) => point.age === age)
    ?? projection.reduce((nearest, point) => (
      Math.abs(point.age - age) < Math.abs(nearest.age - age) ? point : nearest
    ), projection[projection.length - 1]);
};

const simulateSplitRoute = (
  inputs: CompassInputs,
  annualSavings: number,
  years: number,
): Pick<ProjectionPoint, 'cashSavings' | 'investedAssets' | 'totalAssets'> => {
  const returnRate = inputs.expectedReturnRate / 100;
  const targetCashSavings = inputs.monthlyExpenses * 3;
  let cashSavings = inputs.cashSavings;
  let investedAssets = inputs.investedAssets;

  for (let year = 0; year < years; year++) {
    investedAssets = Math.max(0, investedAssets * (1 + returnRate));
    if (annualSavings >= 0) {
      const cashGap = Math.max(0, targetCashSavings - cashSavings);
      const cashContribution = Math.min(annualSavings, cashGap);
      cashSavings += cashContribution;
      investedAssets += annualSavings - cashContribution;
    } else {
      const cashDrawdown = Math.min(cashSavings, Math.abs(annualSavings));
      cashSavings -= cashDrawdown;
      investedAssets = Math.max(0, investedAssets - (Math.abs(annualSavings) - cashDrawdown));
    }
  }

  return {
    cashSavings: Math.round(cashSavings),
    investedAssets: Math.round(investedAssets),
    totalAssets: Math.round(cashSavings + investedAssets),
  };
};

const createMission = (
  mission: Omit<Mission, 'why' | 'steps' | 'tips' | 'completionChecks'> & Partial<Pick<Mission, 'why' | 'steps' | 'tips' | 'completionChecks'>>,
): Mission => {
  const defaultSteps: Record<QuestCategory, string[]> = {
    saving: [
      '今月の支出を1つだけ選ぶ',
      '金額と使った理由をメモする',
      '減らす、やめる、安い候補に変えるのどれかを決める',
      '次に同じ支出が出る日を確認する',
    ],
    income: [
      '来月も見込める収入候補を1つ書く',
      '必要な時間と準備を確認する',
      '今できる最初の連絡か登録を1つ行う',
    ],
    defense: [
      '生活費1か月分の金額を確認する',
      '使いにくい保存場所を決める',
      '今移せる金額を決める',
      '移した後の残高をメモする',
    ],
    investment: [
      '投資に回しても生活が崩れない金額を確認する',
      'NISAや長期積立の基本を1つ読む',
      'すぐ買わず、疑問点を1つメモする',
    ],
    work: [
      'しんどい作業を3つ書き出す',
      '減らせそうなものを1つ選ぶ',
      '時間、場所、人への相談のどれで軽くできるか考える',
      '今試す小さな行動を1つ決める',
    ],
  };
  const defaultTips: Record<QuestCategory, string[]> = {
    saving: [
      '節約は我慢から始めるより、毎月勝手に出ていくお金から見ると続きやすいです。',
      '今日すぐ解約できなくても、金額を知るだけで次の判断が楽になります。',
      '食費や娯楽を責めるより、固定費を1つ軽くする方が効果が長く残ります。',
    ],
    income: [
      '単発の大きな収入より、来月も見込める小さな収入の方が生活を安定させます。',
      '最初は応募、登録、相談など「収入になる前の準備」で十分です。',
      '疲れすぎる働き方は長続きしないので、時間と体力の負担も一緒に見ます。',
    ],
    defense: [
      '生活防衛資金は、投資ではなく貯金で持つお金です。',
      '別口座や封筒など、すぐ使いにくい場所へ分けると守りやすくなります。',
      'まずは生活費1か月分、次に3か月分が大きな目安です。',
    ],
    investment: [
      '投資は生活防衛資金ができてからで大丈夫です。',
      '銘柄選びより先に、長期・分散・低コストという考え方を確認します。',
      '少額でも、怖くない金額を決めてから始める方が続きやすいです。',
    ],
    work: [
      '仕事を急に辞めるより、まず「何がしんどいか」を分けて見ると動きやすいです。',
      '時間、場所、人間関係、作業内容のどれが重いかを分けると対策が変わります。',
      '働く時間を減らす前に、生活費と余力を数字で見ておくと不安が減ります。',
    ],
  };

  return {
    ...mission,
    why: mission.why ?? `${mission.impact}につながる、今の状態に合う行動です。`,
    steps: mission.steps ?? defaultSteps[mission.category],
    tips: mission.tips ?? defaultTips[mission.category],
    completionChecks: mission.completionChecks ?? [
      '手順を最後まで確認した',
      '今やる行動を1つ決めた',
      '実際に着手した',
    ],
  };
};

const buildMetricInsights = (
  inputs: CompassInputs,
  monthlyBalance: number,
  savingsRate: number,
  emergencyFundMonths: number,
): MetricInsights => {
  const benchmark = getBenchmark(inputs.currentAge);
  const annualBuffer = monthlyBalance * 12;
  const medianSavings = benchmark?.medianSavings ?? 500000;

  const monthlyBuffer: MetricInsight = annualBuffer < 0
    ? {
        label: 'まずはここから',
        helper: '同年代目安との比較より、毎月のマイナスを止めることが先です。',
        tone: 'danger',
      }
    : annualBuffer >= medianSavings * 1.2
      ? {
          label: '同年代目安より高め',
          helper: `年間余力は同年代の貯蓄額目安 ${formatCurrency(medianSavings)} より高めです。`,
          tone: 'good',
        }
      : annualBuffer >= medianSavings * 0.8
        ? {
            label: '同年代目安に近い',
            helper: `年間余力は同年代の貯蓄額目安 ${formatCurrency(medianSavings)} に近い水準です。`,
            tone: 'neutral',
          }
        : {
            label: 'まずはここから',
            helper: `同年代の貯蓄額目安 ${formatCurrency(medianSavings)} へ、少しずつ近づけます。`,
            tone: 'warn',
          };

  const savingsRateInsight: MetricInsight = savingsRate < 0
    ? {
        label: '赤字',
        helper: 'まず支出か収入のどちらかを整えて、0%以上を目指す段階です。',
        tone: 'danger',
      }
    : savingsRate < 10
      ? {
          label: 'これから',
          helper: '貯蓄率10%が見えてくると、生活の立て直しが進みやすくなります。',
          tone: 'warn',
        }
      : savingsRate < 20
        ? {
            label: '安定化中',
            helper: '毎月お金が残る形が育っています。次は20%が目安です。',
            tone: 'neutral',
          }
        : savingsRate < 40
          ? {
              label: 'かなり良い',
              helper: '働き方を少し軽くする選択肢を作りやすい水準です。',
              tone: 'good',
            }
          : {
              label: 'とても強い',
              helper: '生活防衛や将来の自由時間づくりに回せる余力が大きいです。',
              tone: 'good',
            };

  const emergencyFund: MetricInsight = emergencyFundMonths < 1
    ? {
        label: 'まず1か月分',
        helper: '急な出費で崩れにくくするため、生活費1か月分が最初の目安です。',
        tone: 'warn',
      }
    : emergencyFundMonths < 3
      ? {
          label: '生活防衛3か月まであと少し',
          helper: '3か月分が見えると、仕事や収入が揺れた時の考える時間が増えます。',
          tone: 'neutral',
        }
      : emergencyFundMonths < 6
        ? {
            label: '生活防衛6か月を育成中',
            helper: '3か月分は到達済み。投資や働き方見直しの準備に入りやすい状態です。',
            tone: 'good',
          }
        : {
            label: 'かなり安心',
            helper: '生活費6か月分以上の守りがあります。次は自由時間づくりを考えられます。',
            tone: 'good',
          };

  return {
    monthlyBuffer,
    savingsRate: savingsRateInsight,
    emergencyFund,
  };
};

const buildMissions = (
  inputs: CompassInputs,
  status: StabilityStatus,
  monthlyBalance: number,
  emergencyFundMonths: number,
  nextGoal: GoalStep,
): Mission[] => {
  if (status === 'deficit') {
    const gap = Math.ceil(Math.abs(monthlyBalance) / 1000) * 1000;
    return [
      createMission({
        id: 'close-deficit',
        category: 'saving',
        title: `月${formatCurrency(gap)}分の赤字を止める`,
        body: '固定費を1つだけ見直し、まず毎月のマイナスを小さくします。',
        impact: '赤字脱出',
        difficulty: 'boss',
        xp: 80,
        why: '赤字のままだと、投資や貯金より先に生活が苦しくなりやすいからです。',
        completionChecks: ['固定費を1つ選んだ', '金額を確認した', '減らす方法を1つ実行した'],
      }),
      createMission({
        id: 'income-anchor',
        category: 'income',
        title: '最低限の安定収入を1本つくる',
        body: '単発ではなく、来月も見込める収入源を優先します。',
        impact: '不安定さを軽減',
        difficulty: 'normal',
        xp: 60,
      }),
      createMission({
        id: 'no-new-risk',
        category: 'defense',
        title: '投資より生活防衛を優先',
        body: '生活費が足りない間は、値動きのある投資より現金確保を先にします。',
        impact: '守りを固める',
        difficulty: 'easy',
        xp: 30,
      }),
    ];
  }

  if (emergencyFundMonths < 3) {
    return [
      createMission({
        id: 'first-buffer',
        category: 'defense',
        title: `${nextGoal?.label ?? '生活防衛ライン'}へ進む`,
        body: '余ったお金を使い切る前に、先取りで別枠に逃がします。',
        impact: `${Math.round(nextGoal?.progress ?? 0)}%達成中`,
        difficulty: 'normal',
        xp: 50,
      }),
      createMission({
        id: 'small-auto-save',
        category: 'saving',
        title: '月1000円でも自動で貯める',
        body: '金額より、毎月勝手に残る仕組みを先に作ります。',
        impact: '継続力アップ',
        difficulty: 'easy',
        xp: 35,
      }),
      createMission({
        id: 'expense-boss',
        category: 'saving',
        title: '固定費を1つだけ見直す',
        body: '通信費、サブスク、保険、家賃まわりから1つ選びます。',
        impact: '毎月の余力アップ',
        difficulty: 'boss',
        xp: 90,
      }),
    ];
  }

  return [
    createMission({
      id: 'work-light',
      category: 'work',
      title: '働き方の軽さを育てる',
      body: '増えた余力を生活水準ではなく、自由時間の確保に振り分けます。',
      impact: '減労働に近づく',
      difficulty: 'normal',
      xp: 70,
    }),
    ...(inputs.investmentExperience === 'none'
      ? [
          createMission({
            id: 'nisa-start',
            category: 'investment',
            title: 'NISAの始め方を調べる',
            body: '長期・分散・低コストを前提に、少額積立の準備をします。',
            impact: '投資スタート準備',
            difficulty: 'easy',
            xp: 45,
          }),
        ]
      : [
          createMission({
            id: 'investment-review',
            category: 'investment',
            title: '今の投資方針を確認する',
            body: '今の積立額と方針が目的に合っているか、ざっくり確認します。',
            impact: '投資の最適化',
            difficulty: 'normal',
            xp: 45,
          }),
        ]),
    createMission({
      id: 'next-stage',
      category: 'defense',
      title: `${nextGoal?.label ?? '自由な生活'}を次の目的地にする`,
      body: '大きなFIREより、次の段階を進めることに集中します。',
      impact: `${Math.round(nextGoal?.progress ?? 100)}%達成中`,
      difficulty: 'normal',
      xp: 55,
    }),
  ];
};


export const buildRecommendedQuests = (
  inputs: CompassInputs,
  status: StabilityStatus,
  monthlyBalance: number,
  emergencyFundMonths: number,
  nextGoal: GoalStep,
): Mission[] => {
  const base = buildMissions(inputs, status, monthlyBalance, emergencyFundMonths, nextGoal);
  const extra: Mission[] = [];
  const priorityExtra: Mission[] = [];

  if (status === 'deficit') {
    extra.push(
      createMission({
        id: 'subscription-scout',
        category: 'saving',
        title: 'サブスク偵察を10分だけやる',
        body: '解約しなくてもOK。まず「毎月出ていくお金」を一覧にします。',
        impact: '固定費の見直し',
        difficulty: 'easy',
        xp: 25,
      }),
      createMission({
        id: 'no-spend-day',
        category: 'saving',
        title: '買わない日を1日だけ作る',
        body: '気合いで節約ではなく、今日は財布を開かないミニ縛りです。',
        impact: '支出ブレーキ',
        difficulty: 'easy',
        xp: 30,
      }),
    );
  } else if (emergencyFundMonths < 3) {
    extra.push(
      createMission({
        id: 'defense-shield-10000',
        category: 'defense',
        title: '生活防衛資金に1万円を移す',
        body: '別口座や封筒など、使いにくい場所へ移します。',
        impact: '生活防衛資金アップ',
        difficulty: 'normal',
        xp: 55,
      }),
      createMission({
        id: 'phone-plan-check',
        category: 'saving',
        title: '通信費プランを比較する',
        body: '乗り換えまでしなくてOK。今の料金と安い候補を1つ並べます。',
        impact: '固定費の見直し',
        difficulty: 'normal',
        xp: 65,
      }),
    );
  } else {
    // 防衛ライン達成済み: 目的に応じて投資 or 労働軽量化を優先
    const wantsInvestmentFocus = inputs.workReductionGoal === 'fire' || inputs.workReductionGoal === 'semi_retire';
    // 投資経験がない場合のみ NISA の準備状況確認を入れる（経験者は base に investment-review が入るので不要）
    const showNisaCheck = inputs.investmentExperience === 'none';
    
    if (wantsInvestmentFocus) {
      if (showNisaCheck) {
        extra.push(
          createMission({
            id: 'nisa-account-check',
            category: 'investment',
            title: 'NISA口座の準備状況を確認',
            body: '口座の有無、毎月いくらなら怖くないかを確認します。',
            impact: '投資準備',
            difficulty: 'easy',
            xp: 45,
          })
        );
      }
      extra.push(
        createMission({
          id: 'one-shift-freedom',
          category: 'work',
          title: '週1時間減らす条件を考える',
          body: '今すぐ辞めるのではなく、減らせる条件を数字で見ます。',
          impact: '働き方の見直し',
          difficulty: 'normal',
          xp: 70,
        }),
      );
    } else {
      // stabilize / save / reduce_work: 労働軽量化→節約の順
      extra.push(
        createMission({
          id: 'one-shift-freedom',
          category: 'work',
          title: '週1時間減らす条件を考える',
          body: '今すぐ辞めるのではなく、減らせる条件を数字で見ます。',
          impact: '働き方の見直し',
          difficulty: 'normal',
          xp: 70,
        }),
      );
      if (showNisaCheck) {
        extra.push(
          createMission({
            id: 'nisa-account-check',
            category: 'investment',
            title: 'NISA口座の準備状況を確認',
            body: '口座の有無、毎月いくらなら怖くないかを確認します。',
            impact: '投資準備',
            difficulty: 'easy',
            xp: 45,
          })
        );
      }
    }
  }

  // workPain: 高いなら「しんどさの見える化」クエストを「優先追加」
  if (inputs.workPain === 'high') {
    priorityExtra.push(createMission({
      id: 'energy-map',
      category: 'work',
      title: '仕事のしんどさマップを作る',
      body: '何が一番しんどいかを3つ書き出し、減らす順番を決めます。',
      impact: '負担を見える化',
      difficulty: 'easy',
      xp: 40,
    }));
  }

  // investmentExperience: 未経験で防衛3か月超えたら基礎学習を追加
  if (inputs.investmentExperience === 'none' && emergencyFundMonths >= 3) {
    priorityExtra.push(createMission({
      id: 'index-learning',
      category: 'investment',
      title: '長期・分散・低コストを調べる',
      body: '銘柄選びの前に、投資で守る3つのルールを確認します。',
      impact: '投資の基本を確認',
      difficulty: 'easy',
      xp: 35,
    }));
  }

  // savingsExperience: 初心者には「先取り貯金の仕組みを作る」を追加
  if ((inputs.savingsExperience === 'none' || inputs.savingsExperience === 'starting') && status !== 'deficit') {
    priorityExtra.push(createMission({
      id: 'auto-save-setup',
      category: 'saving',
      title: '先取り貯金の仕組みを1つ作る',
      body: '給料日に自動で別口座へ移す設定を入れます。金額は月1000円でも構いません。',
      impact: '貯金が続く仕組みづくり',
      difficulty: 'easy',
      xp: 50,
    }));
  }

  const combined = [...base, ...priorityExtra, ...extra];

  // moneyStress: 高いなら即効性のある「今日1つやる」クエストを一番最初に差し込む
  if (inputs.moneyStress === 'high') {
    const quickWin = createMission({
      id: 'quick-win-today',
      category: 'saving',
      title: '今日1つだけ、支出を書き出す',
      body: '今月一番大きかった支出を1つ書くだけでOKです。把握するだけで次の判断が楽になります。',
      impact: '不安の見える化',
      difficulty: 'easy',
      xp: 20,
    });
    return [quickWin, ...combined].slice(0, 5);
  }

  return combined.slice(0, 5);
};

const buildLifeRpgStatus = (
  inputs: CompassInputs,
  status: StabilityStatus,
  savingsRate: number,
  emergencyFundMonths: number,
  nextGoal: GoalStep,
): LifeRpgStatus => {
  const level = status === 'deficit'
    ? 1
    : emergencyFundMonths < 1
      ? 2
      : emergencyFundMonths < 3
        ? 3
        : savingsRate < 20
          ? 4
          : 5;

  const bossName = status === 'deficit'
    ? '赤字を止める'
    : emergencyFundMonths < 3
      ? '急な出費に備える'
      : inputs.workPain === 'high'
        ? '働く負担を減らす'
        : '固定費の見直し';

  return {
    title: level <= 1
      ? '生活立て直し見習い'
      : level === 2
        ? '余力づくり中'
        : level === 3
          ? '生活防衛を育成中'
          : level === 4
            ? '働き方見直し中'
            : '自由時間ビルダー',
    level,
    stageName: nextGoal.label,
    bossName,
    shieldLabel: `${emergencyFundMonths.toFixed(1)}か月分`,
    shieldProgress: clamp((emergencyFundMonths / 6) * 100, 0, 100),
    workLightnessLabel: inputs.workPain === 'high' ? '重い' : inputs.workPain === 'medium' ? 'ふつう' : '軽め',
    workLightnessProgress: clamp(savingsRate * 2 + emergencyFundMonths * 8, 0, 100),
  };
};

export const selectQuest = (saveData: CompassSaveData, questId: string): CompassSaveData => {
  return {
    ...saveData,
    selectedQuestId: questId,
    diagnosisStep: 'quest',
    questCheckState: {
      ...saveData.questCheckState,
      [questId]: saveData.questCheckState[questId] ?? [],
    },
    lastCheckDate: new Date().toISOString(),
  };
};

export const toggleQuestCheck = (
  saveData: CompassSaveData,
  questId: string,
  checkId: string,
): CompassSaveData => {
  const current = saveData.questCheckState[questId] ?? [];
  const next = current.includes(checkId)
    ? current.filter((id) => id !== checkId)
    : [...current, checkId];

  return {
    ...saveData,
    questCheckState: {
      ...saveData.questCheckState,
      [questId]: next,
    },
    lastCheckDate: new Date().toISOString(),
  };
};

export const completeQuest = (
  saveData: CompassSaveData,
  questId: string,
  requiredCheckIds: string[] = [],
): CompassSaveData => {
  const checkedIds = saveData.questCheckState[questId] ?? [];
  const ready = requiredCheckIds.every((checkId) => checkedIds.includes(checkId));
  if (!ready) {
    return saveData;
  }

  const completedQuestIds = saveData.completedQuestIds.includes(questId)
    ? saveData.completedQuestIds
    : [...saveData.completedQuestIds, questId];

  return {
    ...saveData,
    completedQuestIds,
    selectedQuestId: saveData.selectedQuestId === questId ? null : saveData.selectedQuestId,
    lastCheckDate: new Date().toISOString(),
  };
};

const buildProjection = (inputs: CompassInputs, annualSavings: number): ProjectionPoint[] => {
  const points: ProjectionPoint[] = [];
  const returnRate = inputs.expectedReturnRate / 100;
  const targetCashSavings = inputs.monthlyExpenses * 3;
  let cashSavings = inputs.cashSavings;
  let investedAssets = inputs.investedAssets;

  for (let year = 0; year <= 40; year++) {
    const age = inputs.currentAge + year;
    if (year % 2 === 0 || year === 1 || year === 40) {
      const totalAssets = cashSavings + investedAssets;
      points.push({
        age,
        cashSavings: Math.max(0, Math.round(cashSavings)),
        investedAssets: Math.max(0, Math.round(investedAssets)),
        totalAssets: Math.max(0, Math.round(totalAssets)),
        assets: Math.max(0, Math.round(totalAssets)),
        label: `${age}歳`,
      });
    }

    investedAssets = Math.max(0, investedAssets * (1 + returnRate));
    if (annualSavings >= 0) {
      const cashGap = Math.max(0, targetCashSavings - cashSavings);
      const cashContribution = Math.min(annualSavings, cashGap);
      cashSavings += cashContribution;
      investedAssets += annualSavings - cashContribution;
    } else {
      const cashDrawdown = Math.min(cashSavings, Math.abs(annualSavings));
      cashSavings -= cashDrawdown;
      investedAssets = Math.max(0, investedAssets - (Math.abs(annualSavings) - cashDrawdown));
    }
  }

  return points;
};

const calculateYearsToTargetWithSplit = (
  inputs: CompassInputs,
  annualSavings: number,
  targetAmount: number,
): number | null => {
  if (targetAmount <= 0) return 0;

  const returnRate = inputs.expectedReturnRate / 100;
  const targetCashSavings = inputs.monthlyExpenses * 3;
  let cashSavings = inputs.cashSavings;
  let investedAssets = inputs.investedAssets;

  if (cashSavings + investedAssets >= targetAmount) return 0;
  if (annualSavings <= 0 && investedAssets <= 0) return null;

  for (let year = 1; year <= 100; year++) {
    investedAssets = Math.max(0, investedAssets * (1 + returnRate));
    if (annualSavings >= 0) {
      const cashGap = Math.max(0, targetCashSavings - cashSavings);
      const cashContribution = Math.min(annualSavings, cashGap);
      cashSavings += cashContribution;
      investedAssets += annualSavings - cashContribution;
    } else {
      const cashDrawdown = Math.min(cashSavings, Math.abs(annualSavings));
      cashSavings -= cashDrawdown;
      investedAssets = Math.max(0, investedAssets - (Math.abs(annualSavings) - cashDrawdown));
    }

    if (cashSavings + investedAssets >= targetAmount) {
      return year;
    }
  }

  return null;
};
