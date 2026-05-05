import type { ExperienceLevel, MoneyStressLevel, WorkPainLevel, WorkReductionGoal } from '../../utils/compass';

export const workGoalOptions: { value: WorkReductionGoal; label: string; detail: string }[] = [
  { value: 'stabilize', label: 'まず生活を安定させたい', detail: '赤字や不安定さを減らす' },
  { value: 'save', label: '貯金できる体質にしたい', detail: '月の余力を作る' },
  { value: 'reduce_work', label: '働く量を減らしたい', detail: '自由時間を増やす' },
  { value: 'semi_retire', label: 'セミリタイアしたい', detail: '少し働いて暮らす' },
  { value: 'fire', label: 'FIREを目指したい', detail: '資産で生活を支える' },
];

export const experienceOptions: { value: ExperienceLevel; label: string }[] = [
  { value: 'none', label: 'まだない' },
  { value: 'starting', label: '始めたい' },
  { value: 'some', label: '少しある' },
];

export const moneyStressOptions: { value: MoneyStressLevel; label: string; detail: string }[] = [
  { value: 'low', label: '低め', detail: '今はそこまで焦っていない' },
  { value: 'medium', label: 'ふつう', detail: '少し不安なので整えたい' },
  { value: 'high', label: '高い', detail: 'かなりしんどい。早く立て直したい' },
];

export const workPainOptions: { value: WorkPainLevel; label: string; detail: string }[] = [
  { value: 'low', label: 'まだ平気', detail: '働く量は今のままでもよい' },
  { value: 'medium', label: '少し重い', detail: 'できれば減らしたい' },
  { value: 'high', label: 'かなり嫌', detail: '早く軽くしたい' },
];

const formatDisplay = (value: number, multiplier: number) => {
  if (!Number.isFinite(value)) return '';
  if (multiplier === 1) return Math.round(value).toString();
  const converted = value / multiplier;
  // Avoid floating-point noise: round to 1 decimal
  const rounded = Math.round(converted * 10) / 10;
  return rounded % 1 === 0 ? rounded.toFixed(0) : rounded.toString();
};

const parseInput = (raw: string, multiplier: number) => {
  const normalized = raw.replace(/[^\d.-]/g, '');
  if (normalized === '' || normalized === '-') return 0;
  const parsed = Number(normalized);
  if (!Number.isFinite(parsed)) return 0;
  return Math.round(parsed * multiplier);
};

export function NumberField({
  label,
  value,
  unit,
  multiplier = 1,
  onChange,
}: {
  label: string;
  value: number;
  unit: string;
  multiplier?: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-bold text-slate-800">{label}</span>
      <div className="flex h-11 items-center rounded-lg border border-slate-200 bg-white px-3 focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-100">
        <input
          value={formatDisplay(value, multiplier)}
          onChange={(event) => onChange(parseInput(event.target.value, multiplier))}
          inputMode="decimal"
          className="min-w-0 flex-1 bg-transparent text-sm font-bold text-slate-950 outline-none"
        />
        <span className="ml-2 text-xs font-bold text-slate-500">{unit}</span>
      </div>
    </label>
  );
}

export function SelectField<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (value: T) => void;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-bold text-slate-800">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value as T)}
        className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm font-bold text-slate-950 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export function ChoiceGrid<T extends string>({
  value,
  options,
  onChange,
}: {
  value: T;
  options: { value: T; label: string; detail: string }[];
  onChange: (value: T) => void;
}) {
  return (
    <div className="grid gap-2">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={`rounded-lg border p-3 text-left transition ${
            value === option.value
              ? 'border-emerald-500 bg-emerald-50'
              : 'border-slate-200 bg-white hover:border-slate-300'
          }`}
        >
          <span className="block text-sm font-black text-slate-950">{option.label}</span>
          <span className="text-xs font-medium text-slate-500">{option.detail}</span>
        </button>
      ))}
    </div>
  );
}

