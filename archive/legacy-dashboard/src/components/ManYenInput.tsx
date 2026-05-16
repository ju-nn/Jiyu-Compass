import React, { useState, useEffect } from 'react';
import { List } from 'lucide-react';

interface ManYenInputProps {
    label: string;
    subLabel?: string;
    value: number;
    onChange: (newValue: number) => void;
    placeholder?: string;
    name?: string;
    className?: string;
    autoFocus?: boolean;
    unit?: string;
    step?: number;
    min?: number;
    max?: number;
}

export const ManYenInput: React.FC<ManYenInputProps> = ({
    label,
    subLabel,
    value,
    onChange,
    placeholder,
    className,
    autoFocus,
    unit = "万円",
    step = 0.1,
    min,
    max
}) => {
    const isCurrency = unit === "万円";

    // Internal state handling to allow smooth typing
    const [displayValue, setDisplayValue] = useState<string>('');
    const [showDropdown, setShowDropdown] = useState(false);

    useEffect(() => {
        const normalizedVal = isCurrency ? value / 10000 : value;
        setDisplayValue(normalizedVal === 0 && !placeholder ? '' : String(normalizedVal));
    }, [value, isCurrency, placeholder]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputStr = e.target.value;
        setDisplayValue(inputStr);

        const num = parseFloat(inputStr);
        if (!isNaN(num)) {
            onChange(isCurrency ? num * 10000 : num);
        } else {
            onChange(0);
        }
    };

    // Generate dropdown options (10万円単位)
    const generateOptions = () => {
        if (!isCurrency) return [];

        const options = [];
        // 0から3000万円まで、10万円刻み
        for (let i = 0; i <= 300; i++) {
            const manYen = i * 10; // 10万円 = 1万円 x 10
            options.push(manYen);
        }
        return options;
    };

    const handleDropdownSelect = (manYenValue: number) => {
        onChange(manYenValue * 10000);
        setShowDropdown(false);
    };

    return (
        <div className={className}>
            <label className="block text-sm md:text-xs font-medium text-slate-700 mb-1 md:mb-0.5">
                {label}
                {subLabel && <span className="text-xs text-slate-400 font-normal ml-2">{subLabel}</span>}
            </label>
            <div className="relative">
                <input
                    type="number"
                    step={step}
                    min={min}
                    max={max}
                    value={displayValue}
                    onChange={handleChange}
                    onFocus={(e) => e.target.select()}
                    placeholder={placeholder || "0"}
                    className="w-full px-4 py-2 md:py-1.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all pr-20 font-bold text-slate-700 text-base md:text-sm"
                    autoFocus={autoFocus}
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                    <span className="text-slate-400 text-sm font-bold pointer-events-none">{unit}</span>
                    {isCurrency && (
                        <button
                            type="button"
                            onClick={() => setShowDropdown(!showDropdown)}
                            className="p-1 hover:bg-slate-100 rounded transition-colors"
                            title="クイック選択"
                        >
                            <List className="w-4 h-4 text-slate-400" />
                        </button>
                    )}
                </div>

                {/* Dropdown Menu */}
                {showDropdown && isCurrency && (
                    <>
                        <div
                            className="fixed inset-0 z-10"
                            onClick={() => setShowDropdown(false)}
                        />
                        <div className="absolute right-0 mt-1 w-48 max-h-60 overflow-y-auto bg-white rounded-lg shadow-lg border border-slate-200 z-20">
                            <div className="p-2 space-y-1">
                                {generateOptions().map((manYen) => (
                                    <button
                                        key={manYen}
                                        type="button"
                                        onClick={() => handleDropdownSelect(manYen)}
                                        className={`w-full text-left px-3 py-2 rounded text-sm font-medium transition-colors ${value === manYen * 10000
                                            ? 'bg-blue-50 text-blue-700'
                                            : 'hover:bg-slate-50 text-slate-700'
                                            }`}
                                    >
                                        {manYen}万円
                                    </button>
                                ))}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};
