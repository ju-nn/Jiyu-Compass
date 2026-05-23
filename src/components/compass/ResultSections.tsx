import {
  Area,
  AreaChart,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  ChevronDown,
  CheckCircle2,
  Flag,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  Info,
  ArrowRight,
  BriefcaseBusiness,
  CalendarDays,
  CircleDollarSign,
  Compass,
  HeartPulse,
  Landmark,
  ExternalLink,
  Map,
  Copy,
  SlidersHorizontal,
} from 'lucide-react';
import { useState, type ReactNode } from 'react';
import type React from 'react';
import type { CompassResult, Mission } from '../../utils/compass';
import { getBenchmark } from '../../utils/benchmarks';
import { formatCurrency } from '../../utils/calculations';
import {
  getTimeToolRecommendations,
  type TimeToolRecommendationWithImpact,
} from '../../data/resourceRecommendations';

export function PrimaryMissionCard({
  mission,
  completed,
  onSelect,
}: {
  mission: Mission;
  completed: boolean;
  onSelect: (missionId: string) => void;
}) {
  return (
    <section className="rounded-lg border border-emerald-200 bg-emerald-50 p-5 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p className="text-xs font-black text-emerald-800">今の状態だと、まずこれ</p>
          <h3 className="mt-1 text-xl font-black text-slate-950">{mission.title}</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">{mission.body}</p>
        </div>
        <button
          type="button"
          onClick={() => onSelect(mission.id)}
          disabled={completed}
          className="h-11 shrink-0 rounded-lg bg-slate-950 px-4 text-sm font-black text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-emerald-600"
        >
          {completed ? '完了済' : '詳細を見る'}
        </button>
      </div>
    </section>
  );
}

export function ResultStory({
  result,
  mission,
  completed,
  onSelect,
}: {
  result: CompassResult;
  mission?: Mission;
  completed: boolean;
  onSelect: (missionId: string) => void;
}) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 inline-flex items-center gap-2 rounded-lg bg-amber-50 px-3 py-1 text-xs font-black text-amber-800">
        <Sparkles className="h-4 w-4" />
        今見るところ: {result.lifeStage.priorityTheme}
      </div>
      <h2 className="mb-4 text-2xl font-black leading-tight text-slate-950">{result.headline}</h2>
      <div className="space-y-3">
        <CompassOverview result={result} />
        <ResultMemoCard result={result} />
        <PositionMap result={result} />
        <StoryStep
          index="1"
          title="今わかること"
          body={result.story.currentStatusText}
          helper={result.story.currentStatusHelper}
          primaryContent={<LifeStatusPanel result={result} />}
          detailTeaser="月の余力、守りの貯金、総資産や年間支出の内訳を見られます。"
        >
          <div className="mt-4 flex flex-col gap-4">
            <CurrentStatusBreakdown result={result} />
            <DetailMetrics result={result} />
          </div>
        </StoryStep>
        <StoryStep
          index="2"
          title="このまま進むと"
          body={result.story.baselineFutureText}
          helper={result.story.baselineFutureHelper}
          primaryContent={<NextGoalPreview result={result} />}
          detailTeaser="年齢ごとの増え方、年齢で変わるお金、65歳からの年金目安を確認できます。"
        >
          <div className="mt-4 flex flex-col gap-4">
            <ProjectionChart result={result} />
            <PensionEstimateCard result={result} />
            <GoalSteps result={result} />
          </div>
        </StoryStep>
        <NextActionStep
          result={result}
          mission={mission}
          completed={completed}
          onSelect={onSelect}
        />
      </div>
    </section>
  );
}

function ResultMemoCard({ result }: { result: CompassResult }) {
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied' | 'error'>('idle');
  const [showMemo, setShowMemo] = useState(false);
  const memoText = buildResultMemo(result);

  const handleCopy = async () => {
    try {
      if (!navigator.clipboard) {
        throw new Error('Clipboard API is unavailable.');
      }

      await navigator.clipboard.writeText(memoText);
      setCopyStatus('copied');
    } catch {
      setCopyStatus('error');
      setShowMemo(true);
    }
  };

  return (
    <section className="rounded-lg border border-slate-200 bg-slate-50 p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p className="text-xs font-black text-emerald-700">自分用メモ</p>
          <h3 className="mt-1 text-base font-black text-slate-950">今日の結果を短く残す</h3>
          <p className="mt-1 text-xs leading-5 text-slate-600">
            現在地と次の一歩だけを、メモアプリに貼りやすい形でコピーします。
          </p>
        </div>
        <div className="grid gap-2 sm:flex sm:shrink-0">
          <button
            type="button"
            onClick={() => setShowMemo((current) => !current)}
            className="inline-flex h-10 items-center justify-center rounded-lg border border-slate-200 bg-white px-3 text-sm font-black text-slate-700 transition hover:bg-slate-100"
          >
            {showMemo ? 'メモ内容を閉じる' : 'メモ内容を確認'}
          </button>
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-slate-950 px-3 text-sm font-black text-white transition hover:bg-slate-800"
          >
            {copyStatus === 'copied' ? <CheckCircle2 className="h-4 w-4 text-emerald-200" /> : <Copy className="h-4 w-4" />}
            {copyStatus === 'copied' ? 'コピーしました' : '自分用メモをコピー'}
          </button>
        </div>
      </div>
      {copyStatus === 'error' && (
        <p className="mt-3 rounded-lg border border-amber-100 bg-amber-50 p-3 text-xs leading-5 text-amber-800">
          この環境では自動コピーが使えませんでした。下のメモ本文を選択して控えてください。
        </p>
      )}
      {showMemo && (
        <textarea
          readOnly
          value={memoText}
          rows={10}
          className="mt-3 w-full resize-y rounded-lg border border-slate-200 bg-white p-3 text-xs leading-5 text-slate-700 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          aria-label="コピーする自分用メモの内容"
        />
      )}
    </section>
  );
}

function buildResultMemo(result: CompassResult) {
  const supportLine = result.withdrawalSupport.find((line) => line.rate === 3) ?? result.withdrawalSupport[0];
  const missions = [
    result.missionTimeline.today,
    result.missionTimeline.thisWeek,
    result.missionTimeline.thisMonth,
  ];

  return [
    'ジユウノコンパス診断メモ',
    '',
    `現在地: ${result.diagnosisType.title}`,
    `自由度スコア: ${result.freedomScore.score}点（${result.freedomScore.label}）`,
    `生活防衛資金: ${result.emergencyFundPlan.stageLabel} / 目安 ${result.emergencyFundPlan.rangeLabel}`,
    `資産カバー率: 3.0%目安で生活費の約${Math.round(supportLine.coveragePercent)}%`,
    '',
    '次の一歩',
    ...missions.map((mission) => `- ${mission.title}: ${mission.body}`),
    '',
    'メモ: この結果は一般的な目安です。退職・投資・税務などの判断を断定するものではありません。',
  ].join('\n');
}

function StoryStep({
  index,
  title,
  body,
  helper,
  accent = false,
  primaryContent,
  detailTeaser,
  children,
}: {
  index: string;
  title: string;
  body: string;
  helper?: string;
  accent?: boolean;
  primaryContent?: React.ReactNode;
  detailTeaser?: string;
  children?: React.ReactNode;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const panelId = `story-step-${index}-details`;

  return (
    <div className={`rounded-lg border p-4 ${accent ? 'border-emerald-200 bg-emerald-50' : 'border-slate-200 bg-slate-50'}`}>
      <div className="flex gap-3">
        <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm font-black ${accent ? 'bg-emerald-600 text-white' : 'bg-slate-950 text-white'}`}>
          {index}
        </span>
        <div className="flex-1">
          <h3 className="font-black text-slate-950">{title}</h3>
          <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-700 font-bold">{body}</p>
          {helper && <p className="mt-2 text-xs leading-5 text-slate-500">{renderClickableTerms(helper)}</p>}
          {primaryContent && <div className="mt-4">{primaryContent}</div>}
          {children && (
            <>
              {detailTeaser && !isExpanded && (
                <div className="mt-3 rounded-lg border border-dashed border-slate-300 bg-white/75 p-3 text-xs leading-5 text-slate-600">
                  <span className="font-black text-slate-800">詳しく見ると:</span> {detailTeaser}
                </div>
              )}
              <button
                type="button"
                onClick={() => setIsExpanded((current) => !current)}
                className="mt-3 inline-flex h-9 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-xs font-black text-slate-700 transition hover:bg-slate-50"
                aria-expanded={isExpanded}
                aria-controls={panelId}
              >
                {isExpanded ? '詳しい表示を閉じる' : '詳しい表示を開く'}
                <ChevronDown className={`h-4 w-4 transition ${isExpanded ? 'rotate-180' : ''}`} />
              </button>
              {isExpanded && (
                <div id={panelId} className="mt-4 border-t border-slate-200 pt-4">
                  {children}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function CompassOverview({ result }: { result: CompassResult }) {
  const supportLine = result.withdrawalSupport.find((line) => line.rate === 3) ?? result.withdrawalSupport[0];

  return (
    <section className="space-y-3">
      <div className="grid gap-3 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-emerald-700 shadow-sm">
              {getDiagnosisIcon(result.diagnosisType.icon)}
            </span>
            <div className="min-w-0">
              <p className="text-xs font-black text-emerald-800">あなたの現在地</p>
              <h3 className="mt-1 text-2xl font-black leading-tight text-slate-950">{result.diagnosisType.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-700">{result.diagnosisType.summary}</p>
            </div>
          </div>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {result.diagnosisType.reasons.map((reason) => (
              <div key={reason} className="rounded-lg border border-white bg-white/85 p-3 text-xs font-bold leading-5 text-slate-700">
                {reason}
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-black text-slate-500">自由度スコア</p>
              <h3 className="text-xl font-black text-slate-950">{result.freedomScore.label}</h3>
            </div>
            <span className="text-3xl font-black text-emerald-700">{result.freedomScore.score}</span>
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-slate-100">
            <div className="h-full rounded-full bg-emerald-600" style={{ width: `${result.freedomScore.score}%` }} />
          </div>
          <div className="mt-3 grid gap-2">
            {result.freedomScore.factors.map((factor) => (
              <p key={factor} className="rounded-lg bg-slate-50 px-3 py-2 text-xs font-bold leading-5 text-slate-600">{factor}</p>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <GaugeCard
          title="生活防衛資金"
          value={result.emergencyFundPlan.stageLabel}
          progress={result.emergencyFundPlan.progressToMin}
          body={`${result.emergencyFundPlan.rangeLabel}が目安です。次は${result.emergencyFundPlan.nextMilestoneLabel}${result.emergencyFundPlan.nextMilestoneAmount > 0 ? `まであと${formatCurrency(result.emergencyFundPlan.nextMilestoneAmount)}` : ''}。`}
          icon={<ShieldCheck className="h-4 w-4" />}
        />
        <GaugeCard
          title="資産カバー率"
          value={`${Math.round(supportLine.coveragePercent)}%`}
          progress={Math.min(100, supportLine.coveragePercent)}
          body={`3.0%目安では資産が月${formatCurrency(supportLine.monthlySupport)}を支えます。4.0%は米国過去データの参考線としてだけ見ます。`}
          icon={<CircleDollarSign className="h-4 w-4" />}
        />
        <GaugeCard
          title="働き方を緩める余地"
          value={result.lifeStage.workLightnessLabel}
          progress={result.lifeStage.workLightnessProgress}
          body={getWorkLightnessBody(result)}
          icon={<BriefcaseBusiness className="h-4 w-4" />}
        />
      </div>

      <MissionTimelineCards result={result} />
      <WithdrawalSupportCards result={result} />
    </section>
  );
}

function WithdrawalSupportCards({ result }: { result: CompassResult }) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-black text-emerald-700">セミリタイア距離メーター</p>
          <h3 className="text-base font-black text-slate-950">資産が生活費の何%を支えるか</h3>
          <p className="mt-1 text-xs leading-5 text-slate-500">
            「もう働かなくてよい」という判定ではなく、生活費の一部を資産で補える目安です。iDeCoなど原則60歳まで使えない資産を含めている場合は、別管理で見てください。
          </p>
        </div>
        <Compass className="mt-1 h-5 w-5 shrink-0 text-emerald-700" />
      </div>
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        {result.withdrawalSupport.map((line) => (
          <div key={line.rate} className={`rounded-lg border p-3 ${line.rate === 4 ? 'border-slate-200 bg-slate-50' : 'border-emerald-100 bg-emerald-50/60'}`}>
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs font-black text-slate-600">{line.rate.toFixed(1)}%</p>
              <span className="rounded bg-white px-2 py-1 text-[11px] font-black text-slate-500">{Math.round(line.coveragePercent)}%</span>
            </div>
            <p className="mt-1 text-sm font-black text-slate-950">{line.label}</p>
            <p className="mt-2 text-lg font-black text-emerald-700">{formatCurrency(line.monthlySupport)}/月</p>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-white">
              <div className="h-full rounded-full bg-emerald-600" style={{ width: `${Math.min(100, line.coveragePercent)}%` }} />
            </div>
            <p className="mt-2 text-xs leading-5 text-slate-600">{line.note}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function MissionTimelineCards({ result }: { result: CompassResult }) {
  const items = [
    { label: '今日', mission: result.missionTimeline.today, icon: <CheckCircle2 className="h-4 w-4" /> },
    { label: '今週', mission: result.missionTimeline.thisWeek, icon: <CalendarDays className="h-4 w-4" /> },
    { label: '今月', mission: result.missionTimeline.thisMonth, icon: <Map className="h-4 w-4" /> },
  ];

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-3">
        <p className="text-xs font-black text-emerald-700">次の一歩</p>
        <h3 className="text-base font-black text-slate-950">やることは3つまで</h3>
      </div>
      <div className="grid gap-3 md:grid-cols-3">
        {items.map((item) => (
          <div key={item.label} className="rounded-lg border border-slate-100 bg-slate-50 p-3">
            <div className="mb-2 inline-flex items-center gap-2 rounded bg-white px-2 py-1 text-xs font-black text-emerald-700">
              {item.icon}
              {item.label}
            </div>
            <h4 className="text-sm font-black leading-5 text-slate-950">{item.mission.title.replace(`${item.label}: `, '')}</h4>
            <p className="mt-2 text-xs leading-5 text-slate-600">{item.mission.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function getDiagnosisIcon(icon: string) {
  const className = 'h-5 w-5';
  if (icon === 'heart') return <HeartPulse className={className} />;
  if (icon === 'briefcase') return <BriefcaseBusiness className={className} />;
  if (icon === 'map') return <Map className={className} />;
  if (icon === 'coins') return <CircleDollarSign className={className} />;
  if (icon === 'compass') return <Compass className={className} />;
  if (icon === 'sliders') return <SlidersHorizontal className={className} />;
  return <ShieldCheck className={className} />;
}

function getWorkLightnessBody(result: CompassResult) {
  if (result.diagnosisType.id === 'rest_consult') {
    return 'しんどさが強い時期は、副業や独立より、休息・相談・制度確認を先に置きます。';
  }

  if (result.diagnosisType.id === 'in_job_relief') {
    return '有給、残業整理、在宅勤務、時差出勤、業務量調整の順に軽くする余地があります。';
  }

  if (result.diagnosisType.id === 'career_prepare') {
    return '退職前に求人保存や職務経歴書の準備を進めると、焦らず選びやすくなります。';
  }

  if (result.diagnosisType.id === 'asset_supported_adjustment' || result.diagnosisType.id === 'semi_retire_ready') {
    return '資産と安定収入を補助にして、週4・短時間勤務・役割限定などを比較しやすい状態です。';
  }

  return 'まず家計の土台を整えると、仕事を軽くする相談や準備がしやすくなります。';
}

function PositionMap({ result }: { result: CompassResult }) {
  const rank = extractPositionRank(result.story.positionLabel);
  const markerPosition = rank === null ? 50 : Math.max(0, Math.min(100, ((rank - 1) / 99) * 100));
  const currentAge = result.projection[0]?.age ?? 0;
  const benchmark = getBenchmark(currentAge);
  const assetRatio = benchmark?.medianAssets
    ? (result.totalAssets / benchmark.medianAssets) * 100
    : 0;
  const factors = [
    {
      label: '貯蓄率',
      value: result.monthlyBalance >= 0 ? `${result.savingsRate.toFixed(1)}%` : '赤字',
      progress: Math.max(0, Math.min(100, result.savingsRate * 3)),
    },
    {
      label: '守りの貯金',
      value: result.lifeStage.safetyMonthsLabel,
      progress: result.lifeStage.safetyProgress,
    },
    {
      label: '同年代資産目安',
      value: benchmark ? `約${Math.round(assetRatio)}%` : '目安なし',
      progress: Math.max(0, Math.min(100, assetRatio)),
    },
  ];

  return (
    <section className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
      <div className="grid gap-4 lg:grid-cols-[1fr_280px]">
        <div>
          <p className="text-xs font-black text-emerald-800">ざっくり現在地</p>
          <p className="mt-1 text-2xl font-black leading-tight text-slate-950">{result.story.positionLabel}</p>
          <div className="mt-4">
            <div className="relative h-3 rounded-full bg-gradient-to-r from-emerald-600 via-amber-300 to-slate-200 shadow-inner">
              <div
                className="absolute top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-white bg-slate-950 shadow"
                style={{ left: `${markerPosition}%` }}
                aria-hidden="true"
              />
            </div>
            <div className="mt-2 flex justify-between text-[11px] font-black text-emerald-900">
              <span>上位</span>
              <span>真ん中</span>
              <span>これから</span>
            </div>
          </div>
          <p className="mt-3 text-xs leading-5 text-slate-600">{result.story.positionHelper}</p>
        </div>
        <div className="grid gap-2">
          {factors.map((factor) => (
            <div key={factor.label} className="rounded-lg border border-white bg-white/85 p-3">
              <div className="flex items-center justify-between gap-3 text-xs font-black">
                <span className="text-slate-600">{factor.label}</span>
                <span className="text-slate-950">{factor.value}</span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
                <div className="h-full rounded-full bg-emerald-600" style={{ width: `${factor.progress}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function extractPositionRank(label: string) {
  const match = label.match(/(\d+)番目/);
  return match ? Number(match[1]) : null;
}

function NextActionStep({
  result,
  mission,
  completed,
  onSelect,
}: {
  result: CompassResult;
  mission?: Mission;
  completed: boolean;
  onSelect: (missionId: string) => void;
}) {
  return (
    <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
      <div className="flex gap-3">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-sm font-black text-white">
          3
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="font-black text-slate-950">次に動かすなら</h3>
          <p className="mt-2 whitespace-pre-wrap text-sm font-bold leading-6 text-slate-700">{result.story.improvedFutureText}</p>
          <p className="mt-2 text-xs leading-5 text-slate-500">
            <TermHelp term="取り崩し率" />は目安です。毎月もらえるお金や、将来の結果を約束するものではありません。
          </p>
          {mission && (
            <div className="mt-4 rounded-lg border border-white bg-white p-4 shadow-sm">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <p className="text-xs font-black text-emerald-800">まずこれ</p>
                  <h4 className="mt-1 text-xl font-black text-slate-950">{mission.title}</h4>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{result.story.improvedActionText}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="rounded-lg bg-emerald-50 px-2 py-1 text-xs font-black text-emerald-700">
                      種類: {getMissionCategoryLabel(mission.category)}
                    </span>
                    <span className="rounded-lg bg-slate-100 px-2 py-1 text-xs font-black text-slate-600">
                      手間: {getMissionDifficultyLabel(mission.difficulty)}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => onSelect(mission.id)}
                  disabled={completed}
                  className="h-11 shrink-0 rounded-lg bg-slate-950 px-4 text-sm font-black text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-emerald-600"
                >
                  {completed ? '完了済' : '数字で見る'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function getMissionCategoryLabel(category: Mission['category']) {
  const labels: Record<Mission['category'], string> = {
    saving: '支出を軽くする',
    income: '収入を安定させる',
    defense: '貯金を守る',
    investment: '投資の準備',
    work: '働き方を軽くする',
  };

  return labels[category];
}

function getMissionDifficultyLabel(difficulty: Mission['difficulty']) {
  const labels: Record<Mission['difficulty'], string> = {
    easy: 'すぐできる',
    normal: '少し考える',
    hard: 'しっかり見直す',
  };

  return labels[difficulty];
}

export function DiagnosisScopeNote() {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <h3 className="font-black text-slate-950">この診断でわかること</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            月に残るお金、<TermHelp term="貯蓄率" />、<TermHelp term="急な出費にそなえる貯金" />、今やる一歩の目安がわかります。
            同じ年代とのくらべ方は、正確な順位ではなく、だいたいの位置です。
          </p>
        </div>
        <div>
          <h3 className="font-black text-slate-950">この診断でわからないこと</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            将来の収入、税金、投資の値動き、医療費、どの道具やサービスを選ぶべきかはわかりません。
            40歳から<TermHelp term="介護保険料" />が始まることや、65歳から<TermHelp term="公的年金" />を受け取れることなど、年齢で変わることはあります。ただし、金額は人によって違います。投資で増える計算は、投資しているお金だけに使います。将来の結果は約束できません。
          </p>
        </div>
        <div className="rounded-lg border border-slate-100 bg-slate-50 p-4 md:col-span-2">
          <h3 className="font-black text-slate-950">投資について</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            急な出費にそなえるお金は、すぐ使える貯金だけで見ます。その貯金が足りない間は、投資より貯金を優先します。
            投資を始めるなら、<TermHelp term="NISA" />などを調べながら、長く続ける・いろいろ分ける・手数料を低くする、という考え方を大事にしてください。
            <TermHelp term="取り崩し率" />の計算は目安で、利益や毎月の受け取りを約束するものではありません。
          </p>
        </div>
      </div>
    </section>
  );
}

export function ResultSummary({ result }: { result: CompassResult }) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
        <div className="max-w-2xl">
          <p className="mb-2 inline-flex items-center gap-2 rounded-lg bg-amber-50 px-3 py-1 text-xs font-black text-amber-800">
            <Sparkles className="h-4 w-4" />
            今見るところ: {result.lifeStage.priorityTheme}
          </p>
          <h2 className="text-2xl font-black leading-tight text-slate-950">{result.headline}</h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            今の優先テーマは「{result.lifeStage.priorityTheme}」。まずは
            {result.lifeStage.stageName} を進めて、働き方を選びやすくします。
          </p>
        </div>
        <div className="grid min-w-[280px] gap-3 sm:grid-cols-3 xl:max-w-xl">
          <Metric
            label="月の余力"
            value={formatCurrency(result.monthlyBalance)}
            insight={result.metricInsights.monthlyBuffer.label}
            helper={result.metricInsights.monthlyBuffer.helper}
            tone={result.metricInsights.monthlyBuffer.tone}
          />
          <Metric
            label="貯蓄率"
            value={`${result.savingsRate.toFixed(1)}%`}
            insight={result.metricInsights.savingsRate.label}
            helper={result.metricInsights.savingsRate.helper}
            tone={result.metricInsights.savingsRate.tone}
          />
          <Metric
            label="急な出費用の貯金"
            value={result.lifeStage.safetyMonthsLabel}
            insight={result.metricInsights.emergencyFund.label}
            helper={result.metricInsights.emergencyFund.helper}
            tone={result.metricInsights.emergencyFund.tone}
          />
        </div>
      </div>
    </section>
  );
}

export function DetailMetrics({ result }: { result: CompassResult }) {
  const summary = result.calculationSummary;
  const withdrawalRateLabel = `${summary.withdrawalRate.toLocaleString('ja-JP')}%`;

  return (
    <section className="grid gap-3 sm:grid-cols-2">
      <Metric
        label="総資産"
        value={formatCurrency(result.totalAssets)}
        helper={`貯金 ${formatCurrency(result.cashSavings)} + 投資 ${formatCurrency(result.investedAssets)}`}
        tone="neutral"
      />
      <Metric
        label="資産で生活費を支える目安"
        value={formatCurrency(result.fireNumber)}
        helper={`${formatCurrency(summary.annualExpenses)} ÷ ${withdrawalRateLabel}。退職可否ではなく距離を見る目安です。`}
        tone="neutral"
      />
      <Metric
        label="月の返済・保険料"
        value={formatCurrency(result.monthlyObligations)}
        helper="入力した返済・保険料の月合計"
        tone={result.monthlyObligations > 0 ? 'warn' : 'neutral'}
      />
      <Metric
        label="年間支出 合計"
        value={formatCurrency(result.annualExpenses)}
        helper={`(${formatCurrency(summary.monthlyExpenses)} + ${formatCurrency(summary.monthlyObligations)}) × 12か月`}
        tone="neutral"
      />
    </section>
  );
}

export function LifeStatusPanel({ result }: { result: CompassResult }) {
  const decisionSignal = buildDecisionSignal(result);

  return (
    <section className="space-y-3">
      <div className="grid gap-4 md:grid-cols-3">
        <GaugeCard
          title="毎月の余力"
          value={formatCurrency(result.monthlyBalance)}
          progress={Math.max(0, Math.min(100, result.savingsRate * 2))}
          body={getSavingsRateBody(result.savingsRate, result.monthlyBalance)}
          icon={<TrendingUp className="h-4 w-4" />}
        />
        <GaugeCard
          title={<TermHelp term="急な出費にそなえる貯金" />}
          value={result.lifeStage.safetyMonthsLabel}
          progress={result.lifeStage.safetyProgress}
          body={getEmergencyFundBody(result.emergencyFundMonths)}
          icon={<ShieldCheck className="h-4 w-4" />}
        />
        <GaugeCard
          title={decisionSignal.title}
          value={decisionSignal.value}
          progress={decisionSignal.progress}
          body={decisionSignal.body}
          icon={<Target className="h-4 w-4" />}
        />
      </div>
      {result.inputSummary.workPain === '' && (
        <p className="rounded-lg border border-dashed border-slate-300 bg-white px-3 py-2 text-xs leading-5 text-slate-500">
          仕事のしんどさは未入力なので、働き方の提案は控えめにしています。詳しく入れると、有給・在宅・転職準備など、働き方を軽くする一手に反映します。
        </p>
      )}
    </section>
  );
}

function buildDecisionSignal(result: CompassResult) {
  if (result.monthlyBalance < 0) {
    return {
      title: 'まず止める差額',
      value: `${formatCurrency(Math.abs(result.monthlyBalance))}/月`,
      progress: 0,
      body: `毎月${formatCurrency(Math.abs(result.monthlyBalance))}ぶん不足しています。ここを埋めると、貯金を減らす流れを止められます。`,
    };
  }

  const threeMonthGap = Math.max(0, result.annualExpenses / 4 - result.cashSavings);
  const sixMonthGap = Math.max(0, result.annualExpenses / 2 - result.cashSavings);

  if (threeMonthGap > 0) {
    return {
      title: '次の分かれ道',
      value: `あと${formatCurrency(threeMonthGap)}`,
      progress: result.lifeStage.safetyProgress,
      body: 'まず3か月分まで貯金を厚くすると、急な出費や仕事の変化に向き合う時間を作りやすくなります。',
    };
  }

  if (sixMonthGap > 0) {
    return {
      title: '次の分かれ道',
      value: `あと${formatCurrency(sixMonthGap)}`,
      progress: result.lifeStage.safetyProgress,
      body: '3か月分は届いています。6か月分まで守りを厚くするか、投資や働き方に回すかを選ぶ段階です。',
    };
  }

  if (result.inputSummary.workPain === 'high') {
    return {
      title: '次の分かれ道',
      value: '仕事を軽くする',
      progress: result.lifeStage.workLightnessProgress,
      body: '守りの貯金は十分です。仕事のしんどさが高いので、余力を自由時間や働き方の見直しへ回す判断が合います。',
    };
  }

  return {
    title: '次の分かれ道',
    value: '使い道を選ぶ',
    progress: 100,
    body: '守りの貯金は十分です。ここからは、貯金を厚くする、投資を始める、働き方を軽くする、の配分を選べます。',
  };
}

function getEmergencyFundBody(months: number): string {
  if (months >= 6) {
    return `${months.toFixed(1)}か月分あるので、収入が一時的に減っても考える時間を作りやすい数字です。次は使い道を、貯金・投資・働き方の見直しに分けて考えられます。`;
  }

  if (months >= 3) {
    return `${months.toFixed(1)}か月分あるので、急な出費にはかなり耐えやすい数字です。6か月分まで増えると、収入が減ったときの安心感も高まります。`;
  }

  if (months >= 1) {
    return `${months.toFixed(1)}か月分なので、小さな急な出費には対応しやすい数字です。まずは3か月分を目標にすると、不安を減らしやすくなります。`;
  }

  return `${months.toFixed(1)}か月分なので、急な出費があると毎月の収支にすぐ響きやすい数字です。まずはすぐ使える貯金を1か月分に近づけるのが効きます。`;
}

function getSavingsRateBody(savingsRate: number, monthlyBalance: number): string {
  if (savingsRate >= 20) {
    return `月に${formatCurrency(monthlyBalance)}残るので、1年では約${formatCurrency(monthlyBalance * 12)}を貯金や投資、働き方の見直しに回せる計算です。`;
  }

  if (savingsRate >= 10) {
    return `月に${formatCurrency(monthlyBalance)}残るので、1年では約${formatCurrency(monthlyBalance * 12)}の余力です。続けるほど、少しずつ選べる道が増えます。`;
  }

  if (savingsRate >= 0) {
    return `月に${formatCurrency(monthlyBalance)}の黒字なので、1年では約${formatCurrency(monthlyBalance * 12)}の余力です。固定費や大きな支出を少し動かすと、数字が変わりやすい状態です。`;
  }

  return `月に${formatCurrency(Math.abs(monthlyBalance))}の赤字なので、このペースだと1年で約${formatCurrency(Math.abs(monthlyBalance) * 12)}不足する計算です。まずは赤字の原因を見つけたい数字です。`;
}

function PensionEstimateCard({ result }: { result: CompassResult }) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase text-emerald-700">65歳からの目安</p>
          <h3 className="text-base font-black text-slate-950">将来もらえる年金</h3>
        </div>
        <Landmark className="h-5 w-5 text-emerald-700" />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <StatusReadout
          label="国民年金だけなら"
          value={`${result.pensionEstimate.startAge}歳から月${result.pensionEstimate.monthlyBasicLabel}`}
          body="20歳から60歳まで払った場合の目安です。"
        />
        <StatusReadout
          label="会社員なら"
          value={`${result.pensionEstimate.startAge}歳から月${result.pensionEstimate.monthlyEmployeeExampleLabel}`}
          body="今の月収が40年続いた場合の目安です。"
        />
      </div>
      <p className="mt-3 text-xs leading-5 text-slate-500">{result.pensionEstimate.helper}</p>
    </section>
  );
}

function CurrentStatusBreakdown({ result }: { result: CompassResult }) {
  const monthlyIncome = result.annualIncome / 12;
  const sixMonthFund = result.annualExpenses / 2;
  const emergencyGap = Math.max(0, sixMonthFund - result.cashSavings);
  const annualBuffer = result.monthlyBalance * 12;
  const obligationRate = monthlyIncome > 0
    ? (result.monthlyObligations / monthlyIncome) * 100
    : 0;

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase text-emerald-700">Reading</p>
          <h3 className="text-base font-black text-slate-950">数字から読めること</h3>
        </div>
        <ShieldCheck className="h-5 w-5 text-emerald-700" />
      </div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatusReadout
          label="6か月分の貯金まで"
          value={emergencyGap <= 0 ? '到達済み' : `あと${formatCurrency(emergencyGap)}`}
          body={emergencyGap <= 0 ? '収入が揺れても、考える時間を確保しやすい水準です。' : 'ここまで貯金で持てると、働き方を変える判断がしやすくなります。'}
        />
        <StatusReadout
          label="1年分の余力"
          value={formatCurrency(annualBuffer)}
          body={annualBuffer > 0 ? 'この黒字を、貯金・投資・仕事の見直しに回せます。' : 'まずは1年でマイナスにならない形を作るのが先です。'}
        />
        <StatusReadout
          label="資産カバー距離"
          value={`${result.fireProgress.toFixed(1)}%`}
          body={result.yearsToFire === null ? '今のペースでは、何年で届くか出しにくい状態です。' : `${result.achievableFireAge}歳ごろに資産が生活費を大きく支える目安です。`}
        />
        <StatusReadout
          label="毎月決まって出るお金"
          value={`${obligationRate.toFixed(1)}%`}
          body={result.monthlyObligations > 0 ? '返済や保険料が多いほど、自由に使えるお金は少なくなります。' : '入力上は、返済や自分で払う保険料はありません。'}
        />
      </div>
    </section>
  );
}

function StatusReadout({ label, value, body }: { label: string; value: string; body: string }) {
  return (
    <div className="rounded-lg border border-slate-100 bg-slate-50 p-3">
      <p className="text-xs font-bold text-slate-600">{renderClickableTerms(label)}</p>
      <p className="mt-1 text-lg font-black text-slate-950">{value}</p>
      <p className="mt-2 text-xs leading-5 text-slate-600">{renderClickableTerms(body)}</p>
    </div>
  );
}

function NextGoalPreview({ result }: { result: CompassResult }) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p className="text-xs font-black text-emerald-700">次に見る目標</p>
          <h3 className="mt-1 text-lg font-black text-slate-950">{result.nextGoal.label}</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">{result.nextGoal.helper}</p>
        </div>
        <div className="shrink-0 rounded-lg border border-slate-100 bg-slate-50 p-3 sm:w-48">
          <div className="flex items-center justify-between gap-3 text-xs font-black text-slate-500">
            <span>進み具合</span>
            <span>{Math.round(result.nextGoal.progress)}%</span>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-white">
            <div className="h-full rounded-full bg-emerald-600" style={{ width: `${result.nextGoal.progress}%` }} />
          </div>
          <p className="mt-3 text-xs font-bold text-slate-500">必要なお金</p>
          <p className="mt-1 text-lg font-black text-slate-950">{formatCurrency(result.nextGoal.targetAmount)}</p>
        </div>
      </div>
      {result.cashEmergencyFundMonths < 3 && (
        <p className="mt-3 rounded-lg bg-amber-50 p-3 text-xs leading-5 text-amber-800">
          投資などのお金があっても、まずはすぐ使える貯金を3か月分まで作るのが大事です。
        </p>
      )}
    </section>
  );
}

export function ProjectionChart({ result }: { result: CompassResult }) {
  const minAge = result.projection[0]?.age ?? 0;
  const maxAge = result.projection[result.projection.length - 1]?.age ?? 0;
  const lifeChangeMarkers = [
    {
      age: 40,
      label: '介護保険料',
      shortLabel: '40歳 介護保険料',
      body: '40歳から介護保険料の目安を支出に入れています。',
      color: '#d97706',
      bg: 'bg-amber-50',
      text: 'text-amber-800',
      border: 'border-amber-200',
      visible: true,
    },
    {
      age: 60,
      label: '年金保険料終了',
      shortLabel: '60歳 年金保険料終了',
      body: '自分で払う年金保険料を入力している場合、60歳以降は支出から外す目安にしています。',
      color: '#16a34a',
      bg: 'bg-emerald-50',
      text: 'text-emerald-800',
      border: 'border-emerald-200',
      visible: result.projection.some((point) => point.pensionContributionRelief > 0),
    },
    {
      age: result.pensionEstimate.startAge,
      label: '年金',
      shortLabel: `${result.pensionEstimate.startAge}歳 年金`,
      body: `公的年金の目安として、月${result.pensionEstimate.monthlyBasicLabel}を収入に入れています。`,
      color: '#2563eb',
      bg: 'bg-blue-50',
      text: 'text-blue-800',
      border: 'border-blue-200',
      visible: true,
    },
    {
      age: 70,
      label: '医療費負担',
      shortLabel: '70歳 医療費',
      body: '医療費負担が変わり始める年齢です。金額差は人によって違うため、制度メモとして表示します。',
      color: '#7c3aed',
      bg: 'bg-violet-50',
      text: 'text-violet-800',
      border: 'border-violet-200',
      visible: true,
    },
    {
      age: 75,
      label: '後期高齢者医療',
      shortLabel: '75歳 医療制度',
      body: '後期高齢者医療制度へ切り替わる年齢です。保険料や負担割合は所得などで変わります。',
      color: '#0f766e',
      bg: 'bg-teal-50',
      text: 'text-teal-800',
      border: 'border-teal-200',
      visible: true,
    },
  ].filter((marker) => marker.visible && marker.age >= minAge && marker.age <= maxAge);

  const chart = (
    <AreaChart width={720} height={320} data={result.projection} margin={{ left: 0, right: 12, top: 24, bottom: 0 }}>
      <defs>
        <linearGradient id="assetFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#059669" stopOpacity={0.28} />
          <stop offset="100%" stopColor="#059669" stopOpacity={0.02} />
        </linearGradient>
      </defs>
      <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" vertical={false} />
      <XAxis dataKey="age" tickLine={false} axisLine={false} fontSize={12} />
      <YAxis
        tickLine={false}
        axisLine={false}
        fontSize={12}
        width={64}
        tickFormatter={(value) => `${Math.round(Number(value) / 10000)}万`}
      />
      <Tooltip content={<ProjectionTooltip />} />
      <ReferenceLine y={0} stroke="#94a3b8" strokeDasharray="4 4" />
      {lifeChangeMarkers.map((marker) => (
        <ReferenceLine
          key={marker.label}
          x={marker.age}
          stroke={marker.color}
          strokeDasharray="5 5"
          label={{ value: marker.shortLabel, fill: marker.color, fontSize: 12, fontWeight: 800, position: 'top' }}
        />
      ))}
      <Area type="monotone" dataKey="cashSavings" name="貯金" stackId="assets" stroke="#059669" strokeWidth={2} fill="url(#assetFill)" />
      <Area type="monotone" dataKey="investedAssets" name="投資資産" stackId="assets" stroke="#2563eb" strokeWidth={2} fill="#dbeafe" />
      <Area type="monotone" dataKey="deficitBalance" name="赤字残高" stroke="#dc2626" strokeWidth={2} fill="#fee2e2" />
    </AreaChart>
  );

  return (
    <section className="grid gap-6 xl:grid-cols-[1fr_320px]">
      <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase text-emerald-700">Projection</p>
            <h3 className="text-lg font-black text-slate-950">お金の増え方の目安</h3>
          </div>
          <TrendingUp className="h-5 w-5 text-emerald-700" />
        </div>
        <div className="h-[320px]">
          {import.meta.env.MODE === 'test' ? chart : (
            <ResponsiveContainer width="100%" height="100%">
              {chart}
            </ResponsiveContainer>
          )}
        </div>
        <p className="mt-3 text-xs leading-5 text-slate-500">
          このグラフは、急な出費にそなえる貯金が3か月分になるまでは貯金を優先し、その後のお金を投資へ回す目安です。年齢で始まるお金の変化も入れています。
        </p>
        {lifeChangeMarkers.length > 0 && (
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {lifeChangeMarkers.map((marker) => (
              <div key={marker.label} className={`rounded-lg border p-3 ${marker.border} ${marker.bg}`}>
                <p className={`text-xs font-black ${marker.text}`}>{marker.shortLabel}</p>
                <p className="mt-1 text-xs leading-5 text-slate-600">{renderClickableTerms(marker.body)}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="rounded-lg border border-slate-200 bg-slate-950 p-5 text-white shadow-sm">
        <p className="text-xs font-bold uppercase text-emerald-300">Next step</p>
        <h3 className="mt-2 text-xl font-black">{result.nextGoal.label}</h3>
        <div className="mt-5">
          <div className="mb-2 flex items-center justify-between text-sm font-bold">
            <span>どこまで進んだか</span>
            <span>{Math.round(result.nextGoal.progress)}%</span>
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-white/15">
            <div className="h-full rounded-full bg-emerald-400" style={{ width: `${result.nextGoal.progress}%` }} />
          </div>
        </div>
        <p className="mt-4 text-sm leading-6 text-slate-300">{result.nextGoal.helper}</p>
        {result.cashEmergencyFundMonths < 3 && (
          <p className="mt-3 rounded-lg bg-amber-400/15 p-3 text-sm leading-6 text-amber-100">
            投資などのお金があっても、まずはすぐ使える貯金を3か月分まで作るのが大事です。
          </p>
        )}
        <div className="mt-5 rounded-lg bg-white/10 p-4">
          <p className="text-xs font-bold text-slate-300">必要なお金</p>
          <p className="mt-1 text-2xl font-black">{formatCurrency(result.nextGoal.targetAmount)}</p>
        </div>
      </div>
    </section>
  );
}

function ProjectionTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ name?: string; value?: number; payload?: Record<string, number> }>; label?: number }) {
  if (!active || !payload?.length) return null;

  const point = payload[0]?.payload ?? {};
  const longTermCarePremium = Number(point.longTermCarePremium ?? 0);
  const pensionIncome = Number(point.pensionIncome ?? 0);
  const pensionContributionRelief = Number(point.pensionContributionRelief ?? 0);

  return (
    <div className="min-w-[220px] rounded-lg border border-slate-200 bg-white p-3 text-xs shadow-lg">
      <p className="font-black text-slate-950">{label}歳</p>
      <div className="mt-2 space-y-1">
        {payload.map((item) => (
          <div key={item.name} className="flex items-center justify-between gap-4 text-slate-600">
            <span>{item.name}</span>
            <span className="font-bold text-slate-950">{formatCurrency(Number(item.value ?? 0))}</span>
          </div>
        ))}
      </div>
      {(longTermCarePremium > 0 || pensionIncome > 0 || pensionContributionRelief > 0) && (
        <div className="mt-3 border-t border-slate-100 pt-2">
          <p className="font-black text-slate-700">年齢で変わるお金</p>
          {longTermCarePremium > 0 && (
            <div className="mt-1 flex items-center justify-between gap-4 text-amber-700">
              <span>介護保険料</span>
              <span className="font-bold">-{formatCurrency(longTermCarePremium)}/年</span>
            </div>
          )}
          {pensionIncome > 0 && (
            <div className="mt-1 flex items-center justify-between gap-4 text-blue-700">
              <span>年金収入</span>
              <span className="font-bold">+{formatCurrency(pensionIncome)}/年</span>
            </div>
          )}
          {pensionContributionRelief > 0 && (
            <div className="mt-1 flex items-center justify-between gap-4 text-emerald-700">
              <span>年金保険料終了</span>
              <span className="font-bold">+{formatCurrency(pensionContributionRelief)}/年</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function GoalSteps({ result }: { result: CompassResult }) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-5 flex items-center gap-2">
        <Target className="h-5 w-5 text-emerald-700" />
        <h3 className="text-lg font-black text-slate-950">少しずつ進む目標</h3>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {result.goalSteps.map((step) => (
          <div
            key={step.id}
            className={`rounded-lg border p-4 ${
              step.status === 'complete'
                ? 'border-emerald-200 bg-emerald-50'
                : step.status === 'active'
                  ? 'border-amber-300 bg-amber-50'
                  : 'border-slate-200 bg-slate-50'
            }`}
          >
            <div className="flex items-start gap-3">
              {step.status === 'complete' ? (
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-700" />
              ) : (
                <Flag className={`mt-0.5 h-5 w-5 shrink-0 ${step.status === 'active' ? 'text-amber-700' : 'text-slate-400'}`} />
              )}
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="font-black text-slate-950">{step.label}</h4>
                  <span className="text-xs font-bold text-slate-500">{Math.round(step.progress)}%</span>
                </div>
                <p className="mt-1 text-xs leading-5 text-slate-600">{step.helper}</p>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-white">
                  <div
                    className={`h-full rounded-full ${step.status === 'complete' ? 'bg-emerald-600' : 'bg-amber-500'}`}
                    style={{ width: `${step.progress}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function InvestmentNote() {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start gap-3">
        <ShieldCheck className="mt-1 h-5 w-5 shrink-0 text-emerald-700" />
        <div>
          <h3 className="font-black text-slate-950">投資について</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            急な出費にそなえるお金は、すぐ使える貯金だけで見ます。その貯金が足りない間は、投資より貯金を優先します。
            投資を始めるなら、NISAなどを調べながら、長く続ける・いろいろ分ける・手数料を低くする、という考え方を大事にしてください。
            投資で増える計算は、投資しているお金だけに使います。このアプリは、特定の投資先をすすめたり、利益を約束したりしません。
            同じ年代とのくらべ方は、正確な順位ではなく、だいたいの位置です。
          </p>
        </div>
      </div>
    </section>
  );
}

export function MoneyTools({ result }: { result: CompassResult }) {
  return (
    <div className="space-y-5">
      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <div className="max-w-2xl">
          <p className="text-xs font-bold text-emerald-700">固定費を軽くする</p>
          <h2 className="mt-1 text-xl font-black text-slate-950">固定費を軽くする試算</h2>
          <p className="mt-1 text-sm leading-6 text-slate-600">
            固定費を下げたときの余力と、生活防衛資金までの距離を見ながら、毎月の負担を軽くする余地を試せます。
          </p>
        </div>
      </section>
      <ExpenseCutSimulator result={result} />
    </div>
  );
}

export function TimeRecoveryTools({ result }: { result: CompassResult }) {
  const timeTools = getTimeToolRecommendations({
    monthlyBalance: result.monthlyBalance,
    workPain: result.inputSummary.workPain,
  });
  const [selectedToolId, setSelectedToolId] = useState(timeTools[0]?.id ?? '');
  const selectedTool = timeTools.find((tool) => tool.id === selectedToolId) ?? timeTools[0] ?? null;

  return (
    <div className="space-y-5">
      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 max-w-2xl">
          <p className="text-xs font-bold text-emerald-700">Time tools</p>
          <h2 className="mt-1 text-xl font-black text-slate-950">時間を取り戻す道具</h2>
          <p className="mt-1 text-sm leading-6 text-slate-600">
            毎週くり返す家事や小さな手間を軽くして、自由時間を戻す候補です。
          </p>
        </div>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 max-w-2xl">
          <p className="text-xs font-bold text-emerald-700">戻せる時間</p>
          <h3 className="text-lg font-black text-slate-950">暮らしに戻る時間を見る</h3>
          <p className="mt-1 text-sm leading-6 text-slate-600">
            道具やサービスを「ぜいたく」ではなく、毎月の自由時間を戻す選択肢として見ます。気になるものを選ぶと、時間とお金のインパクトを確認できます。
          </p>
        </div>
        <div className="grid gap-4 xl:grid-cols-[320px_1fr]">
          <div className="overflow-x-auto xl:max-h-[560px] xl:overflow-y-auto xl:overflow-x-visible">
            <div className="flex min-w-max gap-2 xl:min-w-0 xl:flex-col">
              {timeTools.map((tool) => {
                const isSelected = selectedTool?.id === tool.id;
                const monthlySavedHours = Math.round(tool.annualSavedHours / 12);

                return (
                  <button
                    key={tool.id}
                    type="button"
                    onClick={() => setSelectedToolId(tool.id)}
                    className={`w-64 shrink-0 rounded-lg border p-3 text-left transition xl:w-full ${
                      isSelected
                        ? 'border-emerald-300 bg-emerald-50 shadow-sm'
                        : 'border-slate-200 bg-slate-50 hover:border-slate-300 hover:bg-white'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-[11px] font-black leading-none ${
                        isSelected ? 'bg-emerald-700 text-white shadow-sm' : 'bg-white text-emerald-700 shadow-sm'
                      }`}>
                        道具
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="truncate text-sm font-black text-slate-950">{tool.title}</h4>
                          <span className="shrink-0 rounded bg-white px-2 py-1 text-[10px] font-black text-slate-500">
                            月{monthlySavedHours}h
                          </span>
                        </div>
                        <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-600">{tool.body}</p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
          {selectedTool && <TimeToolImpactDetail tool={selectedTool} />}
        </div>
        <p className="mt-3 text-xs leading-5 text-slate-500">
          時間と金額は生活パターンによって変わる目安です。家事時間の考え方は、総務省統計局「令和3年社会生活基本調査」の生活時間分類を参考にしています。
          Amazonアソシエイトリンクを使用します。購入しても表示価格は変わりません。
        </p>
      </section>
    </div>
  );
}

function ExpenseCutSimulator({ result }: { result: CompassResult }) {
  const [cuts, setCuts] = useState({
    phone: 3000,
    subscriptions: 2000,
    insurance: 0,
    housing: 0,
    other: 0,
  });
  const totalMonthlyCut = Object.values(cuts).reduce((sum, value) => sum + value, 0);
  const improvedMonthlyBalance = result.monthlyBalance + totalMonthlyCut;
  const improvedAnnualSavings = result.annualSavings + totalMonthlyCut * 12;
  const improvedSavingsRate = result.annualIncome > 0
    ? (improvedMonthlyBalance / (result.annualIncome / 12)) * 100
    : 0;
  const currentThreeMonthGap = Math.max(0, result.annualExpenses / 4 - result.cashSavings);
  const improvedAnnualExpenses = Math.max(0, result.annualExpenses - totalMonthlyCut * 12);
  const improvedThreeMonthGap = Math.max(0, improvedAnnualExpenses / 4 - result.cashSavings);
  const annualImpact = totalMonthlyCut * 12;
  const statusLabel = improvedMonthlyBalance > 0
    ? '月の余力あり'
    : improvedMonthlyBalance === 0
      ? '赤字ストップ'
      : 'まだ赤字';

  const updateCut = (key: keyof typeof cuts, value: number) => {
    setCuts((current) => ({
      ...current,
      [key]: Math.max(0, Math.min(100000, Math.round(value))),
    }));
  };

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="max-w-2xl">
          <p className="text-xs font-bold text-emerald-700">支出削減シミュレーター</p>
          <h3 className="mt-1 text-lg font-black text-slate-950">固定費を下げたら、毎月どれくらい楽になるか</h3>
          <p className="mt-1 text-sm leading-6 text-slate-600">
            削れそうな固定費を入れると、月の余力、貯蓄率、年間で残るお金、急な出費用の貯金までの距離が変わります。
          </p>
        </div>
        <div className={`inline-flex h-10 items-center justify-center rounded-lg px-3 text-sm font-black ${
          improvedMonthlyBalance >= 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
        }`}>
          <SlidersHorizontal className="mr-2 h-4 w-4" />
          {statusLabel}
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1fr_320px]">
        <div className="grid gap-3 md:grid-cols-2">
          <CutInput label="スマホ代" value={cuts.phone} onChange={(value) => updateCut('phone', value)} />
          <CutInput label="サブスク" value={cuts.subscriptions} onChange={(value) => updateCut('subscriptions', value)} />
          <CutInput label="保険" value={cuts.insurance} onChange={(value) => updateCut('insurance', value)} />
          <CutInput label="家賃・住居費" value={cuts.housing} onChange={(value) => updateCut('housing', value)} />
          <CutInput label="その他の固定費" value={cuts.other} onChange={(value) => updateCut('other', value)} wide />
        </div>

        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs font-black text-slate-500">合計で下げる固定費</p>
          <p className="mt-1 text-3xl font-black text-slate-950">{formatCurrency(totalMonthlyCut)}/月</p>
          <div className="mt-4 grid gap-2">
            <SimulatorMetric label="月の余力" before={formatCurrency(result.monthlyBalance)} after={formatCurrency(improvedMonthlyBalance)} />
            <SimulatorMetric label="貯蓄率" before={`${result.savingsRate.toFixed(1)}%`} after={`${improvedSavingsRate.toFixed(1)}%`} />
            <SimulatorMetric label="年間で残るお金" before={formatCurrency(result.annualSavings)} after={formatCurrency(improvedAnnualSavings)} />
            <SimulatorMetric label="3か月分の貯金まで" before={formatCurrency(currentThreeMonthGap)} after={formatCurrency(improvedThreeMonthGap)} />
          </div>
          <p className="mt-3 rounded-lg bg-white p-3 text-xs leading-5 text-slate-600">
            この削減が続くと、1年で{formatCurrency(annualImpact)}ぶん自由に使えるお金が増えます。まずは1項目だけでも十分です。
          </p>
        </div>
      </div>
    </section>
  );
}

function CutInput({
  label,
  value,
  onChange,
  wide = false,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  wide?: boolean;
}) {
  return (
    <label className={`rounded-lg border border-slate-200 bg-slate-50 p-4 ${wide ? 'md:col-span-2' : ''}`}>
      <span className="flex items-center justify-between gap-3">
        <span className="text-sm font-black text-slate-950">{label}</span>
        <span className="text-sm font-black text-emerald-700">{formatCurrency(value)}</span>
      </span>
      <input
        type="range"
        min="0"
        max="50000"
        step="1000"
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="mt-4 w-full accent-emerald-600"
      />
      <div className="mt-3 flex items-center gap-2">
        <input
          type="number"
          min="0"
          max="100000"
          step="1000"
          value={value}
          onChange={(event) => onChange(Number(event.target.value))}
          className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm font-bold text-slate-950"
        />
        <span className="shrink-0 text-xs font-bold text-slate-500">円/月</span>
      </div>
    </label>
  );
}

function SimulatorMetric({ label, before, after }: { label: string; before: string; after: string }) {
  return (
    <div className="rounded-lg border border-slate-100 bg-white p-3">
      <p className="text-xs font-black text-slate-500">{label}</p>
      <div className="mt-2 flex items-center justify-between gap-3 text-sm">
        <span className="font-bold text-slate-500">{before}</span>
        <ArrowRight className="h-4 w-4 shrink-0 text-emerald-700" />
        <span className="font-black text-slate-950">{after}</span>
      </div>
    </div>
  );
}

function TimeToolImpactDetail({ tool }: { tool: TimeToolRecommendationWithImpact }) {
  const amazonUrl = buildAmazonAffiliateUrl(tool.amazonQuery);
  const monthlySavedHours = tool.annualSavedHours / 12;
  const monthlyValue = monthlySavedHours * tool.hourlyValue;
  const measuredYears = Math.min(5, tool.lifespanYears);
  const totalTimeValue = monthlyValue * 12 * measuredYears;
  const paybackLabel = tool.paybackYears < 1
    ? `${Math.round(tool.paybackYears * 12)}か月後`
    : `${tool.paybackYears.toFixed(1)}年後`;
  const profitTone = tool.fiveYearProfit >= 0 ? 'text-emerald-700' : 'text-rose-700';

  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 xl:min-h-[560px]">
      <div className="grid gap-5 2xl:grid-cols-[1fr_280px]">
        <div>
          <p className="text-xs font-bold text-emerald-700">もしあなたが使うと</p>
          <h4 className="mt-1 text-xl font-black leading-tight text-slate-950">
            {tool.title}で、毎月約{Math.round(monthlySavedHours)}時間の自由時間が生まれます。
          </h4>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            その時間を平均的な時給目安の{formatYen(tool.hourlyValue)}で見ると、毎月約{formatYen(monthlyValue)}分の時間価値です。
            購入をすすめるためではなく、家事や手間に使っている時間の重さを比べるための目安です。
          </p>
          <div className="mt-4 grid gap-2 sm:grid-cols-3">
            <TimeToolMetric label="毎月戻る時間" value={`約${Math.round(monthlySavedHours)}時間`} />
            <TimeToolMetric label="毎月の時間価値" value={`約${formatYen(monthlyValue)}`} />
            <TimeToolMetric label="元を取る目安" value={paybackLabel} />
          </div>
        </div>

        <div className="rounded-lg border border-white bg-white p-4 shadow-sm">
          <p className="text-xs font-black text-slate-500">5年分の時間価値</p>
          <p className={`mt-2 text-3xl font-black ${profitTone}`}>
            {tool.fiveYearProfit >= 0 ? '+' : ''}{formatYen(tool.fiveYearProfit)}
          </p>
          <div className="mt-3 space-y-2 rounded-lg border border-slate-100 bg-slate-50 p-3 text-xs leading-5 text-slate-600">
            <div className="flex items-center justify-between gap-3">
              <span>毎月の時間価値</span>
              <span className="font-black text-slate-950">{formatYen(monthlyValue)}</span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span>{measuredYears}年分の時間価値</span>
              <span className="font-black text-slate-950">{formatYen(totalTimeValue)}</span>
            </div>
            <div className="flex items-center justify-between gap-3 border-t border-slate-200 pt-2">
              <span>目安価格を差し引き</span>
              <span className="font-black text-slate-950">-{formatYen(tool.price)}</span>
            </div>
          </div>
          <p className="mt-2 text-xs leading-5 text-slate-500">
            計算: 毎月の時間価値 × 12か月 × {measuredYears}年 - 目安価格
          </p>
          <a
            href={amazonUrl}
            target="_blank"
            rel="nofollow sponsored noopener noreferrer"
            className="mt-4 inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-slate-950 px-3 text-sm font-black text-white transition hover:bg-slate-800"
          >
            Amazonで価格を見る
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </div>
    </div>
  );
}

function formatYen(value: number): string {
  return `${Math.round(value).toLocaleString('ja-JP')}円`;
}

function TimeToolMetric({
  label,
  value,
  valueClassName = 'text-slate-950',
}: {
  label: string;
  value: string;
  valueClassName?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-slate-100 bg-white px-3 py-2">
      <span className="text-xs font-bold text-slate-500">{label}</span>
      <span className={`text-sm font-black ${valueClassName}`}>{value}</span>
    </div>
  );
}

function buildAmazonAffiliateUrl(query: string) {
  const tag = String(import.meta.env.VITE_AMAZON_ASSOCIATE_TAG ?? '').trim();
  const params = new URLSearchParams({
    k: query,
  });

  if (tag) {
    params.set('tag', tag);
  }

  return `https://www.amazon.co.jp/s?${params.toString()}`;
}

export function CollapsibleSection({
  title,
  body,
  children,
}: {
  title: string;
  body: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <section className="rounded-lg border border-slate-200 bg-white shadow-sm">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="flex w-full items-center justify-between gap-4 p-5 text-left"
        aria-expanded={open}
      >
        <div>
          <h3 className="text-lg font-black text-slate-950">{title}</h3>
          <p className="mt-1 text-sm leading-6 text-slate-600">{body}</p>
        </div>
        <ChevronDown className={`h-5 w-5 shrink-0 text-slate-500 transition ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && <div className="space-y-5 border-t border-slate-200 p-5">{children}</div>}
    </section>
  );
}

function Metric({
  label,
  value,
  tone,
  insight,
  helper,
}: {
  label: string;
  value: string;
  tone: 'good' | 'warn' | 'danger' | 'neutral';
  insight?: string;
  helper?: string;
}) {
  const toneClass = {
    good: 'bg-emerald-50 text-emerald-800 border-emerald-100',
    warn: 'bg-amber-50 text-amber-800 border-amber-100',
    danger: 'bg-rose-50 text-rose-800 border-rose-100',
    neutral: 'bg-slate-50 text-slate-800 border-slate-100',
  }[tone];

  return (
    <div className={`rounded-lg border p-3 ${toneClass}`}>
      <p className="text-xs font-bold">{label}</p>
      <p className="mt-1 text-lg font-black">{value}</p>
      {insight && <p className="mt-2 text-xs font-black">{insight}</p>}
      {helper && <p className="mt-1 text-xs leading-5 opacity-80">{renderClickableTerms(helper)}</p>}
    </div>
  );
}

function GaugeCard({
  title,
  value,
  progress,
  body,
  icon,
}: {
  title: ReactNode;
  value: string;
  progress: number;
  body: string;
  icon?: ReactNode;
}) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <h3 className="inline-flex items-center gap-2 font-black text-slate-950">
          {icon && <span className="text-emerald-700">{icon}</span>}
          {title}
        </h3>
        <span className="text-sm font-black text-emerald-700">{value}</span>
      </div>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
        <div className="h-full rounded-full bg-emerald-600" style={{ width: `${progress}%` }} />
      </div>
      <p className="mt-3 text-xs leading-5 text-slate-600">{renderClickableTerms(body)}</p>
    </div>
  );
}

const TERM_HELP: Record<string, { title: string; body: string }> = {
  '急な出費にそなえる貯金': {
    title: '急な出費にそなえる貯金とは',
    body: '病気、引っ越し、家電の故障、収入の一時的な減少などに備える、すぐ使える貯金です。この診断では投資しているお金を含めません。',
  },
  '貯蓄率': {
    title: '貯蓄率とは',
    body: '手取り収入のうち、毎月残せている割合です。月の余力 ÷ 月収（手取り）でざっくり見ます。',
  },
  '資産で生活費を支える目安': {
    title: '資産で生活費を支える目安とは',
    body: '年間支出を、取り崩し率で割った参考値です。退職できるかを断定するものではなく、生活費の何%を資産が支えられるかを見るための概算です。',
  },
  '取り崩し率': {
    title: '取り崩し率とは',
    body: '資産から毎年いくら生活費へ回すかの参考率です。この診断では2.5%、3.0%、3.5%を中心に見て、4.0%は米国過去データの参考線として扱います。',
  },
  'NISA': {
    title: 'NISAとは',
    body: '投資で得た利益に国内の非課税メリットがある制度です。万能ではなく、損失通算や外国課税などは条件があるため、生活防衛資金とは分けて考えます。',
  },
  '介護保険料': {
    title: '介護保険料とは',
    body: '40歳から払う、介護保険のためのお金です。会社員は給料から引かれることが多く、自営業や退職後は自治体などへ払います。金額は収入や住んでいる地域で変わるため、このアプリでは目安として扱います。',
  },
  '年金保険料': {
    title: '年金保険料とは',
    body: '国民年金など、自分で払う年金の保険料です。会社員で給料から厚生年金が引かれている場合、この診断の「自分で払う保険料」には入れなくて大丈夫です。',
  },
  '公的年金': {
    title: '公的年金とは',
    body: '原則65歳から受け取る年金です。国民年金は目安を出しやすいですが、会社員の年金は給料や働いた年数で大きく変わります。',
  },
  '医療費負担': {
    title: '医療費負担とは',
    body: '病院や薬局で支払う自己負担のことです。年齢や所得で割合が変わるため、この診断では制度メモとして扱います。',
  },
  '後期高齢者医療制度': {
    title: '後期高齢者医療制度とは',
    body: '原則75歳から入る医療保険制度です。保険料や窓口負担は所得や自治体などで変わります。',
  },
};

function renderClickableTerms(text: string): ReactNode {
  const terms = Object.keys(TERM_HELP).sort((a, b) => b.length - a.length);
  const pattern = new RegExp(`(${terms.map(escapeRegExp).join('|')})`, 'g');
  const parts = text.split(pattern);

  return parts.map((part, index) => {
    if (TERM_HELP[part]) {
      return <TermHelp key={`${part}-${index}`} term={part} />;
    }

    return part;
  });
}

function escapeRegExp(text: string) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function TermHelp({ term }: { term: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const help = TERM_HELP[term];

  if (!help) {
    return <>{term}</>;
  }

  return (
    <span className="relative inline-flex align-baseline">
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className="inline-flex items-center gap-0.5 rounded px-0.5 font-bold text-emerald-700 underline decoration-emerald-300 decoration-2 underline-offset-2 transition hover:bg-emerald-50 hover:text-emerald-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
        aria-expanded={isOpen}
        aria-label={`${term}の説明を${isOpen ? '閉じる' : '開く'}`}
      >
        {term}
        <Info className="h-3 w-3" aria-hidden="true" />
      </button>
      {isOpen && (
        <span className="absolute left-0 top-full z-20 mt-2 w-72 rounded-lg border border-slate-200 bg-white p-3 text-left text-xs leading-5 text-slate-600 shadow-lg">
          <span className="block font-black text-slate-950">{help.title}</span>
          <span className="mt-1 block">{help.body}</span>
        </span>
      )}
    </span>
  );
}
