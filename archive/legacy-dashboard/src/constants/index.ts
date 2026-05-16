/**
 * Application-wide constants
 */

// NISA (Nippon Individual Savings Account) limits
export const NISA_LIMITS = {
  MAX_ANNUAL: 3_600_000,
  MAX_LIFETIME: 18_000_000,
} as const;

// Tax rates
export const TAX_RATES = {
  CAPITAL_GAINS: 0.20315, // 20.315%
} as const;

// Simulation defaults
export const SIMULATION_DEFAULTS = {
  MAX_AGE: 100,
  START_AGE: 22,
  DEFAULT_RETURN_RATE: 5, // 5%
  DEFAULT_INFLATION_RATE: 2, // 2%
  DEFAULT_WITHDRAWAL_RATE: 4, // 4%
} as const;

// Monte Carlo simulation
export const MONTE_CARLO = {
  DEFAULT_ITERATIONS: 1000,
  DEFAULT_VOLATILITY: 0.15, // 15%
  SP500_VOLATILITY: 0.182, // 18.2%
  ALL_COUNTRY_VOLATILITY: 0.155, // 15.5%
} as const;

// Portfolio types
export const PORTFOLIO_VOLATILITY = {
  sp500: MONTE_CARLO.SP500_VOLATILITY,
  all_country: MONTE_CARLO.ALL_COUNTRY_VOLATILITY,
  custom: MONTE_CARLO.DEFAULT_VOLATILITY,
} as const;

// Learning XP thresholds
export const LEARNING = {
  XP_PER_MODULE: 100,
  MODULES_PER_RANK: 3,
} as const;
