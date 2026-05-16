import { describe, it, expect } from 'vitest';
import { calculateNetIncome, calculateGrossIncomeFromNet } from './tax';

describe('calculateNetIncome', () => {
    describe('正常系テスト', () => {
        it('年収300万円の場合、手取りは約240万円前後になる', () => {
            const result = calculateNetIncome(3000000);
            expect(result).toBeGreaterThan(2300000);
            expect(result).toBeLessThan(2500000);
        });

        it('年収500万円の場合、手取りは約390万円前後になる', () => {
            const result = calculateNetIncome(5000000);
            expect(result).toBeGreaterThan(3800000);
            expect(result).toBeLessThan(4000000);
        });

        it('年収1000万円の場合、手取りは約720万円前後になる', () => {
            const result = calculateNetIncome(10000000);
            expect(result).toBeGreaterThan(7000000);
            expect(result).toBeLessThan(7500000);
        });
    });

    describe('境界値テスト', () => {
        it('年収0円の場合、手取り0円', () => {
            expect(calculateNetIncome(0)).toBe(0);
        });

        it('年収が負の値の場合、手取り0円', () => {
            expect(calculateNetIncome(-1000000)).toBe(0);
        });
    });
});

describe('calculateGrossIncomeFromNet', () => {
    describe('正常系テスト', () => {
        it('手取りから逆算した額面年収で再度手取り計算すると、元の値に近い値になる（往復整合性）', () => {
            const targetNet = 4000000;
            const gross = calculateGrossIncomeFromNet(targetNet);
            const recalculatedNet = calculateNetIncome(gross);

            // 許容誤差 5万円以内
            expect(Math.abs(recalculatedNet - targetNet)).toBeLessThan(50000);
        });

        it('手取り240万円の場合、額面300万円程度になる', () => {
            const gross = calculateGrossIncomeFromNet(2400000);
            expect(gross).toBeGreaterThan(2900000);
            expect(gross).toBeLessThan(3100000);
        });
    });
});
