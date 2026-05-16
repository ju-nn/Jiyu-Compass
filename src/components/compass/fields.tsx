import { useId, useMemo, useRef, useState } from 'react';

const formatDisplay = (value: number, multiplier: number) => {
  if (!Number.isFinite(value)) return '';
  if (multiplier === 1) return Math.round(value).toString();
  const converted = value / multiplier;
  // Avoid floating-point noise: round to 1 decimal
  const rounded = Math.round(converted * 10) / 10;
  return rounded % 1 === 0 ? rounded.toFixed(0) : rounded.toString();
};

const getRangeConfig = (label: string, multiplier: number) => {
  if (multiplier === 1) {
    return { min: 16, max: 80, step: 1, quickStep: 1 };
  }

  if (label.includes('貯金') || label.includes('投資資産')) {
    return { min: 0, max: 5000 * multiplier, step: 10 * multiplier, quickStep: 10 * multiplier };
  }

  if (label.includes('ローン') || label.includes('年金') || label.includes('社会保険') || label.includes('返済')) {
    return { min: 0, max: 50 * multiplier, step: multiplier, quickStep: multiplier };
  }

  if (label.includes('生活費')) {
    return { min: 0, max: 80 * multiplier, step: multiplier, quickStep: multiplier };
  }

  return { min: 0, max: 120 * multiplier, step: multiplier, quickStep: multiplier };
};

const clampToRange = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

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
  const [isOpen, setIsOpen] = useState(false);
  const [customValue, setCustomValue] = useState(formatDisplay(value, multiplier));
  const fieldId = useId();
  const closeTimer = useRef<number | null>(null);
  const rangeConfig = useMemo(() => getRangeConfig(label, multiplier), [label, multiplier]);
  const sliderValue = clampToRange(value, rangeConfig.min, rangeConfig.max);

  const handleChange = (nextValue: number) => {
    onChange(nextValue);
    setCustomValue(formatDisplay(nextValue, multiplier));
  };

  const handleCustomChange = (raw: string) => {
    setCustomValue(raw);
    onChange(parseInput(raw, multiplier));
    setIsOpen(true);
  };

  const handleStep = (direction: -1 | 1) => {
    handleChange(clampToRange(value + (rangeConfig.quickStep * direction), rangeConfig.min, rangeConfig.max));
  };

  const handleFieldClick = () => {
    setIsOpen(true);
  };

  const handleBlur = () => {
    closeTimer.current = window.setTimeout(() => setIsOpen(false), 120);
  };

  const handleFocus = () => {
    if (closeTimer.current) {
      window.clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };

  return (
    <div className="relative block" onBlur={handleBlur} onFocus={handleFocus}>
      <label htmlFor={fieldId} className="mb-2 block text-sm font-bold text-slate-800">{label}</label>
      <div
        id={fieldId}
        role="group"
        aria-expanded={isOpen}
        className="flex h-11 w-full items-center rounded-lg border border-slate-200 bg-white px-1.5 transition focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-100"
      >
        <button
          type="button"
          onClick={() => handleStep(-1)}
          className="h-8 w-8 shrink-0 rounded-md text-lg font-black text-slate-700 transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-100"
          aria-label={`${label}を減らす`}
        >
          -
        </button>
        <div className="flex min-w-0 flex-1 items-center justify-center px-1">
          <input
            value={customValue}
            onChange={(event) => handleCustomChange(event.target.value)}
            onClick={handleFieldClick}
            onFocus={handleFieldClick}
            inputMode="decimal"
            className="w-full min-w-0 bg-transparent text-center text-sm font-black text-slate-950 outline-none"
            aria-label={`${label}を直接入力`}
          />
          <span className="ml-1 shrink-0 text-xs font-bold text-slate-500">{unit}</span>
        </div>
        <button
          type="button"
          onClick={() => handleStep(1)}
          className="h-8 w-8 shrink-0 rounded-md text-lg font-black text-slate-700 transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-100"
          aria-label={`${label}を増やす`}
        >
          +
        </button>
      </div>

      {isOpen && (
        <div className="absolute left-0 top-full z-30 mt-2 w-full min-w-0 rounded-lg border border-slate-200 bg-white p-3 shadow-xl sm:w-80">
          <input
            type="range"
            min={rangeConfig.min}
            max={rangeConfig.max}
            step={rangeConfig.step}
            value={sliderValue}
            onChange={(event) => handleChange(Number(event.target.value))}
            className="h-2 w-full cursor-pointer accent-emerald-600"
            aria-label={`${label}をスライダーで調整`}
          />
        </div>
      )}
    </div>
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
        <option value="">未入力</option>
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
