const DEFAULT_WITHDRAWAL_RATE = 4;

export const calculateFireNumber = (
  annualExpenses: number,
  withdrawalRate: number = DEFAULT_WITHDRAWAL_RATE,
): number => {
  if (!Number.isFinite(annualExpenses) || annualExpenses < 0) return 0;
  if (!Number.isFinite(withdrawalRate) || withdrawalRate <= 0) return 0;

  return Math.round(annualExpenses / (withdrawalRate / 100));
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
