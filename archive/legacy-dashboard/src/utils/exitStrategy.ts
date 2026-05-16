
/**
 * Utilities for calculating Exit Strategies (Retirement vs Investment Drawdown)
 */

export interface ExitStrategyInputs {
    totalAssets: number;     // Total accumulated assets (Yen)
    principal: number;       // Invested principal (Yen) - for capital gains tax calc
    yearsOfService: number;  // For retirement income deduction (Years)
    annualReturn: number;    // Expected annual return during drawdown (%)
    withdrawalRate: number;  // Annual withdrawal rate (%)
    currentAge: number;
}

export interface DrawdownYear {
    age: number;
    assets: number;        // Remaining assets
    withdrawalGross: number; // Amount sold
    tax: number;           // Tax paid
    withdrawalNet: number; // Cash in hand
}

export interface LumpSumResult {
    gross: number;
    deduction: number;
    taxableIncome: number;
    tax: number;
    net: number;
}

/**
 * Calculates the Retirement Income Deduction and Tax (Lump Sum)
 */
export const calculateRetirementLumpSum = (assets: number, years: number): LumpSumResult => {
    // 1. Calculate Deduction
    let deduction = 0;
    if (years <= 20) {
        deduction = 400000 * years;
    } else {
        deduction = 8000000 + 700000 * (years - 20);
    }

    // 2. Calculate Taxable Income
    // (Gross - Deduction) * 1/2
    const taxableIncome = Math.max(0, (assets - deduction) / 2);

    // 3. Calculate Income Tax (Simplified Progressive Tax - 2024 rates approx)
    // Note: This is an approximation of National Income Tax. 
    // Reconstruction Special Income Tax (2.1%) and Resident Tax (10%) should be added.
    // For simplicity, we'll use a standard progressive table for National + 10% Resident.

    let tax = 0;

    // Retirement income is taxed separately (Seprate Taxation).
    // National Income Tax Rate Table (Approx)
    // 1.95m: 5%, 3.3m: 10%, 6.95m: 20%, 9m: 23%, 18m: 33%, 40m: 40%, >40m: 45%
    // Plus 10% Resident Tax (Municipal 6% + Prefectural 4%)
    // Base Income Tax
    let incomeTax = 0;
    const ti = taxableIncome;

    if (ti <= 1950000) incomeTax = ti * 0.05;
    else if (ti <= 3300000) incomeTax = ti * 0.10 - 97500;
    else if (ti <= 6950000) incomeTax = ti * 0.20 - 427500;
    else if (ti <= 9000000) incomeTax = ti * 0.23 - 636000;
    else if (ti <= 18000000) incomeTax = ti * 0.33 - 1536000;
    else if (ti <= 40000000) incomeTax = ti * 0.40 - 2796000;
    else incomeTax = ti * 0.45 - 4796000;

    // Special Reconstruction Tax
    const specialTax = incomeTax * 0.021;

    // Resident Tax (10% flat on taxable retirement income)
    const residentTax = taxableIncome * 0.10;

    tax = incomeTax + specialTax + residentTax;

    return {
        gross: assets,
        deduction,
        taxableIncome,
        tax,
        net: assets - tax
    };
};

/**
 * Simulates Periodic Drawdown (S&P 500 style)
 * Assumes:
 * - Assets continue to grow at `annualReturn`
 * - Withdraw `withdrawalRate` annually (4% rule style)
 * - Or withdraw fixed amount? Let's implement fixed PERCENTAGE for now (classic 4% rule).
 * - Tax: 20.315% on GAINS only.
 * - Need to track cost basis to determine gain portion.
 */
export const simulateDrawdown = (inputs: ExitStrategyInputs, durationYears: number = 30): DrawdownYear[] => {
    const results: DrawdownYear[] = [];
    let currentAssets = inputs.totalAssets;
    let currentPrincipal = inputs.principal;
    let currentAge = inputs.currentAge;

    for (let i = 0; i < durationYears; i++) {
        // 1. Determine Withdrawal Amount
        // Standard 4% rule applies to INITIAL portfolio usually, but let's assume % of REMAINING or % of INITIAL?
        // Usually "4% Rule" = 4% of Initial adjusted for inflation.
        // "Periodic Selling" often implies selling a fixed % or value. 
        // Let's go with: Fixed % of Current Assets (Simpler to model longevity) OR Fixed Amount (Inflation adjusted).
        // Let's use Fixed Amount based on Initial Value * Rate (Classic 4% Rule).

        const withdrawalAmount = inputs.totalAssets * (inputs.withdrawalRate / 100);

        // Check if assets depleted
        if (currentAssets <= 0) {
            results.push({ age: currentAge, assets: 0, withdrawalGross: 0, tax: 0, withdrawalNet: 0 });
            currentAge++;
            continue;
        }

        const actualWithdrawal = Math.min(withdrawalAmount, currentAssets);

        // 2. Calculate Tax
        // Gain Ratio using Average Cost Method
        // Gain Ratio = (CurrentAssets - CurrentPrincipal) / CurrentAssets
        // Wait, cost basis doesn't change on growth, only on buy. 
        // On sell, we sell proportional principal.

        let gainRatio = 0;
        if (currentAssets > 0) {
            gainRatio = Math.max(0, (currentAssets - currentPrincipal) / currentAssets);
        }

        const gainPortion = actualWithdrawal * gainRatio;
        const tax = gainPortion * 0.20315;
        const net = actualWithdrawal - tax;

        results.push({
            age: currentAge,
            assets: Math.round(currentAssets),
            withdrawalGross: Math.round(actualWithdrawal),
            tax: Math.round(tax),
            withdrawalNet: Math.round(net)
        });

        // 3. Update State for Next Year
        // Reduce Principal by the portion sold
        const principalSold = actualWithdrawal * (1 - gainRatio);
        currentPrincipal = Math.max(0, currentPrincipal - principalSold);

        // Reduce Assets
        currentAssets -= actualWithdrawal;

        // Grow Remaining Assets
        if (currentAssets > 0) {
            currentAssets = currentAssets * (1 + inputs.annualReturn / 100);
        }

        currentAge++;
    }

    return results;
};
