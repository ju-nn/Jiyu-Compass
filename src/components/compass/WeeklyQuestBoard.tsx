import { Calculator, Flag, TrendingUp } from 'lucide-react';
import { useState } from 'react';
import type { CompassResult, Mission } from '../../utils/compass';
import { formatCurrency } from '../../utils/calculations';

interface MissionGuideProps {
  result: CompassResult;
  mission: Mission;
}

const categoryLabel: Record<Mission['category'], string> = {
  saving: '支出を軽くする',
  income: '収入を安定させる',
  defense: '貯金を守る',
  investment: '投資の準備',
  work: '働き方を軽くする',
};

const difficultyLabel: Record<Mission['difficulty'], string> = {
  easy: 'すぐできる',
  normal: '少し考える',
  hard: 'しっかり見直す',
};

export function MissionGuide({ result, mission }: MissionGuideProps) {
  const defaultCut = result.monthlyBalance < 0
    ? Math.min(50000, Math.ceil(Math.abs(result.monthlyBalance) / 1000) * 1000)
    : 10000;
  const [monthlyCut, setMonthlyCut] = useState(defaultCut);
  const [extraIncome, setExtraIncome] = useState(0);

  const monthlyImpact = monthlyCut + extraIncome;
  const nextMonthlyBalance = result.monthlyBalance + monthlyImpact;
  const annualImpact = monthlyImpact * 12;
  const nextAnnualSavings = result.annualSavings + annualImpact;
  const nextSavingsRate = result.annualIncome > 0
    ? (nextMonthlyBalance / (result.annualIncome / 12)) * 100
    : 0;
  const threeMonthTarget = result.annualExpenses / 4;
  const sixMonthTarget = result.annualExpenses / 2;
  const threeMonthGap = Math.max(0, threeMonthTarget - result.cashSavings);
  const sixMonthGap = Math.max(0, sixMonthTarget - result.cashSavings);
  const monthlySavingsAfterChange = Math.max(0, nextMonthlyBalance);
  const monthsToThree = monthlySavingsAfterChange > 0 ? Math.ceil(threeMonthGap / monthlySavingsAfterChange) : null;
  const monthsToSix = monthlySavingsAfterChange > 0 ? Math.ceil(sixMonthGap / monthlySavingsAfterChange) : null;
  const statusTitle = result.monthlyBalance < 0 ? '今の不足額' : '今の余力';

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3">
          <Calculator className="mt-1 h-5 w-5 text-emerald-700" />
          <div>
            <p className="text-xs font-black text-emerald-800">次の判断</p>
            <h3 className="mt-1 text-xl font-black text-slate-950">{mission.title}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">{mission.why}</p>
          </div>
        </div>
        <div className="flex shrink-0 gap-2">
          <span className="rounded-lg bg-emerald-50 px-2 py-1 text-xs font-black text-emerald-700">
            種類: {categoryLabel[mission.category]}
          </span>
          <span className="rounded-lg bg-slate-100 px-2 py-1 text-xs font-black text-slate-600">
            手間: {difficultyLabel[mission.difficulty]}
          </span>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <section className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <h4 className="flex items-center gap-2 font-black text-slate-950">
            <Flag className="h-4 w-4 text-emerald-700" />
            {statusTitle}
          </h4>
          <div className="mt-3 grid gap-2">
            <MissionMetric label="月の収支" value={formatCurrency(result.monthlyBalance)} tone={result.monthlyBalance >= 0 ? 'good' : 'bad'} />
            <MissionMetric label="3か月分の貯金まで" value={formatCurrency(threeMonthGap)} tone={threeMonthGap === 0 ? 'good' : 'warn'} />
            <MissionMetric label="6か月分の貯金まで" value={formatCurrency(sixMonthGap)} tone={sixMonthGap === 0 ? 'good' : 'warn'} />
          </div>
          <p className="mt-3 text-xs leading-5 text-slate-500">
            急な出費用の貯金は、入力した生活費と返済・保険料をもとに計算しています。
          </p>
        </section>

        <section className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
          <h4 className="flex items-center gap-2 font-black text-slate-950">
            <TrendingUp className="h-4 w-4 text-emerald-700" />
            いくら動かすと変わるか
          </h4>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <AmountInput
              label="固定費を下げる"
              value={monthlyCut}
              max={100000}
              onChange={setMonthlyCut}
            />
            <AmountInput
              label="収入を増やす"
              value={extraIncome}
              max={100000}
              onChange={setExtraIncome}
            />
          </div>

          <div className="mt-4 grid gap-2 md:grid-cols-2">
            <MissionMetric label="月の収支" value={`${formatCurrency(result.monthlyBalance)} → ${formatCurrency(nextMonthlyBalance)}`} tone={nextMonthlyBalance >= 0 ? 'good' : 'bad'} />
            <MissionMetric label="年間で残るお金" value={formatCurrency(nextAnnualSavings)} tone={nextAnnualSavings >= 0 ? 'good' : 'bad'} />
            <MissionMetric label="貯蓄率" value={`${result.savingsRate.toFixed(1)}% → ${nextSavingsRate.toFixed(1)}%`} tone={nextSavingsRate >= 10 ? 'good' : nextSavingsRate >= 0 ? 'warn' : 'bad'} />
            <MissionMetric label="3か月分の貯金まで" value={formatMonths(monthsToThree, threeMonthGap)} tone={threeMonthGap === 0 ? 'good' : 'warn'} />
          </div>

          <p className="mt-4 rounded-lg bg-white p-3 text-sm font-bold leading-6 text-slate-700">
            {buildDecisionText(result.monthlyBalance, nextMonthlyBalance, monthlyImpact, monthsToThree, threeMonthGap, monthsToSix, sixMonthGap)}
          </p>
        </section>
      </div>
    </section>
  );
}

function AmountInput({
  label,
  value,
  max,
  onChange,
}: {
  label: string;
  value: number;
  max: number;
  onChange: (value: number) => void;
}) {
  const update = (nextValue: number) => {
    onChange(Math.max(0, Math.min(max, Math.round(nextValue))));
  };

  return (
    <label className="rounded-lg border border-emerald-100 bg-white p-3">
      <span className="flex items-center justify-between gap-3">
        <span className="text-sm font-black text-slate-950">{label}</span>
        <span className="text-sm font-black text-emerald-700">{formatCurrency(value)}/月</span>
      </span>
      <input
        type="range"
        min="0"
        max={max}
        step="1000"
        value={value}
        onChange={(event) => update(Number(event.target.value))}
        className="mt-3 w-full accent-emerald-600"
      />
      <div className="mt-2 flex items-center gap-2">
        <input
          type="number"
          min="0"
          max={max}
          step="1000"
          value={value}
          onChange={(event) => update(Number(event.target.value))}
          className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm font-bold text-slate-950"
        />
        <span className="shrink-0 text-xs font-bold text-slate-500">円/月</span>
      </div>
    </label>
  );
}

function MissionMetric({
  label,
  value,
  tone = 'neutral',
}: {
  label: string;
  value: string;
  tone?: 'good' | 'warn' | 'bad' | 'neutral';
}) {
  const toneClass = {
    good: 'text-emerald-700',
    warn: 'text-amber-700',
    bad: 'text-rose-700',
    neutral: 'text-slate-950',
  }[tone];

  return (
    <div className="rounded-lg border border-slate-100 bg-white p-3">
      <p className="text-xs font-black text-slate-500">{label}</p>
      <p className={`mt-1 text-base font-black ${toneClass}`}>{value}</p>
    </div>
  );
}

function formatMonths(months: number | null, gap: number): string {
  if (gap <= 0) {
    return '達成済み';
  }

  if (!months || !Number.isFinite(months)) {
    return '黒字化が先';
  }

  return `約${months}か月`;
}

function buildDecisionText(
  currentMonthlyBalance: number,
  nextMonthlyBalance: number,
  monthlyImpact: number,
  monthsToThree: number | null,
  threeMonthGap: number,
  monthsToSix: number | null,
  sixMonthGap: number,
): string {
  if (currentMonthlyBalance < 0 && nextMonthlyBalance >= 0) {
    if (nextMonthlyBalance === 0) {
      return `月${formatCurrency(monthlyImpact)}動かせると、赤字は止まります。ただし貯金を増やすには、あと少しだけ月の余力が必要です。`;
    }

    return `月${formatCurrency(monthlyImpact)}動かせると、赤字を止めて毎月${formatCurrency(nextMonthlyBalance)}残る計算です。まずは毎月少し残るラインを超えるかどうかが判断ポイントです。`;
  }

  if (nextMonthlyBalance < 0) {
    return `まだ月${formatCurrency(Math.abs(nextMonthlyBalance))}不足します。固定費か収入をあと${formatCurrency(Math.abs(nextMonthlyBalance))}動かせると、赤字が止まります。`;
  }

  if (threeMonthGap > 0 && monthsToThree) {
    return `このペースなら、3か月分の貯金まで約${monthsToThree}か月です。ここに届くまでは、投資より現金を厚くする判断がしやすい状態です。`;
  }

  if (sixMonthGap > 0 && monthsToSix) {
    return `3か月分は届いています。このペースなら、6か月分の貯金まで約${monthsToSix}か月です。守りを厚くするか、投資や働き方に回すかを選びやすい段階です。`;
  }

  return `急な出費用の貯金は十分あります。月${formatCurrency(monthlyImpact)}の改善分は、投資、働く時間を減らす準備、家事時間を減らす買い物に振り分けて考えられます。`;
}
