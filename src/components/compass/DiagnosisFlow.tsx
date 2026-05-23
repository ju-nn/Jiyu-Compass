import {
  ArrowLeft,
  ArrowRight,
  Briefcase,
  CheckCircle2,
  HeartPulse,
  Home,
  ListChecks,
  Save,
  Sparkles,
  WalletCards,
} from 'lucide-react';
import { useState, type ReactNode } from 'react';
import type {
  CareerReadinessLevel,
  CompassInputs,
  DiagnosisStep,
  EmploymentType,
  ExperienceLevel,
  HouseholdRiskLevel,
  MoneyStressLevel,
  WorkFlexibilityLevel,
  WorkPainLevel,
  WorkReductionGoal,
} from '../../utils/compass';
import {
  ChoiceGrid,
  NumberField,
} from './fields';
import {
  careerReadinessOptions,
  employmentTypeOptions,
  householdRiskOptions,
  moneyReadinessOptions,
  moneyStressOptions,
  workFlexibilityOptions,
  workGoalOptions,
  workPainOptions,
} from './fieldOptions';

interface DiagnosisFlowProps {
  inputs: CompassInputs;
  step: DiagnosisStep;
  onChange: <K extends keyof CompassInputs>(key: K, value: CompassInputs[K]) => void;
  onStepChange: (step: DiagnosisStep) => void;
}

type DetailStepId = 'money' | 'fixed' | 'work' | 'readiness';

const detailSteps: {
  id: DetailStepId;
  title: string;
  shortTitle: string;
  body: string;
  icon: ReactNode;
}[] = [
  {
    id: 'money',
    title: '資産と安定収入',
    shortTitle: '資産',
    body: '資産が生活費をどれくらい支えるかを見るための追加項目です。',
    icon: <WalletCards className="h-4 w-4" />,
  },
  {
    id: 'fixed',
    title: '毎月の固定負担',
    shortTitle: '固定負担',
    body: '生活費と返済を分けると、月の余力と生活防衛資金を見やすくできます。',
    icon: <Home className="h-4 w-4" />,
  },
  {
    id: 'work',
    title: '働き方の重さ',
    shortTitle: '働き方',
    body: '退職ではなく、有給・残業整理・在宅相談など低リスクな順番を出しやすくします。',
    icon: <Briefcase className="h-4 w-4" />,
  },
  {
    id: 'readiness',
    title: '不安と準備の進み具合',
    shortTitle: '準備',
    body: '守りを優先するか、転職準備や投資学習へ進むかの出し分けに使います。',
    icon: <HeartPulse className="h-4 w-4" />,
  },
];

export function DiagnosisFlow({ inputs, step, onChange, onStepChange }: DiagnosisFlowProps) {
  const [detailStepIndex, setDetailStepIndex] = useState(0);
  const activeIndex = step === 'profile' ? 0 : step === 'result' ? 1 : step === 'life' ? 2 : 3;
  const activeDetailStep = detailSteps[detailStepIndex];
  const combinedLoanPayment = inputs.monthlyStudentLoanPayment
    + inputs.monthlyHousingLoanPayment
    + inputs.monthlyCarLoanPayment;

  const handleCombinedLoanChange = (value: number) => {
    onChange('monthlyStudentLoanPayment', value);
    onChange('monthlyHousingLoanPayment', 0);
    onChange('monthlyCarLoanPayment', 0);
  };

  const handleMoneyReadinessChange = (value: ExperienceLevel) => {
    onChange('savingsExperience', value);
    onChange('investmentExperience', value);
  };

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase text-emerald-700">Start</p>
          <h2 className="text-xl font-black text-slate-950">30秒で余力を見る</h2>
        </div>
        <div className="flex gap-1">
          {[0, 1, 2, 3].map((item) => (
            <div
              key={item}
              className={`h-2.5 w-8 rounded-full ${item <= activeIndex ? 'bg-emerald-600' : 'bg-slate-200'}`}
            />
          ))}
        </div>
      </div>

      {step === 'profile' && (
        <div className="space-y-5">
          <StepHeader
            title="まず生活防衛資金を見る"
            body="手元でだいたいわかる数字だけでOKです。生活がどれくらい揺れにくいかと、最初の一歩を見ます。"
          />
          <div className="grid gap-3 sm:grid-cols-2">
            <NumberField label="年齢" value={inputs.currentAge} unit="歳" onChange={(value) => onChange('currentAge', value)} />
            <NumberField label="貯金" value={inputs.cashSavings} unit="万円" multiplier={10000} onChange={(value) => onChange('cashSavings', value)} />
            <NumberField label="月収（手取り）" value={inputs.monthlyIncome} unit="万円" multiplier={10000} onChange={(value) => onChange('monthlyIncome', value)} />
            <NumberField label="月の生活費（だいたい）" value={inputs.monthlyExpenses} unit="万円" multiplier={10000} onChange={(value) => onChange('monthlyExpenses', value)} />
          </div>
          <div className="rounded-lg border border-emerald-100 bg-emerald-50 p-4 text-sm leading-6 text-slate-700">
            月収は税金や社会保険料が引かれた後の手取りです。生活費は家賃・食費・通信費など、毎月出ていくお金の合計でOKです。
          </div>
          <button
            type="button"
            onClick={() => onStepChange('result')}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 text-sm font-black text-white transition hover:bg-emerald-700"
          >
            すぐ結果を見る
            <Sparkles className="h-4 w-4" />
          </button>
        </div>
      )}

      {step === 'life' && (
        <div className="space-y-5">
          <StepHeader
            title="必要なところだけ、1つずつ"
            body="詳細入力はアンケートではありません。結果に効く項目だけを短く確認します。いつ離れても、ここまでの入力は自動保存されます。"
          />

          <div className="flex items-start gap-3 rounded-lg border border-emerald-100 bg-emerald-50 p-4 text-sm leading-6 text-slate-700">
            <Save className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700" />
            <div>
              <p className="font-black text-slate-950">途中で結果へ戻れます</p>
              <p className="mt-1">わからない項目はそのままで大丈夫です。入力済みの項目だけを使って、結果を少し自分向けにします。</p>
            </div>
          </div>

          <div className="grid gap-2 sm:grid-cols-4">
            {detailSteps.map((item, index) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setDetailStepIndex(index)}
                className={`flex h-11 items-center justify-center gap-2 rounded-lg border px-3 text-sm font-black transition ${
                  index === detailStepIndex
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-800'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                {item.icon}
                {item.shortTitle}
              </button>
            ))}
          </div>

          <DetailInputPanel
            title={activeDetailStep.title}
            body={activeDetailStep.body}
            countLabel={`${detailStepIndex + 1} / ${detailSteps.length}`}
          >
            {activeDetailStep.id === 'money' && (
              <div className="space-y-4">
                <div className="grid gap-3 sm:grid-cols-2">
                  <NumberField label="投資しているお金" value={inputs.investedAssets} unit="万円" multiplier={10000} onChange={(value) => onChange('investedAssets', value)} />
                  <NumberField label="月の安定副収入" value={inputs.monthlyStableSideIncome} unit="万円" multiplier={10000} onChange={(value) => onChange('monthlyStableSideIncome', value)} />
                </div>
                <p className="rounded-lg bg-white px-3 py-2 text-xs font-bold leading-5 text-slate-600 shadow-sm">
                  生活防衛資金は、投資ではなくすぐ使える貯金を主に見ます。投資額は「生活費の一部を資産で支えられるか」の目安に使います。
                </p>
              </div>
            )}

            {activeDetailStep.id === 'fixed' && (
              <div className="space-y-4">
                <div className="grid gap-3 sm:grid-cols-2">
                  <NumberField label="月の生活費（返済などを除く）" value={inputs.monthlyExpenses} unit="万円" multiplier={10000} onChange={(value) => onChange('monthlyExpenses', value)} />
                  <NumberField label="毎月の返済（合計）" value={combinedLoanPayment} unit="万円" multiplier={10000} onChange={handleCombinedLoanChange} />
                  <NumberField label="自分で払う社会保険料など" value={inputs.monthlyPensionContribution} unit="万円" multiplier={10000} onChange={(value) => onChange('monthlyPensionContribution', value)} />
                  <NumberField label="年金が少なくなりそうな年数" value={inputs.pensionReducedYears} unit="年" onChange={(value) => onChange('pensionReducedYears', value)} />
                </div>
                <p className="rounded-lg bg-white px-3 py-2 text-xs font-bold leading-5 text-slate-600 shadow-sm">
                  生活費に返済や自分で払う国民年金・国民健康保険を含めている場合は、ここは0円で大丈夫です。二重入力を避けます。
                </p>
              </div>
            )}

            {activeDetailStep.id === 'work' && (
              <div className="space-y-5">
                <QuestionBlock label="今いちばん近い気持ち">
                  <ChoiceGrid<WorkReductionGoal>
                    value={inputs.workReductionGoal}
                    options={workGoalOptions}
                    onChange={(value) => onChange('workReductionGoal', value)}
                  />
                </QuestionBlock>

                <div className="grid gap-4 lg:grid-cols-2">
                  <QuestionBlock label="働き方">
                    <ChoiceGrid<EmploymentType>
                      value={inputs.employmentType}
                      options={employmentTypeOptions}
                      onChange={(value) => onChange('employmentType', value)}
                    />
                  </QuestionBlock>
                  <QuestionBlock label="家族・固定費の重さ">
                    <ChoiceGrid<HouseholdRiskLevel>
                      value={inputs.householdRisk}
                      options={householdRiskOptions}
                      onChange={(value) => onChange('householdRisk', value)}
                    />
                  </QuestionBlock>
                </div>

                <QuestionBlock label="仕事のしんどさ">
                  <ChoiceGrid<WorkPainLevel>
                    value={inputs.workPain}
                    options={workPainOptions}
                    onChange={(value) => onChange('workPain', value)}
                  />
                </QuestionBlock>

                <QuestionBlock label="今の会社で軽くできそうな余地">
                  <ChoiceGrid<WorkFlexibilityLevel>
                    value={inputs.workFlexibility}
                    options={workFlexibilityOptions}
                    onChange={(value) => onChange('workFlexibility', value)}
                  />
                </QuestionBlock>
              </div>
            )}

            {activeDetailStep.id === 'readiness' && (
              <div className="space-y-5">
                <QuestionBlock label="転職や働き方変更の準備">
                  <ChoiceGrid<CareerReadinessLevel>
                    value={inputs.careerReadiness}
                    options={careerReadinessOptions}
                    onChange={(value) => onChange('careerReadiness', value)}
                  />
                </QuestionBlock>

                <QuestionBlock label="お金の準備感">
                  <ChoiceGrid<ExperienceLevel>
                    value={inputs.savingsExperience || inputs.investmentExperience}
                    options={moneyReadinessOptions}
                    onChange={handleMoneyReadinessChange}
                  />
                </QuestionBlock>

                <QuestionBlock label="お金の不安感">
                  <ChoiceGrid<MoneyStressLevel>
                    value={inputs.moneyStress}
                    options={moneyStressOptions}
                    onChange={(value) => onChange('moneyStress', value)}
                  />
                </QuestionBlock>
              </div>
            )}
          </DetailInputPanel>

          <div className="grid gap-3 sm:grid-cols-[1fr_auto_auto]">
            <button
              type="button"
              onClick={() => onStepChange('result')}
              className="h-12 rounded-lg border border-slate-200 bg-white px-4 text-sm font-black text-slate-700 transition hover:bg-slate-50"
            >
              ここまでで結果へ戻る
            </button>
            <button
              type="button"
              onClick={() => setDetailStepIndex((current) => Math.max(0, current - 1))}
              disabled={detailStepIndex === 0}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-sm font-black text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ArrowLeft className="h-4 w-4" />
              前へ
            </button>
            {detailStepIndex < detailSteps.length - 1 ? (
              <button
                type="button"
                onClick={() => setDetailStepIndex((current) => Math.min(detailSteps.length - 1, current + 1))}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 text-sm font-black text-white transition hover:bg-emerald-700"
              >
                次へ
                <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => onStepChange('result')}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 text-sm font-black text-white transition hover:bg-emerald-700"
              >
                結果を更新する
                <Sparkles className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {(step === 'result' || step === 'quest') && (
        <div className="space-y-4">
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-700" />
              <div>
                <h3 className="font-black text-slate-950">診断が出ました</h3>
                <p className="mt-1 text-sm leading-6 text-slate-600">
                  結果を見ながら、今やる一歩を1つ確認します。必要なところだけ追加すると、生活防衛資金や働き方ミッションが少し自分向けになります。
                </p>
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onStepChange('life')}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-slate-950 px-4 text-sm font-black text-white transition hover:bg-slate-800"
          >
            必要なところだけ詳しく入れる
            <ListChecks className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => onStepChange('profile')}
            className="h-11 w-full rounded-lg border border-slate-200 bg-white text-sm font-black text-slate-700 transition hover:bg-slate-50"
          >
            最初の4つを直す
          </button>
        </div>
      )}
    </section>
  );
}

function StepHeader({ title, body }: { title: string; body: string }) {
  return (
    <div>
      <h3 className="text-lg font-black text-slate-950">{title}</h3>
      <p className="mt-1 text-sm leading-6 text-slate-600">{body}</p>
    </div>
  );
}

function DetailInputPanel({
  title,
  body,
  countLabel,
  children,
}: {
  title: string;
  body: string;
  countLabel: string;
  children: ReactNode;
}) {
  return (
    <section className="space-y-4 rounded-lg border border-slate-200 bg-slate-50 p-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-black text-emerald-700">入力ステップ {countLabel}</p>
          <h3 className="mt-1 text-base font-black text-slate-950">{title}</h3>
          <p className="mt-1 text-sm leading-6 text-slate-600">{body}</p>
        </div>
        <span className="w-fit rounded-lg bg-white px-2 py-1 text-xs font-black text-slate-600 shadow-sm">
          任意
        </span>
      </div>
      {children}
    </section>
  );
}

function QuestionBlock({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-bold text-slate-800">{label}</label>
      {children}
    </div>
  );
}
