import { ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';
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
  experienceOptions,
  moneyStressOptions,
  workGoalOptions,
  workPainOptions,
} from './fields';

interface DiagnosisFlowProps {
  inputs: CompassInputs;
  step: DiagnosisStep;
  onChange: <K extends keyof CompassInputs>(key: K, value: CompassInputs[K]) => void;
  onStepChange: (step: DiagnosisStep) => void;
}

export function DiagnosisFlow({ inputs, step, onChange, onStepChange }: DiagnosisFlowProps) {
  const activeIndex = step === 'profile' ? 0 : step === 'life' ? 1 : step === 'result' ? 2 : 3;

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase text-emerald-700">Mission check-in</p>
          <h2 className="text-xl font-black text-slate-950">今やるミッション診断</h2>
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
            title="Step 1: 現在地診断"
            body="まずは今の貯金、投資資産、毎月のお金の流れを見ます。ざっくりで大丈夫です。"
          />
          <div className="grid grid-cols-2 gap-3">
            <NumberField label="年齢" value={inputs.currentAge} unit="歳" onChange={(value) => onChange('currentAge', value)} />
            <NumberField label="貯金" value={inputs.cashSavings} unit="万円" multiplier={10000} onChange={(value) => onChange('cashSavings', value)} />
            <NumberField label="投資資産 任意" value={inputs.investedAssets} unit="万円" multiplier={10000} onChange={(value) => onChange('investedAssets', value)} />
            <NumberField label="月収" value={inputs.monthlyIncome} unit="万円" multiplier={10000} onChange={(value) => onChange('monthlyIncome', value)} />
            <NumberField label="月支出" value={inputs.monthlyExpenses} unit="万円" multiplier={10000} onChange={(value) => onChange('monthlyExpenses', value)} />
          </div>
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-600">
            <p>貯金は普通預金など、すぐ使えるお金の目安です。生活防衛資金はこの金額だけで見ます。</p>
            <p className="mt-1">投資資産は株式、投資信託、NISAなどの合計です。まだなければ0円のままで大丈夫です。</p>
          </div>
          <button
            type="button"
            onClick={() => onStepChange('life')}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-slate-950 px-4 text-sm font-black text-white transition hover:bg-slate-800"
          >
            生活状態へ進む
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      )}

      {step === 'life' && (
        <div className="space-y-5">
          <StepHeader
            title="Step 2: 生活状態診断"
            body="赤字、固定費、働くことの負担のどこが重いかを見ます。"
          />

          <div>
            <label className="mb-2 block text-sm font-bold text-slate-800">今いちばん近い目的</label>
            <ChoiceGrid<WorkReductionGoal>
              value={inputs.workReductionGoal}
              options={workGoalOptions}
              onChange={(value) => onChange('workReductionGoal', value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <SelectField<ExperienceLevel>
              label="貯金経験"
              value={inputs.savingsExperience}
              options={experienceOptions}
              onChange={(value) => onChange('savingsExperience', value)}
            />
            <SelectField<ExperienceLevel>
              label="投資経験"
              value={inputs.investmentExperience}
              options={experienceOptions}
              onChange={(value) => onChange('investmentExperience', value)}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-slate-800">お金の不安</label>
            <ChoiceGrid<MoneyStressLevel>
              value={inputs.moneyStress}
              options={moneyStressOptions}
              onChange={(value) => onChange('moneyStress', value)}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-slate-800">働くことの重さ</label>
            <ChoiceGrid<WorkPainLevel>
              value={inputs.workPain}
              options={workPainOptions}
              onChange={(value) => onChange('workPain', value)}
            />
          </div>

          <div className="rounded-lg border border-emerald-100 bg-emerald-50 p-4 text-sm leading-6 text-slate-700">
            投資の細かい前提は、初回診断では自動で入れています。まずは毎月のお金の流れと、今やることに集中します。
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => onStepChange('profile')}
              className="h-12 rounded-lg border border-slate-200 bg-white text-sm font-black text-slate-700 transition hover:bg-slate-50"
            >
              戻る
            </button>
            <button
              type="button"
              onClick={() => onStepChange('result')}
              className="flex h-12 items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 text-sm font-black text-white transition hover:bg-emerald-700"
            >
              診断する
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
                <h3 className="font-black text-slate-950">診断完了</h3>
                <p className="mt-1 text-sm leading-6 text-slate-600">
                  結果を見ながら、今やるミッションを1つ確認します。
                </p>
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onStepChange('profile')}
            className="h-11 w-full rounded-lg border border-slate-200 bg-white text-sm font-black text-slate-700 transition hover:bg-slate-50"
          >
            入力を調整する
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
