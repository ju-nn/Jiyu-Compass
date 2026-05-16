/**
 * Simple Japanese Tax Calculator
 * Estimates Net Income from Gross Income.
 * 
 * Logic assumptions for simplicity:
 * - Single person, no dependents (most conservative)
 * - Standard employment income deduction
 * - Social Insurance ~15%
 * - Resident Tax 10%
 * - Income Tax (Progressive rates)
 */

export const calculateNetIncome = (grossIncome: number): number => {
    if (grossIncome <= 0) return 0;

    // 1. Social Insurance (approx 14.4% - 15%)
    // Health (~5%), Pension (~9%), Employment Insurance (~0.4%)
    // Cap might apply but for simplicity we use a flat rate up to a reasonable limit or simple percentage.
    const socialInsuranceRate = 0.15;
    const socialInsurance = grossIncome * socialInsuranceRate;

    // 2. Employment Income Deduction (Kyuyo Shotoku Kojo)
    let employmentDeduction = 0;
    if (grossIncome <= 1625000) {
        employmentDeduction = 550000;
    } else if (grossIncome <= 1800000) {
        employmentDeduction = grossIncome * 0.4 - 100000;
    } else if (grossIncome <= 3600000) {
        employmentDeduction = grossIncome * 0.3 + 80000;
    } else if (grossIncome <= 6600000) {
        employmentDeduction = grossIncome * 0.2 + 440000;
    } else if (grossIncome <= 8500000) {
        employmentDeduction = grossIncome * 0.1 + 1100000;
    } else {
        employmentDeduction = 1950000; // Capped at 8.5M+
    }

    // 3. Taxable Income Calculation
    // Basic Deduction (Kiso Kojo) = 480,000 (for most people)
    const basicDeduction = 480000;

    // Taxable Income = Gross - EmploymentDeduction - SocialInsurance - BasicDeduction
    let taxableIncome = grossIncome - employmentDeduction - socialInsurance - basicDeduction;
    if (taxableIncome < 0) taxableIncome = 0;
    // Resident tax taxable income is slightly different (basic deduction 430k) but we assume similiar for approx.

    // 4. Income Tax (Shotoku Zei) - Progressive
    let incomeTax = 0;
    if (taxableIncome <= 1950000) {
        incomeTax = taxableIncome * 0.05;
    } else if (taxableIncome <= 3300000) {
        incomeTax = taxableIncome * 0.10 - 97500;
    } else if (taxableIncome <= 6950000) {
        incomeTax = taxableIncome * 0.20 - 427500;
    } else if (taxableIncome <= 9000000) {
        incomeTax = taxableIncome * 0.23 - 636000;
    } else if (taxableIncome <= 18000000) {
        incomeTax = taxableIncome * 0.33 - 1536000;
    } else {
        // Higher brackets exists but this covers most FIRE aspirants
        incomeTax = taxableIncome * 0.40 - 2796000;
    }
    // Restoration Income Surtax (2.1%)
    incomeTax = incomeTax * 1.021;

    // 5. Resident Tax (Jumin Zei) - Flat 10% + Base (~5000yen)
    // Taxable income for resident tax usually has basic deduction of 430k instead of 480k, so adds ~50k to taxable.
    const residentTaxableIncome = Math.max(0, taxableIncome + (basicDeduction - 430000));
    const residentTax = residentTaxableIncome * 0.10 + 5000;

    const totalTax = socialInsurance + incomeTax + residentTax;
    const netIncome = grossIncome - totalTax;

    return Math.round(netIncome);
};

/**
 * Approximates Gross Income from Net Income.
 * Uses binary search since calculateNetIncome is monotonic.
 */
export const calculateGrossIncomeFromNet = (targetNetIncome: number): number => {
    if (targetNetIncome <= 0) return 0;

    let low = 0;
    let high = targetNetIncome * 2; // Initial guess high enough
    let gross = 0;

    // Performance optimization: find a better 'high' range if needed
    while (calculateNetIncome(high) < targetNetIncome) {
        high *= 2;
    }

    // Binary search for 20 iterations is enough for reasonable precision
    for (let i = 0; i < 20; i++) {
        gross = (low + high) / 2;
        const currentNet = calculateNetIncome(gross);

        if (currentNet < targetNetIncome) {
            low = gross;
        } else {
            high = gross;
        }
    }

    return Math.round(high);
};
