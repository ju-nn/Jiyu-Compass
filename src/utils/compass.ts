import {
  calculateFireNumber,
  formatCurrency,
} from './calculations';
import { getBenchmark } from './benchmarks';

export type WorkReductionGoal = '' | 'stabilize' | 'save' | 'reduce_work' | 'semi_retire' | 'fire';
export type ExperienceLevel = '' | 'none' | 'starting' | 'some';
export type StabilityStatus = 'deficit' | 'fragile' | 'building' | 'steady';
export type DiagnosisStep = 'profile' | 'life' | 'result' | 'quest';
export type MoneyStressLevel = '' | 'low' | 'medium' | 'high';
export type WorkPainLevel = '' | 'low' | 'medium' | 'high';
export type QuestCategory = 'saving' | 'income' | 'defense' | 'investment' | 'work';
export type EmploymentType = '' | 'employee' | 'freelance' | 'unstable';
export type HouseholdRiskLevel = '' | 'low' | 'medium' | 'high';
export type WorkFlexibilityLevel = '' | 'none' | 'some' | 'strong';
export type CareerReadinessLevel = '' | 'none' | 'some' | 'ready';
export type CompassDiagnosisType =
  | 'life_defense'
  | 'fixed_cost_review'
  | 'rest_consult'
  | 'in_job_relief'
  | 'career_prepare'
  | 'asset_supported_adjustment'
  | 'semi_retire_ready';

export interface CompassInputs {
  currentAge: number;
  cashSavings: number;
  investedAssets: number;
  /** @deprecated Use cashSavings + investedAssets for new calculations. */
  currentAssets: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  monthlyPensionContribution: number;
  pensionReducedYears: number;
  monthlyStudentLoanPayment: number;
  monthlyHousingLoanPayment: number;
  monthlyCarLoanPayment: number;
  monthlyStableSideIncome: number;
  workReductionGoal: WorkReductionGoal;
  savingsExperience: ExperienceLevel;
  investmentExperience: ExperienceLevel;
  moneyStress: MoneyStressLevel;
  workPain: WorkPainLevel;
  employmentType: EmploymentType;
  householdRisk: HouseholdRiskLevel;
  workFlexibility: WorkFlexibilityLevel;
  careerReadiness: CareerReadinessLevel;
  expectedReturnRate: number;
  withdrawalRate: number;
}

export interface ProjectionPoint {
  age: number;
  cashSavings: number;
  investedAssets: number;
  deficitBalance: number;
  totalAssets: number;
  longTermCarePremium: number;
  pensionIncome: number;
  pensionContributionRelief: number;
  annualLifeChangeImpact: number;
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
  difficulty: 'easy' | 'normal' | 'hard';
  xp: number;
  why: string;
  steps: string[];
  tips: string[];
  completionChecks: string[];
}

export interface LifeStageStatus {
  title: string;
  level: number;
  stageName: string;
  priorityTheme: string;
  safetyMonthsLabel: string;
  safetyProgress: number;
  workLightnessLabel: string;
  workLightnessProgress: number;
}

export interface WithdrawalSupportLine {
  rate: number;
  label: string;
  monthlySupport: number;
  coveragePercent: number;
  note: string;
}

export interface EmergencyFundPlan {
  minMonths: number;
  maxMonths: number;
  targetMinAmount: number;
  targetMaxAmount: number;
  currentMonths: number;
  progressToMin: number;
  stageLabel: string;
  nextMilestoneLabel: string;
  nextMilestoneAmount: number;
  rangeLabel: string;
  reason: string;
}

export interface FreedomScore {
  score: number;
  label: string;
  factors: string[];
}

export interface DiagnosisTypeResult {
  id: CompassDiagnosisType;
  title: string;
  icon: string;
  summary: string;
  reasons: string[];
}

export interface MissionTimeline {
  today: Mission;
  thisWeek: Mission;
  thisMonth: Mission;
}

export interface CompassResult {
  annualIncome: number;
  annualExpenses: number;
  monthlyObligations: number;
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
  diagnosisType: DiagnosisTypeResult;
  emergencyFundPlan: EmergencyFundPlan;
  withdrawalSupport: WithdrawalSupportLine[];
  freedomScore: FreedomScore;
  missionTimeline: MissionTimeline;
  lifeStage: LifeStageStatus;
  projection: ProjectionPoint[];
  metricInsights: MetricInsights;
  pensionEstimate: PensionEstimate;
  story: CompassStory;
  calculationSummary: {
    monthlyExpenses: number;
    monthlyObligations: number;
    effectiveMonthlyExpenses: number;
    annualExpenses: number;
    withdrawalRate: number;
    fireNumber: number;
    totalAssets: number;
    remainingToFire: number;
  };
  inputSummary: {
    investmentExperience: ExperienceLevel;
    workPain: WorkPainLevel;
  };
}

export interface PensionEstimate {
  startAge: number;
  monthlyBasicFullAmount: number;
  monthlyEmployeeExampleAmount: number;
  monthlyBasicLabel: string;
  monthlyEmployeeExampleLabel: string;
  helper: string;
}

export const COMPASS_STORAGE_KEY = 'fireCompass:v1';
const LONG_TERM_CARE_START_AGE = 40;
const LONG_TERM_CARE_PREMIUM_RATE = 0.018;
const PENSION_START_AGE = 65;
const MONTHLY_BASIC_PENSION_FULL_AMOUNT_2026 = 70608;
const EMPLOYEE_PENSION_ACCRUAL_RATE = 0.005481;
const EMPLOYEE_PENSION_FULL_CAREER_MONTHS = 480;

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
  monthlyPensionContribution: 0,
  pensionReducedYears: 0,
  monthlyStudentLoanPayment: 0,
  monthlyHousingLoanPayment: 0,
  monthlyCarLoanPayment: 0,
  monthlyStableSideIncome: 0,
  workReductionGoal: '',
  savingsExperience: '',
  investmentExperience: '',
  moneyStress: '',
  workPain: '',
  employmentType: '',
  householdRisk: '',
  workFlexibility: '',
  careerReadiness: '',
  expectedReturnRate: 4,
  withdrawalRate: 3,
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
    monthlyPensionContribution: Math.max(0, safeNumber(rawInputs.monthlyPensionContribution ?? defaultCompassInputs.monthlyPensionContribution, 0)),
    pensionReducedYears: clamp(Math.round(safeNumber(rawInputs.pensionReducedYears ?? defaultCompassInputs.pensionReducedYears, 0)), 0, 40),
    monthlyStudentLoanPayment: Math.max(0, safeNumber(rawInputs.monthlyStudentLoanPayment ?? defaultCompassInputs.monthlyStudentLoanPayment, 0)),
    monthlyHousingLoanPayment: Math.max(0, safeNumber(rawInputs.monthlyHousingLoanPayment ?? defaultCompassInputs.monthlyHousingLoanPayment, 0)),
    monthlyCarLoanPayment: Math.max(0, safeNumber(rawInputs.monthlyCarLoanPayment ?? defaultCompassInputs.monthlyCarLoanPayment, 0)),
    monthlyStableSideIncome: Math.max(0, safeNumber(rawInputs.monthlyStableSideIncome ?? defaultCompassInputs.monthlyStableSideIncome, 0)),
    workReductionGoal: normalizeChoice(rawInputs.workReductionGoal, ['', 'stabilize', 'save', 'reduce_work', 'semi_retire', 'fire']),
    savingsExperience: normalizeChoice(rawInputs.savingsExperience, ['', 'none', 'starting', 'some']),
    investmentExperience: normalizeChoice(rawInputs.investmentExperience, ['', 'none', 'starting', 'some']),
    moneyStress: normalizeChoice(rawInputs.moneyStress, ['', 'low', 'medium', 'high']),
    workPain: normalizeChoice(rawInputs.workPain, ['', 'low', 'medium', 'high']),
    employmentType: normalizeChoice(rawInputs.employmentType, ['', 'employee', 'freelance', 'unstable']),
    householdRisk: normalizeChoice(rawInputs.householdRisk, ['', 'low', 'medium', 'high']),
    workFlexibility: normalizeChoice(rawInputs.workFlexibility, ['', 'none', 'some', 'strong']),
    careerReadiness: normalizeChoice(rawInputs.careerReadiness, ['', 'none', 'some', 'ready']),
    expectedReturnRate: clamp(safeNumber(rawInputs.expectedReturnRate ?? defaultCompassInputs.expectedReturnRate, 4), -10, 20),
    withdrawalRate: clamp(safeNumber(rawInputs.withdrawalRate ?? defaultCompassInputs.withdrawalRate, 3), 1, 10),
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

const normalizeChoice = <T extends string>(value: unknown, allowed: readonly T[]): T => {
  return allowed.includes(value as T) ? value as T : allowed[0];
};

const calculateMonthlyObligations = (inputs: CompassInputs) => {
  return inputs.monthlyPensionContribution
    + inputs.monthlyStudentLoanPayment
    + inputs.monthlyHousingLoanPayment
    + inputs.monthlyCarLoanPayment;
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
  const monthlyObligations = calculateMonthlyObligations(inputs);
  const effectiveMonthlyExpenses = inputs.monthlyExpenses + monthlyObligations;
  const effectiveMonthlyIncome = inputs.monthlyIncome + inputs.monthlyStableSideIncome;

  const annualIncome = effectiveMonthlyIncome * 12;
  const annualExpenses = effectiveMonthlyExpenses * 12;
  const annualSavings = annualIncome - annualExpenses;
  const monthlyBalance = effectiveMonthlyIncome - effectiveMonthlyExpenses;
  const savingsRate = effectiveMonthlyIncome > 0 ? (monthlyBalance / effectiveMonthlyIncome) * 100 : 0;
  const fireNumber = calculateFireNumber(annualExpenses, inputs.withdrawalRate);
  const yearsToFire = calculateYearsToTargetWithSplit(inputs, annualSavings, fireNumber);
  const achievableFireAge = yearsToFire === null ? null : inputs.currentAge + yearsToFire;
  const cashEmergencyFundMonths = effectiveMonthlyExpenses > 0
    ? inputs.cashSavings / effectiveMonthlyExpenses
    : 12;
  const emergencyFundMonths = cashEmergencyFundMonths;
  const fireProgress = fireNumber > 0 ? clamp((totalAssets / fireNumber) * 100, 0, 100) : 0;
  const emergencyFundPlan = buildEmergencyFundPlan(inputs, effectiveMonthlyExpenses, cashEmergencyFundMonths);
  const withdrawalSupport = buildWithdrawalSupportLines(totalAssets, effectiveMonthlyExpenses, inputs.monthlyStableSideIncome);
  const standardCoveragePercent = withdrawalSupport.find((line) => line.rate === 3)?.coveragePercent ?? 0;

  const stabilityStatus: StabilityStatus = monthlyBalance < 0
    ? 'deficit'
    : cashEmergencyFundMonths < 1
      ? 'fragile'
      : cashEmergencyFundMonths < 3
        ? 'building'
        : 'steady';

  const oneMonthFund = effectiveMonthlyExpenses;
  const threeMonthFund = effectiveMonthlyExpenses * 3;
  const sixMonthFund = effectiveMonthlyExpenses * 6;
  const oneDayWorkFreedom = Math.max(effectiveMonthlyExpenses * 12 * 0.2, 600000);
  const semiRetireTarget = Math.max(fireNumber * 0.5, threeMonthFund);

  const stepsSeed = [
    ['positive-balance', '赤字脱出', 0, monthlyBalance >= 0 ? 1 : 0, 'まず毎月お金が減る流れを止めるところです。'] as const,
    ['monthly-buffer', '月1万円の余力', 10000, Math.max(0, monthlyBalance), '小さな黒字は、働き方を軽くする最初の燃料です。'] as const,
    ['emergency-1m', '急な出費にそなえる貯金1か月', oneMonthFund, inputs.cashSavings, '予定外の出費があっても困りにくい土台を作ります。'] as const,
    ['emergency-3m', '急な出費にそなえる貯金3か月', threeMonthFund, inputs.cashSavings, '仕事や収入が不安定でも考える時間を作ります。'] as const,
    ['invest-start', '少額投資スタート準備', sixMonthFund, inputs.cashSavings, '守りを固めたら、長期・分散・低コストを学び始めます。'] as const,
    ['reduce-work', '週1日分の仕事を軽くする', oneDayWorkFreedom, totalAssets, '資産と余力で、働き方を選びやすくします。'] as const,
    ['semi-retire', '少し働いて暮らせるライン', semiRetireTarget, totalAssets, '生活費の一部を資産で支えられる状態です。'] as const,
    ['fire', '生活費を資産で大きく支えるライン', fireNumber, totalAssets, '完全に辞める判定ではなく、働き方をかなり選びやすい目安です。'] as const,
  ];

  let previousComplete = true;
  const goalSteps = stepsSeed.map(([id, label, target, current, helper]) => {
    const step = buildGoal(id, label, target, current, helper, previousComplete);
    previousComplete = step.status === 'complete';
    return step;
  });
  const nextGoal = goalSteps.find((step) => step.status === 'active')
    ?? goalSteps[goalSteps.length - 1];
  const isFireAchieved = fireNumber > 0 && totalAssets >= fireNumber;
  const isNearFire = !isFireAchieved && fireProgress >= 80;

  const missions = buildMissions(inputs, stabilityStatus, monthlyBalance, emergencyFundMonths, nextGoal);
  const recommendedQuests = buildRecommendedQuests(
    inputs,
    stabilityStatus,
    monthlyBalance,
    emergencyFundMonths,
    nextGoal,
  );
  const freedomScore = buildFreedomScore(inputs, savingsRate, emergencyFundPlan, standardCoveragePercent);
  const diagnosisType = buildDiagnosisType(
    inputs,
    stabilityStatus,
    monthlyBalance,
    emergencyFundPlan,
    standardCoveragePercent,
  );
  const missionTimeline = buildMissionTimeline(inputs, diagnosisType.id, emergencyFundPlan, monthlyBalance);
  const lifeStage = buildLifeStageStatus(inputs, stabilityStatus, savingsRate, emergencyFundMonths, nextGoal);
  const projection = buildProjection(inputs, annualSavings);
  const metricInsights = buildMetricInsights(inputs, monthlyBalance, savingsRate, emergencyFundMonths);
  const pensionEstimate = buildPensionEstimate(inputs);
  const story = buildCompassStory(inputs, stabilityStatus, monthlyBalance, savingsRate, emergencyFundMonths, projection, recommendedQuests[0]);

  const headline = isFireAchieved
    ? '資産が生活費を大きく支える位置です。次は使い方と働き方を決めるところです。'
    : isNearFire
      ? '資産で生活費を支える力がかなり育っています。無理をしすぎず、守りと使い方を確認するところです。'
      : stabilityStatus === 'deficit'
        ? '今は大きな決断より、赤字を止めることが最優先です。'
        : stabilityStatus === 'fragile'
          ? 'まず1か月分の貯金を作れば、選べることが増え始めます。'
          : stabilityStatus === 'building'
            ? '急な出費にそなえる貯金を増やしながら、少額投資の準備に入れます。'
            : '土台はできています。働き方を軽くする次のステージへ進めます。';

  return {
    annualIncome,
    annualExpenses,
    monthlyObligations,
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
    diagnosisType,
    emergencyFundPlan,
    withdrawalSupport,
    freedomScore,
    missionTimeline,
    lifeStage,
    projection,
    metricInsights,
    pensionEstimate,
    story,
    calculationSummary: {
      monthlyExpenses: inputs.monthlyExpenses,
      monthlyObligations,
      effectiveMonthlyExpenses,
      annualExpenses,
      withdrawalRate: inputs.withdrawalRate,
      fireNumber,
      totalAssets,
      remainingToFire: Math.max(0, fireNumber - totalAssets),
    },
    inputSummary: {
      investmentExperience: inputs.investmentExperience,
      workPain: inputs.workPain,
    },
  };
};

const buildEmergencyFundPlan = (
  inputs: CompassInputs,
  effectiveMonthlyExpenses: number,
  currentMonths: number,
): EmergencyFundPlan => {
  let minMonths = inputs.employmentType === 'freelance' || inputs.employmentType === 'unstable' ? 6 : 3;
  let maxMonths = inputs.employmentType === 'freelance' || inputs.employmentType === 'unstable' ? 12 : 6;

  if (inputs.householdRisk === 'medium') {
    minMonths = Math.max(minMonths, 6);
    maxMonths = Math.max(maxMonths, inputs.employmentType === 'employee' ? 9 : 12);
  }

  if (inputs.householdRisk === 'high') {
    minMonths = Math.max(minMonths, inputs.employmentType === 'employee' ? 6 : 9);
    maxMonths = 12;
  }

  if (effectiveMonthlyExpenses <= 0) {
    return {
      minMonths,
      maxMonths,
      targetMinAmount: 0,
      targetMaxAmount: 0,
      currentMonths: 12,
      progressToMin: 100,
      stageLabel: '支出入力待ち',
      nextMilestoneLabel: '月の生活費を入れる',
      nextMilestoneAmount: 0,
      rangeLabel: `${minMonths}〜${maxMonths}か月分`,
      reason: '生活費が入ると、働き方や家計リスクに合わせたレンジを出します。',
    };
  }

  const cash = inputs.cashSavings;
  const milestones = [
    { label: 'まず1万円', amount: 10000 },
    { label: '次に3万円', amount: 30000 },
    { label: '10万円の小さな防壁', amount: 100000 },
    { label: '生活費0.5か月分', amount: effectiveMonthlyExpenses * 0.5 },
    { label: '生活費1か月分', amount: effectiveMonthlyExpenses },
    { label: `下限レンジ${minMonths}か月分`, amount: effectiveMonthlyExpenses * minMonths },
    { label: `安心寄り${maxMonths}か月分`, amount: effectiveMonthlyExpenses * maxMonths },
  ];
  const nextMilestone = milestones.find((milestone) => cash < milestone.amount) ?? milestones[milestones.length - 1];
  const targetMinAmount = effectiveMonthlyExpenses * minMonths;
  const targetMaxAmount = effectiveMonthlyExpenses * maxMonths;
  const employmentText = inputs.employmentType === 'freelance'
    ? 'フリーランス・自営業寄りなので、収入変動に備えて厚めに見ます。'
    : inputs.employmentType === 'unstable'
      ? '収入が揺れやすい前提なので、会社員標準より厚めに見ます。'
      : '会社員・公務員寄りの目安として、まず3〜6か月分を基準にします。';
  const householdText = inputs.householdRisk === 'high'
    ? '子ども、単一収入、高家賃、ローンなどの重さがあるため上限寄りです。'
    : inputs.householdRisk === 'medium'
      ? '家族や固定費の重さを少し見込んで、やや厚めにしています。'
      : '大きな上振れ要因は未入力なので、標準レンジで見ています。';

  return {
    minMonths,
    maxMonths,
    targetMinAmount,
    targetMaxAmount,
    currentMonths,
    progressToMin: clamp((cash / targetMinAmount) * 100, 0, 100),
    stageLabel: buildEmergencyStageLabel(cash, effectiveMonthlyExpenses, minMonths, currentMonths),
    nextMilestoneLabel: nextMilestone.label,
    nextMilestoneAmount: Math.max(0, Math.ceil((nextMilestone.amount - cash) / 1000) * 1000),
    rangeLabel: `${minMonths}〜${maxMonths}か月分`,
    reason: `${employmentText}${householdText}`,
  };
};

const buildEmergencyStageLabel = (
  cashSavings: number,
  monthlyExpenses: number,
  minMonths: number,
  currentMonths: number,
) => {
  if (cashSavings < 10000) return 'はじめの足場づくり';
  if (cashSavings < 30000) return '1万円を越えたところ';
  if (cashSavings < 100000) return '小さな防壁づくり';
  if (currentMonths < 0.5) return 'ミニ防衛の途中';
  if (currentMonths < 1) return '生活費1か月分の手前';
  if (currentMonths < minMonths) return `下限${minMonths}か月分へ向かう途中`;
  if (monthlyExpenses > 0) return '下限レンジに到達';
  return '支出入力待ち';
};

const buildWithdrawalSupportLines = (
  totalAssets: number,
  effectiveMonthlyExpenses: number,
  monthlyStableSideIncome: number,
): WithdrawalSupportLine[] => {
  const lines = [
    { rate: 2.5, label: '保守的な目安', note: '長期・為替・税制のブレを厚めに見ます。' },
    { rate: 3, label: '標準寄りの目安', note: 'この診断の主な参考線です。' },
    { rate: 3.5, label: 'やや攻めた目安', note: '支出調整や働く余地がある人向けの確認線です。' },
    { rate: 4, label: '米国過去データの参考線', note: '米国過去データの参考線です。日本の税制・為替・長期リスクを完全には反映しません。' },
  ];

  return lines.map((line) => {
    const monthlySupport = Math.round((totalAssets * (line.rate / 100)) / 12);
    const totalSupport = monthlySupport + monthlyStableSideIncome;
    return {
      ...line,
      monthlySupport,
      coveragePercent: effectiveMonthlyExpenses > 0
        ? clamp((totalSupport / effectiveMonthlyExpenses) * 100, 0, 999)
        : 0,
    };
  });
};

const buildFreedomScore = (
  inputs: CompassInputs,
  savingsRate: number,
  emergencyFundPlan: EmergencyFundPlan,
  standardCoveragePercent: number,
): FreedomScore => {
  const balanceScore = clamp((savingsRate + 10) * 2, 0, 100);
  const defenseScore = emergencyFundPlan.progressToMin;
  const assetScore = clamp(standardCoveragePercent * 1.4, 0, 100);
  const workPainScore = inputs.workPain === 'high' ? 20 : inputs.workPain === 'medium' ? 55 : inputs.workPain === 'low' ? 80 : 60;
  const flexScore = inputs.workFlexibility === 'strong' ? 90 : inputs.workFlexibility === 'some' ? 70 : inputs.workFlexibility === 'none' ? 35 : 55;
  const score = Math.round(balanceScore * 0.22 + defenseScore * 0.28 + assetScore * 0.25 + workPainScore * 0.15 + flexScore * 0.10);
  const factors: string[] = [];

  if (defenseScore < 100) factors.push('生活防衛資金が下限レンジの途中');
  if (standardCoveragePercent >= 30) factors.push('資産が生活費の一部を支え始めている');
  if (savingsRate < 0) factors.push('毎月の収支がマイナス');
  if (savingsRate >= 20) factors.push('毎月の余力が比較的大きい');
  if (inputs.workPain === 'high') factors.push('仕事のしんどさが自由度を下げている');
  if (inputs.workFlexibility === 'strong' || inputs.workFlexibility === 'some') factors.push('在職のまま負荷を下げる余地がある');

  return {
    score,
    label: score >= 80
      ? '選択肢を広げやすい'
      : score >= 60
        ? '少し動かしやすい'
        : score >= 40
          ? '土台を整える途中'
          : 'まず守りを作る',
    factors: factors.slice(0, 3),
  };
};

const buildDiagnosisType = (
  inputs: CompassInputs,
  status: StabilityStatus,
  monthlyBalance: number,
  emergencyFundPlan: EmergencyFundPlan,
  standardCoveragePercent: number,
): DiagnosisTypeResult => {
  const highWorkPain = inputs.workPain === 'high' || inputs.moneyStress === 'high';
  const hasInternalOption = inputs.workFlexibility === 'some' || inputs.workFlexibility === 'strong';
  const careerReady = inputs.careerReadiness === 'some' || inputs.careerReadiness === 'ready';

  if (highWorkPain && (inputs.workPain === 'high' || inputs.moneyStress === 'high')) {
    return diagnosis('rest_consult', [
      '仕事やお金のしんどさが強めに出ています。',
      '副業や退職判断より、休息・制度確認・相談を先に置く方が安全です。',
    ]);
  }

  if (emergencyFundPlan.currentMonths < 1 || inputs.cashSavings < 100000) {
    return diagnosis('life_defense', [
      'すぐ使える貯金がまだ薄めです。',
      `次は${emergencyFundPlan.nextMilestoneLabel}を目指すと、急な支出への耐性が増えます。`,
    ]);
  }

  if (status === 'deficit' || monthlyBalance < 10000) {
    return diagnosis('fixed_cost_review', [
      '毎月の余力が小さいため、先に固定費を軽くする効果が大きい状態です。',
      '通信・サブスクのような小さな改善と、住居・保険の大きな改善を分けて見ると動きやすいです。',
    ]);
  }

  if (standardCoveragePercent >= 80 && emergencyFundPlan.progressToMin >= 100) {
    return diagnosis('semi_retire_ready', [
      '資産が生活費の大きな部分を支える目安です。',
      '完全に働かない前提ではなく、少し働く案や支出調整も合わせて見る段階です。',
    ]);
  }

  if (standardCoveragePercent >= 30 || inputs.monthlyStableSideIncome > 0) {
    return diagnosis('asset_supported_adjustment', [
      '資産や安定収入が生活費の一部を支え始めています。',
      '働く量を少し下げる、週4や短時間勤務を試算する余地があります。',
    ]);
  }

  if (hasInternalOption && inputs.workPain !== 'low') {
    return diagnosis('in_job_relief', [
      '今の会社の中で負荷を下げる余地がありそうです。',
      '有給、残業整理、在宅勤務、時差出勤、業務量調整から順番に見るのが現実的です。',
    ]);
  }

  if (careerReady && emergencyFundPlan.currentMonths >= 3) {
    return diagnosis('career_prepare', [
      '生活防衛資金が少しあり、在職中に次の選択肢を作りやすい状態です。',
      '退職より先に、求人保存・職務経歴書・面談準備を進めると焦りにくくなります。',
    ]);
  }

  return diagnosis('fixed_cost_review', [
    '毎月の余力を少し増やすと、働き方の選択肢が見えやすくなります。',
    'まずは今日できる固定費の棚卸しから始めるのが軽い一手です。',
  ]);
};

const diagnosis = (id: CompassDiagnosisType, reasons: string[]): DiagnosisTypeResult => {
  const map: Record<CompassDiagnosisType, Omit<DiagnosisTypeResult, 'id' | 'reasons'>> = {
    life_defense: {
      title: 'まず生活防衛タイプ',
      icon: 'shield',
      summary: '退職や投資の前に、急な出費に耐える足場を作る位置です。',
    },
    fixed_cost_review: {
      title: '固定費見直しタイプ',
      icon: 'sliders',
      summary: '毎月の固定費を1つ軽くすると、自由度が上がりやすい位置です。',
    },
    rest_consult: {
      title: '休息・相談優先タイプ',
      icon: 'heart',
      summary: '大きな決断より先に、休む・相談する・制度を確認する位置です。',
    },
    in_job_relief: {
      title: '在職で負荷軽減タイプ',
      icon: 'briefcase',
      summary: '今の収入を守りながら、働く時間や場所を1段軽くする位置です。',
    },
    career_prepare: {
      title: '転職準備先行タイプ',
      icon: 'map',
      summary: '辞める前に、次の仕事の条件と準備を整える位置です。',
    },
    asset_supported_adjustment: {
      title: '資産補完で働き方調整タイプ',
      icon: 'coins',
      summary: '資産や安定収入を補助輪にして、働き方を少し調整できる位置です。',
    },
    semi_retire_ready: {
      title: 'セミリタイア準備タイプ',
      icon: 'compass',
      summary: '完全FIREの断定ではなく、生活費の一部を資産で支える設計を詰める位置です。',
    },
  };

  return {
    id,
    ...map[id],
    reasons,
  };
};

const buildMissionTimeline = (
  inputs: CompassInputs,
  diagnosisType: CompassDiagnosisType,
  emergencyFundPlan: EmergencyFundPlan,
  monthlyBalance: number,
): MissionTimeline => {
  if (diagnosisType === 'rest_consult') {
    return {
      today: createMission({
        id: 'today-rest-signal',
        category: 'work',
        title: '今日: 年休・残業・休職制度を1つ確認する',
        body: '辞めるか続けるかの判断は急がず、まず使える制度を1つだけ見ます。',
        impact: '休息の入口を作る',
        difficulty: 'easy',
      }),
      thisWeek: createMission({
        id: 'week-consult-slot',
        category: 'work',
        title: '今週: 上司・人事・公的窓口の相談先を1つ決める',
        body: 'こころの耳や労働条件相談ほっとラインなど、外部の相談先も候補に入れます。',
        impact: '抱え込みを減らす',
        difficulty: 'normal',
      }),
      thisMonth: createMission({
        id: 'month-load-reset',
        category: 'work',
        title: '今月: 業務量・締切・担当の調整を相談する',
        body: '副業や転職を増やす前に、まず本業の負荷を1段下げる相談をします。',
        impact: '仕事の負荷を下げる',
        difficulty: 'normal',
      }),
    };
  }

  if (diagnosisType === 'life_defense') {
    return {
      today: createMission({
        id: 'today-subscription-stop',
        category: 'saving',
        title: '今日: 使っていないサブスクを1つ止める',
        body: 'まず小さく、毎月の漏れを1つ止めます。',
        impact: '固定費の即効改善',
        difficulty: 'easy',
      }),
      thisWeek: createMission({
        id: 'week-defense-transfer',
        category: 'defense',
        title: `今週: ${emergencyFundPlan.nextMilestoneLabel}へ近づける`,
        body: emergencyFundPlan.nextMilestoneAmount > 0
          ? `あと${formatCurrency(emergencyFundPlan.nextMilestoneAmount)}で次の段階です。金額は小さくて大丈夫です。`
          : '次の段階に届いています。別口座に分けて守ります。',
        impact: '生活防衛資金を育てる',
        difficulty: 'normal',
      }),
      thisMonth: createMission({
        id: 'month-fixed-cost-review',
        category: 'saving',
        title: '今月: 通信費・保険・住居費を順番に点検する',
        body: '通信は今日できる小さな改善、保険と住居は大きく効く改善として分けて見ます。',
        impact: '固定費の土台改善',
        difficulty: 'hard',
      }),
    };
  }

  if (diagnosisType === 'in_job_relief') {
    return {
      today: createMission({
        id: 'today-paid-leave-check',
        category: 'work',
        title: '今日: 有給残日数と直近の残業時間を確認する',
        body: '最初の一手は、体力を増やすより負荷を見える化することです。',
        impact: '働き方の棚卸し',
        difficulty: 'easy',
      }),
      thisWeek: createMission({
        id: 'week-remote-flex-talk',
        category: 'work',
        title: '今週: 在宅・時差出勤・業務量調整を相談する',
        body: '退職より先に、今の会社の中で軽くできる選択肢を使います。',
        impact: '在職で負荷軽減',
        difficulty: 'normal',
      }),
      thisMonth: createMission({
        id: 'month-role-change-check',
        category: 'work',
        title: '今月: 異動・職種変更・短時間正社員の余地を見る',
        body: '週4勤務や時短は、制度や会社ごとの差が大きいので確認から始めます。',
        impact: '働き方の選択肢を増やす',
        difficulty: 'hard',
      }),
    };
  }

  if (diagnosisType === 'career_prepare') {
    return {
      today: createMission({
        id: 'today-career-note',
        category: 'work',
        title: '今日: しんどい条件と残したい条件を3つずつ書く',
        body: '求人を見る前に、避けたい負荷を言葉にします。',
        impact: '転職条件の整理',
        difficulty: 'easy',
      }),
      thisWeek: createMission({
        id: 'week-job-save',
        category: 'work',
        title: '今週: 在宅勤務・残業少なめの求人を保存する',
        body: '応募は急がず、在職中に比較対象を作ります。',
        impact: '退職前の準備',
        difficulty: 'normal',
      }),
      thisMonth: createMission({
        id: 'month-resume-meeting',
        category: 'work',
        title: '今月: 職務経歴書を更新し、面談を1件入れる',
        body: '退職を最後の選択肢にするため、先に逃げ道を作ります。',
        impact: '転職準備を前進',
        difficulty: 'normal',
      }),
    };
  }

  if (diagnosisType === 'asset_supported_adjustment' || diagnosisType === 'semi_retire_ready') {
    const supportText = inputs.monthlyStableSideIncome > 0
      ? `安定収入${formatCurrency(inputs.monthlyStableSideIncome)}/月も合わせて見ます。`
      : '月5万円、月10万円の安定収入がある場合も並べて見ます。';
    return {
      today: createMission({
        id: 'today-support-check',
        category: 'investment',
        title: '今日: 資産が生活費を支える月額を確認する',
        body: '2.5%、3.0%、3.5%のレンジで、無理のない支え方を見ます。',
        impact: '資産カバー率の確認',
        difficulty: 'easy',
      }),
      thisWeek: createMission({
        id: 'week-work-ratio-plan',
        category: 'work',
        title: '今週: 何割働くかの案を2つ作る',
        body: supportText,
        impact: '働き方調整の試算',
        difficulty: 'normal',
      }),
      thisMonth: createMission({
        id: 'month-withdrawal-guardrail',
        category: 'investment',
        title: '今月: 暴落時に減らす支出を3つ決める',
        body: '4%を安全な答えにせず、支出を調整できる余地も一緒に作ります。',
        impact: '取り崩しリスクの確認',
        difficulty: 'hard',
      }),
    };
  }

  return {
    today: createMission({
      id: 'today-fixed-cost-list',
      category: 'saving',
      title: '今日: 固定費を5つに分けて書き出す',
      body: '住居費、保険、通信、サブスク、光熱費を並べます。',
      impact: '固定費の見える化',
      difficulty: 'easy',
    }),
    thisWeek: createMission({
      id: 'week-phone-plan',
      category: 'saving',
      title: '今週: 通信プランを見直す',
      body: '小さくても毎月効く改善から始めます。',
      impact: '今日できる改善',
      difficulty: 'normal',
    }),
    thisMonth: createMission({
      id: 'month-housing-insurance',
      category: 'saving',
      title: '今月: 保険・家賃・ローンを点検する',
      body: monthlyBalance < 10000
        ? '余力が小さいので、大きく効く固定費も候補に入れます。'
        : 'すぐ変えなくても、更新月や見直し時期を確認します。',
      impact: '大きく効く改善',
      difficulty: 'hard',
    }),
  };
};

const buildPensionEstimate = (inputs: CompassInputs): PensionEstimate => {
  const payableYears = Math.max(0, 40 - inputs.pensionReducedYears);
  const monthlyBasicAmount = Math.round(
    MONTHLY_BASIC_PENSION_FULL_AMOUNT_2026 * (payableYears / 40),
  );
  const monthlyBasicLabel = formatReadableMoney(monthlyBasicAmount);
  const estimatedMonthlyEmployeePension = Math.round(
    monthlyBasicAmount
    + ((inputs.monthlyIncome * EMPLOYEE_PENSION_ACCRUAL_RATE * EMPLOYEE_PENSION_FULL_CAREER_MONTHS) / 12),
  );
  const monthlyEmployeeExampleLabel = formatReadableMoney(estimatedMonthlyEmployeePension);
  const helper = inputs.pensionReducedYears > 0
    ? `ざっくり確認用です。年金が少なくなりそうな期間を${inputs.pensionReducedYears}年として入れています。正確な金額は「ねんきん定期便」で確認できます。`
    : `ざっくり確認用です。実際の金額は、払った期間や給与で変わります。正確な金額は「ねんきん定期便」で確認できます。`;

  return {
    startAge: PENSION_START_AGE,
    monthlyBasicFullAmount: monthlyBasicAmount,
    monthlyEmployeeExampleAmount: estimatedMonthlyEmployeePension,
    monthlyBasicLabel,
    monthlyEmployeeExampleLabel,
    helper,
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
  const estimatedMonthlyInvestmentGain = Math.round((improvedPoint.totalAssets * 0.03) / 12);
  const positionInsight = buildPositionInsight(inputs, monthlyBalance, savingsRate, emergencyFundMonths);
  const monthlyGainLabel = formatReadableMoney(estimatedMonthlyInvestmentGain);

  const currentStatusText = status === 'deficit'
    ? '毎月の収支が赤字です。まず、お金が減っていく流れを止めたい状態です。'
    : monthlyBalance < 10000
      ? '毎月ほぼギリギリです。貯金や投資に回せる余力がまだ小さい状態です。'
      : emergencyFundMonths < 3
        ? '毎月お金は残り始めています。次は、急な出費に耐える貯金を育てたい状態です。'
        : '生活の土台はでき始めています。働き方を少し軽くする準備に入れる状態です。';

  const currentStatusHelper = `月に残るお金は${formatReadableMoney(monthlyBalance)}、貯蓄率は${savingsRate.toFixed(1)}%、急な出費にそなえる貯金は${emergencyFundMonths.toFixed(1)}か月分です。`;

  const baselineFutureText = buildBaselineFutureText(
    inputs,
    status,
    monthlyBalance,
    baselinePoint,
    futureAge,
  );
  const baselineFutureHelper = buildLifeChangeHelper(inputs.currentAge);

  const improvedFutureText = buildImprovedFutureText(
    monthlyBalance,
    assumedMonthlyImprovement,
    futureAge,
    improvedPoint.investedAssets,
    monthlyGainLabel,
  );

  const improvedActionText = buildImprovedActionText(firstMission);

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

const buildImprovedFutureText = (
  monthlyBalance: number,
  assumedMonthlyImprovement: number,
  futureAge: number,
  investedAssets: number,
  monthlyGainLabel: string,
) => {
  const futureBalance = monthlyBalance + assumedMonthlyImprovement;
  const futureSummary = `${futureAge}歳ごろには投資資産が約${formatCurrency(investedAssets)}。3.0%の取り崩し目安なら、生活費の一部を毎月約${monthlyGainLabel}ぶん支えられる計算です。`;

  if (monthlyBalance < 0) {
    return `まず赤字を止めて、月${formatReadableMoney(Math.max(0, futureBalance))}残る形まで戻せると、${futureSummary}`;
  }

  if (monthlyBalance < 10000) {
    return `月${formatReadableMoney(assumedMonthlyImprovement)}上積みして、月1万円残る形にできると、${futureSummary}`;
  }

  return `今の余力を守って続けると、${futureSummary}`;
};

const buildImprovedActionText = (firstMission?: Mission) => {
  if (!firstMission) {
    return '次の1手は、月の余力を作ることです。小さくても、毎月残る形を作ります。';
  }

  const categoryText: Record<QuestCategory, string> = {
    saving: '毎月出ていくお金を少し軽くし、赤字やギリギリ感を減らしやすくなります。',
    income: '来月も見込める収入の支えを作り、生活の不安定さを減らしやすくなります。',
    defense: '急な出費に耐える土台を作り、次の判断を落ち着いて選びやすくなります。',
    investment: '投資や資産の使い方を、生活を壊さない範囲で考えやすくなります。',
    work: 'お金の余力を、自由時間や働き方の見直しに回す判断がしやすくなります。',
  };

  return `次の1手は「${firstMission.title}」です。${categoryText[firstMission.category]}`;
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
    : 1 + (clamp(savingsRate, 0, 50) / 50) * 4;
  const defenseScore = 1 + (clamp(emergencyFundMonths, 0, 6) / 6) * 4;
  const assetScore = 1 + (clamp(assetRatio, 0, 2.5) / 2.5) * 4;
  const score = savingsScore * 0.45 + defenseScore * 0.35 + assetScore * 0.2;
  const rawRank = 95 - ((score - 1) / 4) * 90;
  const rank = clamp(Math.round(rawRank / 5) * 5, 5, 95);
  const label = rank === 50
    ? '100人の村ならちょうど50番目あたり'
    : `100人の村なら上から${rank}番目あたり`;

  return {
    label,
    helper: '正確な順位ではありません。貯蓄率、急な出費用の貯金、同じ年代の資産目安を合わせた5人きざみの目安です。',
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
    return '年齢で変わるお金: 40歳から介護保険料が支出に増える可能性があります。金額は人によって違うので、この診断では「毎月の余力が減りやすい年齢イベント」としてだけ反映します。';
  }

  if (currentAge < 65) {
    return '年齢で変わるお金: 65歳から公的年金を受け取れる可能性があります。実際の金額は払った期間や給与で変わるので、ここでは生活の余力を見るための目安にしています。';
  }

  return '年齢で変わるお金: 医療費負担や介護のお金は、年齢・収入・住む場所で変わります。ここでは将来を約束せず、家計の余裕を見るための目安にしています。';
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
  const targetCashSavings = (inputs.monthlyExpenses + calculateMonthlyObligations(inputs)) * 3;
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
  mission: Omit<Mission, 'why' | 'steps' | 'tips' | 'completionChecks' | 'xp'> & Partial<Pick<Mission, 'why' | 'steps' | 'tips' | 'completionChecks' | 'xp'>>,
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
      '急な出費にそなえるお金は、投資ではなく貯金で持つお金です。',
      '別口座や封筒など、すぐ使いにくい場所へ分けると守りやすくなります。',
      'まずは生活費1か月分、次に3か月分が大きな目安です。',
    ],
    investment: [
      '投資は急な出費にそなえる貯金ができてからで大丈夫です。',
      'どの投資先を選ぶかより先に、長く続ける・分けて買う・手数料を低くする、という考え方を確認します。',
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
    xp: mission.xp ?? 40,
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
        helper: '同じ年代とのくらべ方より、毎月のマイナスを止めることが先です。',
        tone: 'danger',
      }
    : annualBuffer >= medianSavings * 1.2
      ? {
          label: '同じ年代の目安より高め',
          helper: `1年で残るお金は、同じ年代の貯金額目安 ${formatCurrency(medianSavings)} より高めです。`,
          tone: 'good',
        }
      : annualBuffer >= medianSavings * 0.8
        ? {
            label: '同じ年代の目安に近い',
            helper: `1年で残るお金は、同じ年代の貯金額目安 ${formatCurrency(medianSavings)} に近いです。`,
            tone: 'neutral',
          }
        : {
            label: 'まずはここから',
            helper: `同じ年代の貯金額目安 ${formatCurrency(medianSavings)} へ、少しずつ近づけます。`,
            tone: 'warn',
          };

  const savingsRateInsight: MetricInsight = savingsRate < 0
    ? {
        label: '赤字',
        helper: 'まず支出か収入のどちらかを整えて、0%以上を目指すところです。',
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
              helper: '働き方を少し軽くする道を作りやすい状態です。',
              tone: 'good',
            }
          : {
              label: 'とても強い',
              helper: '急な出費へのそなえや、将来の自由時間づくりに回せるお金が大きいです。',
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
          label: '3か月分の貯金まであと少し',
          helper: '3か月分が見えると、仕事や収入が揺れた時の考える時間が増えます。',
          tone: 'neutral',
        }
      : emergencyFundMonths < 6
        ? {
            label: '6か月分の貯金を育てています',
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
        difficulty: 'hard',
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
        title: '投資より貯金を優先',
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
        title: `${nextGoal?.label ?? '急な出費にそなえる貯金'}へ進む`,
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
        id: 'fixed-cost-review',
        category: 'saving',
        title: '固定費を1つだけ見直す',
        body: '通信費、サブスク、保険、家賃まわりから1つ選びます。',
        impact: '毎月の余力アップ',
        difficulty: 'hard',
        xp: 90,
      }),
    ];
  }

  if (nextGoal.id === 'fire' && nextGoal.status === 'complete') {
    return [
      createMission({
        id: 'withdrawal-plan',
        category: 'investment',
        title: '資産の使い方を1枚にまとめる',
        body: '1年の生活費、現金で持つ年数、投資が大きく下がった時に減らす支出を先に決めます。',
        impact: '資産生活の安定化',
        difficulty: 'normal',
        xp: 90,
        why: '目標額に届いた後は、増やし方より「使い方」と「守り方」が生活の安心に効くからです。',
        steps: [
          '1年の生活費と、資産を使う割合を確認する',
          '現金で何か月分持つか決める',
          '投資が下がった年に減らす支出を3つ書く',
          '働く・働かないを決める条件を1つ書く',
        ],
        tips: [
          '資産が大きく育った後も、生活費6か月から2年分の現金を持つと判断の余白が増えます。',
          '完全に働かない前提だけでなく、好きな仕事を少し残す案も比較すると現実味が増します。',
          '投資は目安どおりに増えないことがあります。悪い年の行動を先に決めておくと慌てにくいです。',
        ],
        completionChecks: ['1年の生活費を書いた', '現金で持つ金額を決めた', '投資が下がった時の支出ルールを決めた'],
      }),
      createMission({
        id: 'fire-life-test',
        category: 'work',
        title: '仕事を減らした1週間を試す',
        body: '休みの日や有休で、理想の時間割と支出が本当に合うか小さく試します。',
        impact: '暮らし方の確認',
        difficulty: 'easy',
        xp: 60,
      }),
      createMission({
        id: 'risk-bucket-check',
        category: 'defense',
        title: '生活費の現金バケツを確認する',
        body: '投資資産とは別に、すぐ使えるお金が十分あるか見ます。',
        impact: '投資が下がった時の安心',
        difficulty: 'easy',
        xp: 55,
      }),
    ];
  }

  if (nextGoal.id === 'fire' && nextGoal.progress >= 80) {
    return [
      createMission({
        id: 'near-fire-risk-review',
        category: 'investment',
        title: '資産生活に入る前の守りを点検する',
        body: '目標額に近い時期ほど、投資が下がる場合と生活費の見込みを確認します。',
        impact: '資産生活前の安定化',
        difficulty: 'normal',
        xp: 80,
        why: '資産が生活費を大きく支える時期は、貯める力だけでなく、投資が大きく下がる時や予定外の支出で計画がくずれないかの確認が大事だからです。',
        steps: [
          '生活費を少なく見すぎていないか見る',
          '生活費6か月分以上の現金があるか確認する',
          '投資に回している割合が怖すぎないか確認する',
          '仕事を減らす時期を1年遅らせる場合の安心度も見る',
        ],
        tips: [
          '目標額の少しの差より、生活費の見込み違いの方が大きく効くことがあります。',
          '退職や仕事を減らす前に、健康保険や税金など退職後に増える支払いを確認すると安心です。',
          '一気に仕事をゼロにせず、少し働いて暮らす案もくらべられます。',
        ],
        completionChecks: ['生活費を見直した', '現金の守りを確認した', '退職後に増える支払いを1つ調べた'],
      }),
      createMission({
        id: 'side-fire-option',
        category: 'work',
        title: '少し働く案も比較する',
        body: '月5万円から10万円の好きな仕事がある場合、必要資産がどれだけ軽くなるか見ます。',
        impact: '選べる道を増やす',
        difficulty: 'easy',
        xp: 55,
      }),
      createMission({
        id: 'investment-policy-note',
        category: 'investment',
        title: '投資のルールを短く書く',
        body: '積立、資産の使い方、投資が下がった時にやらないことをメモにします。',
        impact: '迷いを減らす',
        difficulty: 'easy',
        xp: 50,
      }),
    ];
  }

  return [
    createMission({
      id: 'work-light',
      category: 'work',
      title: '働き方の軽さを育てる',
      body: '増えた余力を生活水準ではなく、自由時間の確保に振り分けます。',
      impact: '仕事を軽くする',
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
            title: '今の投資ルールを確認する',
            body: '今の積立額と方針が目的に合っているか、ざっくり確認します。',
            impact: '投資を見直す',
            difficulty: 'normal',
            xp: 45,
          }),
        ]),
    createMission({
      id: 'next-stage',
      category: 'defense',
      title: `${nextGoal?.label ?? '自由な生活'}を次の目的地にする`,
      body: '大きな目標だけを追わず、次の小さな目標を進めることに集中します。',
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
        title: '急な出費用の貯金に1万円を移す',
        body: '別口座や封筒など、使いにくい場所へ移します。',
        impact: '急な出費へのそなえアップ',
        difficulty: 'normal',
        xp: 55,
      }),
      createMission({
        id: 'phone-plan-check',
        category: 'saving',
        title: '通信費プランを比較する',
        body: '乗り換えまでしなくてOK。今の料金と安い案を1つ並べます。',
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
      body: 'どの投資先を選ぶか決める前に、投資で守る3つのルールを確認します。',
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

const buildLifeStageStatus = (
  inputs: CompassInputs,
  status: StabilityStatus,
  savingsRate: number,
  emergencyFundMonths: number,
  nextGoal: GoalStep,
): LifeStageStatus => {
  const fireComplete = nextGoal.id === 'fire' && nextGoal.status === 'complete' && nextGoal.targetAmount > 0;
  const nearFire = nextGoal.id === 'fire' && nextGoal.progress >= 80;
  const level = fireComplete
    ? 6
    : status === 'deficit'
    ? 1
    : emergencyFundMonths < 1
      ? 2
      : emergencyFundMonths < 3
        ? 3
        : savingsRate < 20
          ? 4
          : 5;

  const priorityTheme = fireComplete
    ? '資産の使い方を整える'
    : nearFire
      ? '資産生活前の守りを点検する'
      : status === 'deficit'
        ? '赤字を止める'
        : emergencyFundMonths < 3
          ? '急な出費に備える'
          : inputs.workPain === 'high'
            ? '働く負担を減らす'
            : '余力の使い道を決める';

  return {
    title: level <= 1
      ? '赤字ストップ優先'
      : level === 2
        ? '1か月分の守りづくり'
        : level === 3
          ? '3か月分の守りづくり'
          : level === 4
            ? '余力づくり中'
            : level === 5
              ? nearFire
                ? '資産生活前の守り確認'
                : '余力の使い道を決める'
              : '資産の使い方を決める',
    level,
    stageName: nextGoal.label,
    priorityTheme,
    safetyMonthsLabel: `${emergencyFundMonths.toFixed(1)}か月分`,
    safetyProgress: clamp((emergencyFundMonths / 6) * 100, 0, 100),
    workLightnessLabel: inputs.workPain === 'high' ? 'かなり重い' : inputs.workPain === 'medium' ? '少し重い' : inputs.workPain === 'low' ? '軽め' : '未入力',
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
  const targetCashSavings = (inputs.monthlyExpenses + calculateMonthlyObligations(inputs)) * 3;
  let cashSavings = inputs.cashSavings;
  let investedAssets = inputs.investedAssets;
  let deficitBalance = 0;

  for (let year = 0; year <= 40; year++) {
    const age = inputs.currentAge + year;
    if (year % 2 === 0 || year === 1 || year === 40) {
      const totalAssets = cashSavings + investedAssets - deficitBalance;
      points.push({
        age,
        cashSavings: Math.max(0, Math.round(cashSavings)),
        investedAssets: Math.max(0, Math.round(investedAssets)),
        deficitBalance: deficitBalance > 0 ? -Math.round(deficitBalance) : 0,
        totalAssets: Math.round(totalAssets),
        longTermCarePremium: Math.round(calculateProjectedLongTermCarePremium(age, inputs.monthlyIncome)),
        pensionIncome: Math.round(calculateProjectedPensionIncome(age, inputs)),
        pensionContributionRelief: Math.round(calculateProjectedPensionContributionRelief(age, inputs)),
        annualLifeChangeImpact: Math.round(calculateProjectedPensionIncome(age, inputs) + calculateProjectedPensionContributionRelief(age, inputs) - calculateProjectedLongTermCarePremium(age, inputs.monthlyIncome)),
        assets: Math.round(totalAssets),
        label: `${age}歳`,
      });
    }

    investedAssets = Math.max(0, investedAssets * (1 + returnRate));
    const longTermCarePremium = calculateProjectedLongTermCarePremium(age, inputs.monthlyIncome);
    const pensionIncome = calculateProjectedPensionIncome(age, inputs);
    const pensionContributionRelief = calculateProjectedPensionContributionRelief(age, inputs);
    const adjustedAnnualSavings = annualSavings - longTermCarePremium + pensionIncome + pensionContributionRelief;
    if (adjustedAnnualSavings >= 0) {
      let remainingSavings = adjustedAnnualSavings;
      if (deficitBalance > 0) {
        const debtPayment = Math.min(remainingSavings, deficitBalance);
        deficitBalance -= debtPayment;
        remainingSavings -= debtPayment;
      }
      const cashGap = Math.max(0, targetCashSavings - cashSavings);
      const cashContribution = Math.min(remainingSavings, cashGap);
      cashSavings += cashContribution;
      investedAssets += remainingSavings - cashContribution;
    } else {
      let needed = Math.abs(adjustedAnnualSavings);
      const cashDrawdown = Math.min(cashSavings, needed);
      cashSavings -= cashDrawdown;
      needed -= cashDrawdown;
      const investmentDrawdown = Math.min(investedAssets, needed);
      investedAssets -= investmentDrawdown;
      needed -= investmentDrawdown;
      deficitBalance += needed;
    }
  }

  return points;
};

const calculateProjectedLongTermCarePremium = (age: number, monthlyIncome: number): number => {
  if (age < LONG_TERM_CARE_START_AGE || monthlyIncome <= 0) return 0;

  const annualIncome = monthlyIncome * 12;
  return Math.max(72000, annualIncome * LONG_TERM_CARE_PREMIUM_RATE);
};

const calculateProjectedPensionIncome = (age: number, inputs: CompassInputs): number => {
  if (age < PENSION_START_AGE) return 0;

  return buildPensionEstimate(inputs).monthlyBasicFullAmount * 12;
};

const calculateProjectedPensionContributionRelief = (age: number, inputs: CompassInputs): number => {
  if (age < 60 || inputs.monthlyPensionContribution <= 0) return 0;

  return inputs.monthlyPensionContribution * 12;
};

const calculateYearsToTargetWithSplit = (
  inputs: CompassInputs,
  annualSavings: number,
  targetAmount: number,
): number | null => {
  if (targetAmount <= 0) return 0;

  const returnRate = inputs.expectedReturnRate / 100;
  const targetCashSavings = (inputs.monthlyExpenses + calculateMonthlyObligations(inputs)) * 3;
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
