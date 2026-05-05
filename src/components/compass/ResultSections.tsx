import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  ChevronDown,
  CheckCircle2,
  CircleDollarSign,
  Flag,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  WalletCards,
  MapPinned,
} from 'lucide-react';
import type React from 'react';
import type { CompassResult, Mission } from '../../utils/compass';
import { formatCurrency } from '../../utils/calculations';

export function StartPanel() {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <div className="grid gap-6 xl:grid-cols-[1fr_320px]">
        <div>
          <p className="mb-3 inline-flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700">
            <MapPinned className="h-4 w-4" />
            生活コンパス
          </p>
          <h2 className="text-3xl font-black leading-tight text-slate-950">
            今の位置と、次の1手を知る。
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
            貯金できない、毎月ギリギリ、働く時間を減らしたい。そんな状態でも、今どこにいて、このままだとどうなり、何から始めるかを1つに絞って出します。
          </p>
        </div>
        <div className="grid gap-3">
          <Feature icon={WalletCards} title="今の位置" body="同年代の目安と比べて、どのあたりかを出します。" />
          <Feature icon={Target} title="このままだと" body="余力がないまま進んだ時の詰まりやすさを見ます。" />
          <Feature icon={CircleDollarSign} title="次の1手" body="今やるミッションを1つだけ出します。" />
        </div>
      </div>
    </section>
  );
}

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
        Lv.{result.rpgStatus.level} {result.rpgStatus.title}
      </div>
      <div className="space-y-3">
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
          <p className="text-xs font-black text-emerald-800">今の位置</p>
          <p className="mt-1 text-2xl font-black text-slate-950">{result.story.positionLabel}</p>
          <p className="mt-2 text-sm leading-6 text-slate-700">{result.story.positionHelper}</p>
        </div>
        <StoryStep
          index="1"
          title="あなたはこういう状況です"
          body={result.story.currentStatusText}
          helper={result.story.currentStatusHelper}
        >
          <div className="mt-4 flex flex-col gap-4">
            <RpgStatusPanel result={result} />
            <DetailMetrics result={result} />
          </div>
        </StoryStep>
        <StoryStep
          index="2"
          title="このままだと"
          body={result.story.baselineFutureText}
          helper={result.story.baselineFutureHelper}
        >
          <div className="mt-4">
            <ProjectionChart result={result} />
          </div>
        </StoryStep>
        <StoryStep
          index="3"
          title="でも、こうすると"
          body={result.story.improvedFutureText}
          helper="年4%は期待値です。毎月受け取れるお金や将来の成果を保証するものではありません。"
          accent
        >
          <div className="mt-4 flex flex-col gap-4">
            <GoalSteps result={result} />
            <InvestmentNote />
          </div>
        </StoryStep>
      </div>

      {mission && (
        <div className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 p-4">
          <p className="text-xs font-black text-emerald-800">だから、まずこれ</p>
          <h3 className="mt-1 text-xl font-black text-slate-950">{mission.title}</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">{result.story.improvedActionText}</p>
          <button
            type="button"
            onClick={() => onSelect(mission.id)}
            disabled={completed}
            className="mt-4 h-11 w-full rounded-lg bg-slate-950 px-4 text-sm font-black text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-emerald-600 sm:w-auto"
          >
            {completed ? '完了済' : 'このミッションを進める'}
          </button>
        </div>
      )}
    </section>
  );
}

function StoryStep({
  index,
  title,
  body,
  helper,
  accent = false,
  children,
}: {
  index: string;
  title: string;
  body: string;
  helper?: string;
  accent?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <div className={`rounded-lg border p-4 ${accent ? 'border-emerald-200 bg-emerald-50' : 'border-slate-200 bg-slate-50'}`}>
      <div className="flex gap-3">
        <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm font-black ${accent ? 'bg-emerald-600 text-white' : 'bg-slate-950 text-white'}`}>
          {index}
        </span>
        <div className="flex-1">
          <h3 className="font-black text-slate-950">{title}</h3>
          <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-700 font-bold">{body}</p>
          {helper && <p className="mt-2 text-xs leading-5 text-slate-500">{helper}</p>}
          {children && <div className="mt-4 border-t border-slate-200 pt-4">{children}</div>}
        </div>
      </div>
    </div>
  );
}

export function DiagnosisScopeNote() {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <h3 className="font-black text-slate-950">この診断でわかること</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            月の余力、貯蓄率、貯金だけで見た生活防衛資金、今やるミッションの目安がわかります。
            同年代比較は正確な順位ではなく、ざっくりした位置の目安です。
          </p>
        </div>
        <div>
          <h3 className="font-black text-slate-950">この診断でわからないこと</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            将来の収入、税金、相場、医療費、個別の投資判断はわかりません。
            40歳から介護保険料が始まることなど制度上の年齢ポイントはありますが、金額は人によって違います。投資利回りは投資資産だけに適用し、将来の成果を保証しません。
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
            Lv.{result.rpgStatus.level} {result.rpgStatus.title}
          </p>
          <h2 className="text-2xl font-black leading-tight text-slate-950">{result.headline}</h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            今の優先テーマは「{result.rpgStatus.bossName}」。FIREは最終ゴールのひとつですが、まずは
            {result.rpgStatus.stageName} を進めて、働き方の選択肢を増やします。
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
            label="生活防衛資金"
            value={result.rpgStatus.shieldLabel}
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
  return (
    <section className="grid gap-3 sm:grid-cols-2">
      <Metric label="総資産" value={formatCurrency(result.totalAssets)} tone="neutral" />
      <Metric label="FIRE目標" value={formatCurrency(result.fireNumber)} tone="neutral" />
    </section>
  );
}

export function RpgStatusPanel({ result }: { result: CompassResult }) {
  return (
    <section className="grid gap-4 md:grid-cols-3">
      <GaugeCard
        title="生活防衛資金"
        value={result.rpgStatus.shieldLabel}
        progress={result.rpgStatus.shieldProgress}
        body="貯金だけで見ます。6か月分あると、収入が揺れても考える時間を確保しやすくなります。"
      />
      <GaugeCard
        title="毎月の余力"
        value={`${Math.max(0, result.savingsRate).toFixed(1)}%`}
        progress={Math.max(0, Math.min(100, result.savingsRate * 2))}
        body="毎月の黒字が自由時間の燃料です。"
      />
      <GaugeCard
        title="働き方の軽さ"
        value={result.rpgStatus.workLightnessLabel}
        progress={result.rpgStatus.workLightnessProgress}
        body="守りと余力が増えるほど、働き方を選びやすくなります。"
      />
    </section>
  );
}

export function ProjectionChart({ result }: { result: CompassResult }) {
  return (
    <section className="grid gap-6 xl:grid-cols-[1fr_320px]">
      <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase text-emerald-700">Projection</p>
            <h3 className="text-lg font-black text-slate-950">資産推移の概算</h3>
          </div>
          <TrendingUp className="h-5 w-5 text-emerald-700" />
        </div>
        <div className="h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={result.projection} margin={{ left: 0, right: 12, top: 8, bottom: 0 }}>
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
              <Tooltip formatter={(value) => formatCurrency(Number(value))} labelFormatter={(label) => `${label}歳`} />
              <Area type="monotone" dataKey="cashSavings" name="貯金" stackId="assets" stroke="#059669" strokeWidth={2} fill="url(#assetFill)" />
              <Area type="monotone" dataKey="investedAssets" name="投資資産" stackId="assets" stroke="#2563eb" strokeWidth={2} fill="#dbeafe" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <p className="mt-3 text-xs leading-5 text-slate-500">
          このグラフは、生活防衛資金が3か月分に届くまでは余力を貯金へ、その後の余力を投資資産へ回す概算です。投資前提は投資資産だけにかかります。
        </p>
      </div>

      <div className="rounded-lg border border-slate-200 bg-slate-950 p-5 text-white shadow-sm">
        <p className="text-xs font-bold uppercase text-emerald-300">Next step</p>
        <h3 className="mt-2 text-xl font-black">{result.nextGoal.label}</h3>
        <div className="mt-5">
          <div className="mb-2 flex items-center justify-between text-sm font-bold">
            <span>進捗</span>
            <span>{Math.round(result.nextGoal.progress)}%</span>
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-white/15">
            <div className="h-full rounded-full bg-emerald-400" style={{ width: `${result.nextGoal.progress}%` }} />
          </div>
        </div>
        <p className="mt-4 text-sm leading-6 text-slate-300">{result.nextGoal.helper}</p>
        {result.cashEmergencyFundMonths < 3 && (
          <p className="mt-3 rounded-lg bg-amber-400/15 p-3 text-sm leading-6 text-amber-100">
            総資産があっても、まずは現金の守りを3か月分まで育てるのが優先です。
          </p>
        )}
        <div className="mt-5 rounded-lg bg-white/10 p-4">
          <p className="text-xs font-bold text-slate-300">必要ライン</p>
          <p className="mt-1 text-2xl font-black">{formatCurrency(result.nextGoal.targetAmount)}</p>
        </div>
      </div>
    </section>
  );
}

export function GoalSteps({ result }: { result: CompassResult }) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-5 flex items-center gap-2">
        <Target className="h-5 w-5 text-emerald-700" />
        <h3 className="text-lg font-black text-slate-950">段階ゴール</h3>
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
          <h3 className="font-black text-slate-950">投資についての前提</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            生活防衛資金は貯金だけで判定します。生活防衛資金が不足している間は、投資より現金の守りを優先します。
            投資を始める場合は、NISAなどの制度を調べつつ、長期・分散・低コストを基本にしてください。
            投資利回りは投資資産だけに適用します。このアプリは特定銘柄の推奨や利益保証を行いません。
            表示される同年代比較は、正確な順位ではなく、ざっくりした位置の目安です。
          </p>
        </div>
      </div>
    </section>
  );
}

export function CollapsibleSection({
  title,
  body,
  open,
  onToggle,
  children,
}: {
  title: string;
  body: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white shadow-sm">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-4 p-5 text-left"
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
      {helper && <p className="mt-1 text-xs leading-5 opacity-80">{helper}</p>}
    </div>
  );
}

function GaugeCard({ title, value, progress, body }: { title: string; value: string; progress: number; body: string }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-black text-slate-950">{title}</h3>
        <span className="text-sm font-black text-emerald-700">{value}</span>
      </div>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
        <div className="h-full rounded-full bg-emerald-600" style={{ width: `${progress}%` }} />
      </div>
      <p className="mt-3 text-xs leading-5 text-slate-600">{body}</p>
    </div>
  );
}

function Feature({
  icon: Icon,
  title,
  body,
}: {
  icon: typeof WalletCards;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-lg border border-slate-200 bg-stone-50 p-4">
      <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-100 text-emerald-800">
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="font-black text-slate-950">{title}</h3>
      <p className="mt-1 text-sm leading-6 text-slate-600">{body}</p>
    </div>
  );
}
