import { NISA_LIMITS, TAX_RATES, SIMULATION_DEFAULTS, MONTE_CARLO } from '../constants';
import { isValidNumber, safeDivide } from './math';

export interface LifeEvent {
    id: string;
    name: string;
    amount: number; // Positive for expense, could be conceptually negative for income but simpler to treat as cost. For income, use negative? Or explicit type.
    isIncome?: boolean; // If true, amount is added to income. If false/undefined, subtracted as expense.
    age: number;
    isRecurring?: boolean;
    duration?: number; // Years to recur
}

export interface FireInputs {
    currentAge: number;
    retirementAge: number;
    currentAssets: number;
    annualIncome: number;
    annualExpenses: number;
    investmentReturnRate: number; // Percentage (e.g. 5 for 5%)
    inflationRate: number; // Percentage
    withdrawalRate: number; // Percentage (e.g. 4 for 4%)
    pensionStartAge: number;
    monthlyPension: number;
    monthlyPensionContribution?: number;
    postRetirementIncome: number; // Monthly income after retirement (Side FIRE)
    postRetirementJob?: string; // Metadata: Name of the job
    monthlyStudentLoanPayment?: number;
    studentLoanEndAge?: number;
    monthlyHousingLoanPayment?: number;
    housingLoanEndAge?: number;
    monthlyCarLoanPayment?: number;
    carLoanEndAge?: number;
    adjustIncomeForInflation?: boolean; // Whether annual income grows with inflation
    lifeEvents?: LifeEvent[]; // List of future life events
}

export interface SimulationData {
    age: number;
    assets: number;
    isRetired: boolean;
    expenses: number;
    income: number;
    investmentReturns: number;
    withdrawal: number;
    events?: { name: string; amount: number; isIncome: boolean }[]; // Events happening this year
}

const LONG_TERM_CARE_START_AGE = 40;
const LONG_TERM_CARE_PREMIUM_RATE = 0.018;

const calculateLongTermCarePremium = (age: number, incomeBase: number, inflationMultiplier: number): number => {
    if (age < LONG_TERM_CARE_START_AGE || incomeBase <= 0) return 0;

    const annualMinimumPremium = 72000 * inflationMultiplier;
    return Math.max(annualMinimumPremium, incomeBase * LONG_TERM_CARE_PREMIUM_RATE);
};

const calculateRecurringObligations = (
    inputs: FireInputs,
    age: number,
    inflationMultiplier: number
): { total: number; events: { name: string; amount: number; isIncome: boolean }[] } => {
    const obligations = [
        {
            name: '年金保険料',
            monthlyPayment: inputs.monthlyPensionContribution || 0,
            endAge: inputs.retirementAge
        },
        {
            name: '奨学金返済',
            monthlyPayment: inputs.monthlyStudentLoanPayment || 0,
            endAge: inputs.studentLoanEndAge
        },
        {
            name: '住宅ローン返済',
            monthlyPayment: inputs.monthlyHousingLoanPayment || 0,
            endAge: inputs.housingLoanEndAge
        },
        {
            name: '車ローン返済',
            monthlyPayment: inputs.monthlyCarLoanPayment || 0,
            endAge: inputs.carLoanEndAge
        }
    ];

    return obligations.reduce((acc, obligation) => {
        const isActive = obligation.monthlyPayment > 0
            && (obligation.endAge === undefined || age <= obligation.endAge);

        if (!isActive) return acc;

        const amount = obligation.monthlyPayment * 12 * inflationMultiplier;
        acc.total += amount;
        acc.events.push({ name: obligation.name, amount, isIncome: false });
        return acc;
    }, { total: 0, events: [] as { name: string; amount: number; isIncome: boolean }[] });
};

/**
 * Calculates the FIRE number (Target Assets) based on the 4% rule (or custom withdrawal rate).
 */
export const calculateFireNumber = (annualExpenses: number, withdrawalRate: number = SIMULATION_DEFAULTS.DEFAULT_WITHDRAWAL_RATE): number => {
    // 入力検証
    if (!isValidNumber(annualExpenses) || annualExpenses < 0) {
        return 0;
    }
    if (!isValidNumber(withdrawalRate) || withdrawalRate <= 0) {
        return 0;
    }

    return Math.round(safeDivide(annualExpenses, withdrawalRate / 100));
};

/**
 * Simulates asset growth over time until age 100.
 */
export const simulateAssetGrowth = (inputs: FireInputs, useNisa: boolean = false): SimulationData[] => {
    const data: SimulationData[] = [];

    // NISA Specs
    const NISA_MAX_ANNUAL = NISA_LIMITS.MAX_ANNUAL;
    const NISA_MAX_LIFETIME = NISA_LIMITS.MAX_LIFETIME;
    const TAX_RATE = TAX_RATES.CAPITAL_GAINS;

    let totalAssets = inputs.currentAssets;
    let debtBalance = 0;

    // We track NISA and Taxable separately
    let nisaBalance = 0;
    let taxableBalance = inputs.currentAssets;
    let lifetimeNisaContribution = 0;

    for (let age = inputs.currentAge; age <= 100; age++) {
        const isRetired = age >= inputs.retirementAge;
        const isPensionStarted = age >= inputs.pensionStartAge;
        const yearsFromStart = age - inputs.currentAge;

        // Calculate inflation multiplier
        const inflationMultiplier = Math.pow(1 + inputs.inflationRate / 100, yearsFromStart);

        // Core Expenses grow with inflation
        let annualExpenses = inputs.annualExpenses * inflationMultiplier;

        // Income logic
        let annualIncome = 0;
        let annualPension = 0;
        let sideIncome = 0;

        if (!isRetired) {
            if (inputs.adjustIncomeForInflation !== false) {
                annualIncome = inputs.annualIncome * inflationMultiplier;
            } else {
                annualIncome = inputs.annualIncome; // No inflation adjustment
            }
        } else {
            // Side income (post-retirement)
            sideIncome = (inputs.postRetirementIncome || 0) * 12 * inflationMultiplier;
        }

        if (isPensionStarted) {
            annualPension = (inputs.monthlyPension * 12) * inflationMultiplier;
        }

        const longTermCarePremium = calculateLongTermCarePremium(
            age,
            annualIncome + sideIncome + annualPension,
            inflationMultiplier
        );
        if (longTermCarePremium > 0) {
            annualExpenses += longTermCarePremium;
        }

        // Process Life Events
        const currentEvents: { name: string; amount: number; isIncome: boolean }[] = [];
        if (longTermCarePremium > 0) {
            currentEvents.push({
                name: '介護保険料（概算）',
                amount: longTermCarePremium,
                isIncome: false
            });
        }

        const recurringObligations = calculateRecurringObligations(inputs, age, inflationMultiplier);
        if (recurringObligations.total > 0) {
            annualExpenses += recurringObligations.total;
            currentEvents.push(...recurringObligations.events);
        }

        if (inputs.lifeEvents) {
            inputs.lifeEvents.forEach(event => {
                let isActive = false;
                if (event.isRecurring) {
                    const startAge = event.age;
                    const endAge = startAge + (event.duration || 1) - 1;
                    if (age >= startAge && age <= endAge) isActive = true;
                } else {
                    if (age === event.age) isActive = true;
                }

                if (isActive) {
                    const eventAmount = event.amount * inflationMultiplier;
                    if (event.isIncome) {
                        currentEvents.push({ name: event.name, amount: eventAmount, isIncome: true });
                        annualIncome += eventAmount; // Add to income stream (technically lumping with annualIncome)
                    } else {
                        currentEvents.push({ name: event.name, amount: eventAmount, isIncome: false });
                        annualExpenses += eventAmount; // Add to expenses
                    }
                }
            });
        }

        const totalIncome = annualIncome + sideIncome + annualPension;
        const grossSavings = totalIncome - annualExpenses;

        // RECORD CURRENT STATE FIRST (before growth)
        totalAssets = nisaBalance + taxableBalance - debtBalance;

        data.push({
            age,
            assets: Math.round(totalAssets),
            isRetired,
            expenses: Math.round(annualExpenses),
            income: Math.round(totalIncome),
            investmentReturns: 0,
            withdrawal: Math.round(Math.max(0, -grossSavings)),
            events: currentEvents.length > 0 ? currentEvents : undefined
        });

        // NOW Apply Growth for next period
        const returnRate = inputs.investmentReturnRate / 100;

        let growthNisa = nisaBalance * returnRate;
        let growthTaxable = taxableBalance * returnRate;

        // Tax Impact - only apply if there is actual growth
        if (growthTaxable > 0) {
            if (useNisa) {
                growthTaxable = growthTaxable * (1 - TAX_RATE);
            } else {
                growthTaxable = growthTaxable * (1 - TAX_RATE);
            }
        }


        // Apply Growth
        nisaBalance += growthNisa;
        taxableBalance += growthTaxable;

        // Apply Cash Flow (Savings or Withdrawal)
        if (grossSavings > 0) {
            // Positive Savings: Pay down deficit first, then fill NISA
            let remainingSavings = grossSavings;

            if (debtBalance > 0) {
                const debtPayment = Math.min(remainingSavings, debtBalance);
                debtBalance -= debtPayment;
                remainingSavings -= debtPayment;
            }

            if (useNisa && lifetimeNisaContribution < NISA_MAX_LIFETIME) {
                const spaceRemaining = NISA_MAX_LIFETIME - lifetimeNisaContribution;
                const annualCap = NISA_MAX_ANNUAL;
                const contributeNisa = Math.min(remainingSavings, annualCap, spaceRemaining);

                nisaBalance += contributeNisa;
                lifetimeNisaContribution += contributeNisa;
                remainingSavings -= contributeNisa;
            }

            // Rest goes to Taxable
            taxableBalance += remainingSavings;

        } else {
            // Withdrawal needed
            let needed = -grossSavings;

            if (taxableBalance >= needed) {
                taxableBalance -= needed;
                needed = 0;
            } else {
                needed -= taxableBalance;
                taxableBalance = 0;

                if (nisaBalance >= needed) {
                    nisaBalance -= needed;
                    needed = 0;
                } else {
                    needed -= nisaBalance;
                    nisaBalance = 0;
                }
            }

            if (needed > 0) {
                debtBalance += needed;
            }
        }

        totalAssets = nisaBalance + taxableBalance - debtBalance;
    }

    return data;

};

export const formatCurrency = (value: number): string => {
    const manYen = value / 10000;
    let roundedManYen = manYen;
    if (Math.abs(manYen) >= 100) {
        roundedManYen = Math.round(manYen / 10) * 10;
    } else if (Math.abs(manYen) >= 10) {
        roundedManYen = Math.round(manYen);
    } else {
        roundedManYen = Math.round(manYen * 10) / 10;
    }
    return `${roundedManYen.toLocaleString('ja-JP')}万円`;
};


/**
 * Calculate years required to reach FIRE goal
 * Uses compound interest formula: FutureValue = CurrentAssets * (1+r)^t + AnnualSaving * ((1+r)^t - 1) / r
 * Solves for t (years) iteratively or logarithmically.
 * Iterative approach is safer for edge cases (e.g. 0% return).
 */
export const calculateYearsToFire = (
    currentAssets: number,
    annualSaving: number,
    returnRatePercent: number,
    fireGoal: number
): number | null => {
    if (currentAssets >= fireGoal) return 0;
    if (annualSaving <= 0 && returnRatePercent <= 0) return null; // Never reach
    if (annualSaving < 0) return null; // Consuming assets (simplified)

    const r = returnRatePercent / 100;
    let assets = currentAssets;
    let year = 0;
    const MAX_YEARS = 100; // Cap to avoid infinite loops

    while (assets < fireGoal && year < MAX_YEARS) {
        assets = assets * (1 + r) + annualSaving;
        year++;
    }

    if (year >= MAX_YEARS) return null;
    return year;
};

// --- Phase 12: Advanced Simulation Logic ---

export interface MonteCarloResult {
    age: number;
    percentile10: number; // Pessimistic
    percentile50: number; // Median
    percentile90: number; // Optimistic
}

/**
 * Calculates Monte Carlo simulation for asset growth.
 * Uses Geometric Brownian Motion model for asset prices.
 * @param inputs User inputs
 * @param volatility Standard deviation of returns (e.g. 0.15 for 15%)
 * @param iterations Number of simulation runs
 */
export const calculateMonteCarlo = (inputs: FireInputs, volatility: number = MONTE_CARLO.DEFAULT_VOLATILITY, iterations: number = MONTE_CARLO.DEFAULT_ITERATIONS): MonteCarloResult[] => {
    const results: MonteCarloResult[] = [];
    const ages = [];
    for (let age = inputs.currentAge; age <= SIMULATION_DEFAULTS.MAX_AGE; age++) {
        ages.push(age);
    }

    // pre-calculate constant cash flows to simplify (approximate)
    // In a real detailed MC, we'd simulate inflation and income variations per path, but for UI speed we'll assume fixed inflation path for cash flows
    // and random path for investment returns.

    // Simulations: Array of arrays. simulations[runIndex][yearIndex] = assets
    const allRunsAssets: number[][] = Array(iterations).fill(0).map(() => [inputs.currentAssets]);

    // Pre-calculate deterministic cashflows (Savings/Withdrawals) per year
    const cashFlows: number[] = [];
    for (let i = 0; i < ages.length; i++) {
        const age = ages[i];
        const isRetired = age >= inputs.retirementAge;
        const yearsFromStart = age - inputs.currentAge;
        const inflationMultiplier = Math.pow(1 + inputs.inflationRate / 100, yearsFromStart);
        const adjustedExpenses = inputs.annualExpenses * inflationMultiplier;

        let income = 0;
        if (!isRetired) {
            if (inputs.adjustIncomeForInflation !== false) {
                income = inputs.annualIncome * inflationMultiplier;
            } else {
                income = inputs.annualIncome;
            }
        } else {
            const sideIncome = (inputs.postRetirementIncome || 0) * 12 * inflationMultiplier;
            const pension = (age >= inputs.pensionStartAge) ? (inputs.monthlyPension * 12 * inflationMultiplier) : 0;
            income = sideIncome + pension;
        }

        const longTermCarePremium = calculateLongTermCarePremium(age, income, inflationMultiplier);
        const recurringObligations = calculateRecurringObligations(inputs, age, inflationMultiplier);
        cashFlows.push(income - adjustedExpenses - longTermCarePremium - recurringObligations.total);
    }

    const mu = inputs.investmentReturnRate / 100; // Expected return
    const sigma = volatility;
    const dt = 1; // 1 year steps

    for (let i = 0; i < iterations; i++) {
        let currentAssets = inputs.currentAssets;

        for (let t = 0; t < ages.length - 1; t++) {
            // Random Walk: Stilde = S * exp((mu - 0.5*sigma^2)*dt + sigma*sqrt(dt)*Z)
            // Z is standard normal variable
            const Z = boxMullerTransform();
            const drift = (mu - 0.5 * sigma * sigma) * dt;
            const diffusion = sigma * Math.sqrt(dt) * Z;
            const growthRatio = Math.exp(drift + diffusion);

            // Apply growth
            currentAssets = currentAssets * growthRatio;

            // Apply Cashflow (Savings or Withdrawal)
            currentAssets += cashFlows[t];

            if (currentAssets < 0) currentAssets = 0;

            allRunsAssets[i].push(currentAssets);
        }
    }

    // Aggregate results
    for (let t = 0; t < ages.length; t++) {
        const assetsAtYear = allRunsAssets.map(run => run[t]).sort((a, b) => a - b);
        results.push({
            age: ages[t],
            percentile10: assetsAtYear[Math.floor(iterations * 0.1)],
            percentile50: assetsAtYear[Math.floor(iterations * 0.5)],
            percentile90: assetsAtYear[Math.floor(iterations * 0.9)],
        });
    }

    return results;
};

// Box-Muller transform for standard normal distribution
const boxMullerTransform = (): number => {
    let u = 0, v = 0;
    while (u === 0) u = Math.random();
    while (v === 0) v = Math.random();
    return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
};

/**
 * Calculates how many years are saved if the user earns an extra monthly income for life?
 * Or realistically, extra monthly income after retirement? 
 * The request "好きな仕事で月5万" implies Post-Retirement Side Income (Side FIRE).
 */
export const calculateSideFireShortcut = (inputs: FireInputs, extraMonthlyIncome: number = 50000): number => {
    // 1. Calculate standard years to FIRE
    const standardYears = calculateYearsToFire(
        inputs.currentAssets,
        inputs.annualIncome - inputs.annualExpenses,
        inputs.investmentReturnRate,
        calculateFireNumber(inputs.annualExpenses, inputs.withdrawalRate)
    );

    if (standardYears === null) return 0; // Can't reach even normally

    // 2. Calculate "Side FIRE" years
    // Side income effectively reduces the required FIRE number because the portfolio needs to generate less.
    // New Required Expense from Portfolio = AnnualExpenses - (ExtraIncome * 12)
    const annualSideIncome = extraMonthlyIncome * 12;
    const reducedExpensesObj = inputs.annualExpenses - annualSideIncome;

    // If side income covers all expenses, 0 years needed (Barista FIRE immediately if assets > 0?)
    // But let's assume valid fire algorithm
    const newFireGoal = calculateFireNumber(Math.max(0, reducedExpensesObj), inputs.withdrawalRate);

    const shortcutYears = calculateYearsToFire(
        inputs.currentAssets,
        inputs.annualIncome - inputs.annualExpenses, // We assume savings rate doesn't change before FIRE, only goal changes
        inputs.investmentReturnRate,
        newFireGoal
    );

    if (shortcutYears === null) return 0;

    return Math.max(0, standardYears - shortcutYears);
};

/**
 * Calculates past asset trajectory from startAge (default 22) to currentAge.
 * Reverse engineers the required monthly saving to reach currentAssets assuming a fixed return rate.
 */
export const calculatePastAssetTrajectory = (
    currentAge: number,
    currentAssets: number,
    _accumulatedYears: number = 0, // Years of accumulation (default: currentAge - 22)
    assumedReturnRate: number = SIMULATION_DEFAULTS.DEFAULT_RETURN_RATE // 5% default
): { age: number; assets: number }[] => {
    const startAge = SIMULATION_DEFAULTS.START_AGE;
    const years = currentAge - startAge;

    if (years <= 0 || currentAssets <= 0) return [];

    const trajectory = [];
    const r = assumedReturnRate / 100;

    // Formula for Future Value of Annuity (Annual savings P):
    // FV = P * ((1 + r)^n - 1) / r
    // Therefore, P = (FV * r) / ((1 + r)^n - 1)

    let annualSaving = 0;
    if (r === 0) {
        annualSaving = currentAssets / years;
    } else {
        annualSaving = (currentAssets * r) / (Math.pow(1 + r, years) - 1);
    }

    // Generate points
    let currentBalance = 0;
    for (let i = 0; i <= years; i++) {
        const age = startAge + i;

        trajectory.push({
            age: age,
            assets: Math.round(currentBalance)
        });

        // Apply growth and saving for next year
        currentBalance = currentBalance * (1 + r) + annualSaving;
    }

    // Force the last point to match exactly (to avoid rounding errors)
    if (trajectory.length > 0) {
        trajectory[trajectory.length - 1].assets = currentAssets;
    }

    return trajectory;
};
