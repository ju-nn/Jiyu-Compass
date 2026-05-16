import { CheckCircle2, ListChecks, Sparkles } from 'lucide-react';
import type {
  CompassInputs,
  DiagnosisStep,
  ExperienceLevel,
  MoneyStressLevel,
  WorkPainLevel,
  WorkReductionGoal,
} from '../../utils/compass';
import {
  ChoiceGrid,
  NumberField,
  SelectField,
} from './fields';
import {
  experienceOptions,
  moneyStressOptions,
  workGoalOptions,
  workPainOptions,
} from './fieldOptions';

interface DiagnosisFlowProps {
  inputs: CompassInputs;
  step: DiagnosisStep;
  onChange: <K extends keyof CompassInputs>(key: K, value: CompassInputs[K]) => void;
  onStepChange: (step: DiagnosisStep) => void;
}

export function DiagnosisFlow({ inputs, step, onChange, onStepChange }: DiagnosisFlowProps) {
  const activeIndex = step === 'profile' ? 0 : step === 'result' ? 1 : step === 'life' ? 2 : 3;

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
            title="まず今の生活防壁を見る"
            body="手元でだいたいわかる数字だけでOKです。生活がどれくらい揺れにくいかと、最初の一歩を見ます。"
          />
          <div className="grid gap-3 sm:grid-cols-2">
            <NumberField label="年齢" value={inputs.currentAge} unit="歳" onChange={(value) => onChange('currentAge', value)} />
            <NumberField label="貯金" value={inputs.cashSavings} unit="万円" multiplier={10000} onChange={(value) => onChange('cashSavings', value)} />
            <NumberField label="月収（手取り）" value={inputs.monthlyIncome} unit="万円" multiplier={10000} onChange={(value) => onChange('monthlyIncome', value)} />
            <NumberField label="月の生活費（だいたい）" value={inputs.monthlyExpenses} unit="万円" multiplier={10000} onChange={(value) => onChange('monthlyExpenses', value)} />
          </div>
          <div className="rounded-lg border border-emerald-100 bg-emerald-50 p-4 text-sm leading-6 text-slate-700">
            月収は税金や社会保険料が引かれた後の手取りです。生活費は家賃・食費・通信費など、毎月出ていくお金の合計でOKです。ローンや自分で払う保険料は、あとから分けて入れられます。
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
            title="もう少し詳しく"
            body="わかるところだけ足すと、毎月残るお金、生活防壁、仕事を軽くする余地が見えやすくなります。"
          />

          <div className="grid gap-3 sm:grid-cols-2">
            <NumberField label="年齢" value={inputs.currentAge} unit="歳" onChange={(value) => onChange('currentAge', value)} />
            <NumberField label="貯金" value={inputs.cashSavings} unit="万円" multiplier={10000} onChange={(value) => onChange('cashSavings', value)} />
            <NumberField label="投資しているお金" value={inputs.investedAssets} unit="万円" multiplier={10000} onChange={(value) => onChange('investedAssets', value)} />
            <NumberField label="月収（手取り）" value={inputs.monthlyIncome} unit="万円" multiplier={10000} onChange={(value) => onChange('monthlyIncome', value)} />
            <NumberField label="月の生活費（返済・保険料を除く）" value={inputs.monthlyExpenses} unit="万円" multiplier={10000} onChange={(value) => onChange('monthlyExpenses', value)} />
            <NumberField label="自分で払う保険料" value={inputs.monthlyPensionContribution} unit="万円" multiplier={10000} onChange={(value) => onChange('monthlyPensionContribution', value)} />
            <NumberField label="年金が少なくなりそうな年数" value={inputs.pensionReducedYears} unit="年" onChange={(value) => onChange('pensionReducedYears', value)} />
            <NumberField label="奨学金の返済" value={inputs.monthlyStudentLoanPayment} unit="万円" multiplier={10000} onChange={(value) => onChange('monthlyStudentLoanPayment', value)} />
            <NumberField label="住宅ローン" value={inputs.monthlyHousingLoanPayment} unit="万円" multiplier={10000} onChange={(value) => onChange('monthlyHousingLoanPayment', value)} />
            <NumberField label="車ローン" value={inputs.monthlyCarLoanPayment} unit="万円" multiplier={10000} onChange={(value) => onChange('monthlyCarLoanPayment', value)} />
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-slate-800">今いちばん近い気持ち</label>
            <ChoiceGrid<WorkReductionGoal>
              value={inputs.workReductionGoal}
              options={workGoalOptions}
              onChange={(value) => onChange('workReductionGoal', value)}
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <SelectField<ExperienceLevel>
              label="貯金の感じ"
              value={inputs.savingsExperience}
              options={experienceOptions}
              onChange={(value) => onChange('savingsExperience', value)}
            />
            <SelectField<ExperienceLevel>
              label="投資の感じ"
              value={inputs.investmentExperience}
              options={experienceOptions}
              onChange={(value) => onChange('investmentExperience', value)}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-slate-800">お金の不安感</label>
            <ChoiceGrid<MoneyStressLevel>
              value={inputs.moneyStress}
              options={moneyStressOptions}
              onChange={(value) => onChange('moneyStress', value)}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-slate-800">仕事のしんどさ</label>
            <ChoiceGrid<WorkPainLevel>
              value={inputs.workPain}
              options={workPainOptions}
              onChange={(value) => onChange('workPain', value)}
            />
          </div>

          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-600">
            <p>貯金は普通預金など、すぐ使えるお金の目安です。</p>
            <p className="mt-1">投資しているお金は、株式、投資信託、NISAなどの合計です。なければ0円で大丈夫です。</p>
            <p className="mt-1">月収は手取りです。給料から引かれている税金・社会保険料は入れなくて大丈夫です。</p>
            <p className="mt-1">月の生活費は、家賃・食費・通信費などです。下に入力したローンや自分で払う保険料は二重に入れないようにします。</p>
            <p className="mt-1">自分で払う保険料は、国民年金や国民健康保険などです。給料から引かれている分は入れなくて大丈夫です。</p>
            <p className="mt-1">年金が少なくなりそうな年数は、免除・未納・海外にいた期間などがある人だけ入れます。普通は0年で大丈夫です。</p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => onStepChange('result')}
              className="h-12 rounded-lg border border-slate-200 bg-white text-sm font-black text-slate-700 transition hover:bg-slate-50"
            >
              結果へ戻る
            </button>
            <button
              type="button"
              onClick={() => onStepChange('result')}
              className="flex h-12 items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 text-sm font-black text-white transition hover:bg-emerald-700"
            >
              結果を更新する
              <Sparkles className="h-4 w-4" />
            </button>
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
                  結果を見ながら、今やる一歩を1つ確認します。もう少し入れると、ローンや投資も生活の余力に含めて見られます。
                </p>
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onStepChange('life')}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-slate-950 px-4 text-sm font-black text-white transition hover:bg-slate-800"
          >
            もう少し詳しく入れる
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
